import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const TIMEOUT_MS = 4000;
const MAX_BUFFER = 512 * 1024; // 512 KB

const runSingleTest = (command, args, input, tempDir) => {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let stdout = '';
    let stderr = '';
    let isFinished = false;

    const proc = spawn(command, args, {
      cwd: tempDir,
      windowsHide: true
    });

    const timer = setTimeout(() => {
      if (!isFinished) {
        isFinished = true;
        try { proc.kill('SIGKILL'); } catch (e) {}
        resolve({
          success: false,
          timedOut: true,
          error: 'Time Limit Exceeded (4.0s)',
          stdout,
          stderr,
          runtimeMs: TIMEOUT_MS
        });
      }
    }, TIMEOUT_MS);

    if (input) {
      try {
        proc.stdin.write(input);
        proc.stdin.end();
      } catch (err) {
        // ignore
      }
    } else {
      proc.stdin.end();
    }

    proc.stdout.on('data', (data) => {
      if (stdout.length < MAX_BUFFER) stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      if (stderr.length < MAX_BUFFER) stderr += data.toString();
    });

    proc.on('close', (code) => {
      if (isFinished) return;
      isFinished = true;
      clearTimeout(timer);
      const runtimeMs = Date.now() - startTime;
      resolve({
        success: code === 0,
        timedOut: false,
        exitCode: code,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        runtimeMs
      });
    });

    proc.on('error', (err) => {
      if (isFinished) return;
      isFinished = true;
      clearTimeout(timer);
      resolve({
        success: false,
        error: err.message,
        stdout: '',
        stderr: err.message,
        runtimeMs: Date.now() - startTime
      });
    });
  });
};

export const executeCode = async (language, code, testCases = [], customInput = '') => {
  const sessionId = 'cq_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const tempDir = path.join(os.tmpdir(), sessionId);
  fs.mkdirSync(tempDir, { recursive: true });

  const casesToRun = testCases && testCases.length > 0
    ? testCases
    : [{ input: customInput, expectedOutput: '', isHidden: false }];

  const cleanCode = (code || '').replace(/\r\n/g, '\n');

  try {
    let compileCmd = null;
    let compileArgs = [];
    let runCmd = '';
    let runArgs = [];

    const normLang = (language || '').toLowerCase().trim();

    if (normLang === 'python' || normLang === 'py') {
      const filePath = path.join(tempDir, 'solution.py');
      fs.writeFileSync(filePath, cleanCode, 'utf8');
      runCmd = 'python';
      runArgs = [filePath];
    } else if (normLang === 'javascript' || normLang === 'js') {
      const filePath = path.join(tempDir, 'solution.js');
      fs.writeFileSync(filePath, cleanCode, 'utf8');
      runCmd = 'node';
      runArgs = [filePath];
    } else if (normLang === 'c') {
      const srcPath = path.join(tempDir, 'solution.c');
      const binPath = path.join(tempDir, 'solution.exe');
      fs.writeFileSync(srcPath, cleanCode, 'utf8');
      compileCmd = 'gcc';
      compileArgs = [srcPath, '-o', binPath];
      runCmd = binPath;
      runArgs = [];
    } else if (normLang === 'cpp' || normLang === 'c++') {
      const srcPath = path.join(tempDir, 'solution.cpp');
      const binPath = path.join(tempDir, 'solution.exe');
      fs.writeFileSync(srcPath, cleanCode, 'utf8');
      compileCmd = 'g++';
      compileArgs = [srcPath, '-o', binPath];
      runCmd = binPath;
      runArgs = [];
    } else {
      return {
        status: 'ERROR',
        error: `Unsupported language: ${language}`,
        testResults: []
      };
    }

    if (compileCmd) {
      const compResult = await runSingleTest(compileCmd, compileArgs, '', tempDir);
      if (!compResult.success) {
        return {
          status: 'ERROR',
          error: compResult.stderr || 'Compilation error',
          testResults: []
        };
      }
    }

    const testResults = [];
    let totalPassed = 0;
    let totalRuntime = 0;

    for (let i = 0; i < casesToRun.length; i++) {
      const tc = casesToRun[i];
      const tcInput = (tc.input || '').replace(/\r\n/g, '\n');
      const result = await runSingleTest(runCmd, runArgs, tcInput, tempDir);
      totalRuntime += result.runtimeMs;

      let passed = false;
      const expected = (tc.expectedOutput || '').replace(/\r\n/g, '\n').trim();
      const actual = (result.stdout || '').replace(/\r\n/g, '\n').trim();

      if (!result.timedOut && result.success) {
        if (!expected) {
          passed = true;
        } else {
          passed = expected === actual;
        }
      }

      if (passed) totalPassed++;

      testResults.push({
        testCase: i + 1,
        input: tc.isHidden ? '[Hidden Test Case]' : tc.input,
        expected: tc.isHidden ? '[Hidden]' : expected,
        actual: tc.isHidden && !passed ? '[Hidden Test Failed]' : actual,
        passed,
        runtimeMs: result.runtimeMs,
        error: result.error || result.stderr || null,
        isHidden: !!tc.isHidden
      });

      if (result.timedOut || (!result.success && !expected)) {
        break;
      }
    }

    const allPassed = totalPassed === casesToRun.length;

    return {
      status: allPassed ? 'PASSED' : 'FAILED',
      allPassed,
      totalPassed,
      totalTests: casesToRun.length,
      averageRuntimeMs: Math.round(totalRuntime / (casesToRun.length || 1)),
      testResults
    };
  } catch (err) {
    return {
      status: 'ERROR',
      error: err.message,
      testResults: []
    };
  } finally {
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch (e) {}
  }
};