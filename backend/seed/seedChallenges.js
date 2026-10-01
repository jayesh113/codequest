import { Challenge } from '../models/index.js';

export const seedChallenges = async () => {
  const challenges = [
    {
      title: 'Two Sum',
      slug: 'two-sum',
      difficulty: 'Easy',
      category: 'Arrays',
      xpReward: 100,
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Print the two indices separated by a space.',
      inputFormat: 'Line 1: space-separated integers for nums\nLine 2: target integer',
      outputFormat: 'Two space-separated indices: i j',
      constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
      examples: [
        { input: '2 7 11 15\n9', output: '0 1', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
        { input: '3 2 4\n6', output: '1 2', explanation: 'nums[1] + nums[2] = 2 + 4 = 6' }
      ],
      starterCode: {
        python: 'import sys\nlines = sys.stdin.read().strip().split("\\n")\nif len(lines) >= 2:\n    nums = list(map(int, lines[0].split()))\n    target = int(lines[1])\n    seen = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in seen:\n            print(f"{seen[comp]} {i}")\n            break\n        seen[num] = i\n',
        javascript: 'const fs = require("fs");\nconst lines = fs.readFileSync(0, "utf-8").trim().split("\\n");\nif (lines.length >= 2) {\n  const nums = lines[0].split(" ").map(Number);\n  const target = Number(lines[1]);\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (map.has(comp)) {\n      console.log(`${map.get(comp)} ${i}`);\n      break;\n    }\n    map.set(nums[i], i);\n  }\n}\n',
        c: '#include <stdio.h>\nint main() {\n    int nums[1000], n = 0, target;\n    while (scanf("%d", &nums[n]) == 1) {\n        n++; if (getchar() == \'\\n\') break;\n    }\n    scanf("%d", &target);\n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            if (nums[i] + nums[j] == target) {\n                printf("%d %d\\n", i, j);\n                return 0;\n            }\n        }\n    }\n    return 0;\n}\n',
        cpp: '#include <iostream>\n#include <vector>\n#include <unordered_map>\n#include <sstream>\nusing namespace std;\nint main() {\n    string line; if (!getline(cin, line)) return 0;\n    stringstream ss(line); int val; vector<int> nums;\n    while (ss >> val) nums.push_back(val);\n    int target; cin >> target;\n    unordered_map<int, int> seen;\n    for (int i = 0; i < nums.size(); i++) {\n        int comp = target - nums[i];\n        if (seen.count(comp)) {\n            cout << seen[comp] << " " << i << endl;\n            return 0;\n        }\n        seen[nums[i]] = i;\n    }\n    return 0;\n}\n'
      },
      testCases: [
        { input: '2 7 11 15\n9', expectedOutput: '0 1', isHidden: false },
        { input: '3 2 4\n6', expectedOutput: '1 2', isHidden: false },
        { input: '3 3\n6', expectedOutput: '0 1', isHidden: true },
        { input: '1 5 8 12 19\n20', expectedOutput: '0 4', isHidden: true }
      ]
    },
    {
      title: 'Valid Palindrome',
      slug: 'valid-palindrome',
      difficulty: 'Easy',
      category: 'Strings',
      xpReward: 80,
      description: 'Given a string s, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.',
      inputFormat: 'A single line containing the string s',
      outputFormat: 'true or false',
      constraints: ['1 <= s.length <= 2 * 10^5'],
      examples: [
        { input: 'A man a plan a canal Panama', output: 'true', explanation: 'After cleaning: amanaplanacanalpanama' },
        { input: 'race a car', output: 'false', explanation: 'After cleaning: raceacar' }
      ],
      starterCode: {
        python: 'import sys, re\ns = sys.stdin.read().strip()\nclean = re.sub(r"[^a-zA-Z0-9]", "", s).lower()\nprint("true" if clean == clean[::-1] else "false")\n',
        javascript: 'const fs = require("fs");\nconst s = fs.readFileSync(0, "utf-8").trim();\nconst clean = s.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();\nconsole.log(clean === clean.split("").reverse().join("") ? "true" : "false");\n',
        c: '#include <stdio.h>\n#include <ctype.h>\n#include <string.h>\nint main() {\n    char s[1000], clean[1000]; int k = 0;\n    if (fgets(s, sizeof(s), stdin)) {\n        for (int i = 0; s[i]; i++) {\n            if (isalnum(s[i])) clean[k++] = tolower(s[i]);\n        }\n        clean[k] = \'\\0\';\n        int isPal = 1;\n        for (int i = 0; i < k/2; i++) {\n            if (clean[i] != clean[k - 1 - i]) { isPal = 0; break; }\n        }\n        printf("%s\\n", isPal ? "true" : "false");\n    }\n    return 0;\n}\n',
        cpp: '#include <iostream>\n#include <string>\n#include <cctype>\nusing namespace std;\nint main() {\n    string s, clean = ""; getline(cin, s);\n    for (char c : s) if (isalnum(c)) clean += tolower(c);\n    int l = 0, r = clean.length() - 1; bool ok = true;\n    while (l < r) {\n        if (clean[l++] != clean[r--]) { ok = false; break; }\n    }\n    cout << (ok ? "true" : "false") << endl;\n    return 0;\n}\n'
      },
      testCases: [
        { input: 'A man a plan a canal Panama', expectedOutput: 'true', isHidden: false },
        { input: 'race a car', expectedOutput: 'false', isHidden: false },
        { input: 'Was it a car or a cat I saw', expectedOutput: 'true', isHidden: true }
      ]
    },
    {
      title: 'Fibonacci Number',
      slug: 'fibonacci-number',
      difficulty: 'Easy',
      category: 'Math',
      xpReward: 80,
      description: 'Compute the nth Fibonacci number where F(0)=0, F(1)=1, and F(n)=F(n-1)+F(n-2).',
      inputFormat: 'A single integer n',
      outputFormat: 'The nth Fibonacci number',
      constraints: ['0 <= n <= 30'],
      examples: [{ input: '4', output: '3', explanation: 'F(4)=3' }],
      starterCode: {
        python: 'import sys\nn = int(sys.stdin.read().strip())\nif n <= 1: print(n)\nelse:\n    a, b = 0, 1\n    for _ in range(2, n + 1): a, b = b, a + b\n    print(b)\n',
        javascript: 'const fs = require("fs");\nconst n = parseInt(fs.readFileSync(0, "utf-8").trim(), 10);\nif (n <= 1) console.log(n);\nelse {\n  let a = 0, b = 1;\n  for (let i = 2; i <= n; i++) {\n    const next = a + b; a = b; b = next;\n  }\n  console.log(b);\n}\n',
        c: '#include <stdio.h>\nint main() {\n    int n; if (scanf("%d", &n) != 1) return 0;\n    if (n <= 1) { printf("%d\\n", n); return 0; }\n    int a = 0, b = 1, next;\n    for (int i = 2; i <= n; i++) { next = a + b; a = b; b = next; }\n    printf("%d\\n", b); return 0;\n}\n',
        cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    if (n <= 1) { cout << n << endl; return 0; }\n    int a = 0, b = 1;\n    for (int i = 2; i <= n; i++) { int next = a + b; a = b; b = next; }\n    cout << b << endl; return 0;\n}\n'
      },
      testCases: [
        { input: '4', expectedOutput: '3', isHidden: false },
        { input: '6', expectedOutput: '8', isHidden: false },
        { input: '10', expectedOutput: '55', isHidden: true }
      ]
    },
    {
      title: 'Binary Search',
      slug: 'binary-search',
      difficulty: 'Easy',
      category: 'Searching',
      xpReward: 90,
      description: 'Given a sorted array of distinct integers nums and a target value, return its index if found, or -1 if not found.',
      inputFormat: 'Line 1: space-separated integers\nLine 2: target integer',
      outputFormat: 'Index or -1',
      constraints: ['1 <= nums.length <= 10^4'],
      examples: [{ input: '-1 0 3 5 9 12\n9', output: '4', explanation: '9 is at index 4' }],
      starterCode: {
        python: 'import sys\nlines = sys.stdin.read().strip().split("\\n")\nnums = list(map(int, lines[0].split()))\ntarget = int(lines[1])\nl, r, ans = 0, len(nums) - 1, -1\nwhile l <= r:\n    m = (l + r) // 2\n    if nums[m] == target: ans = m; break\n    elif nums[m] < target: l = m + 1\n    else: r = m - 1\nprint(ans)\n',
        javascript: 'const fs = require("fs");\nconst lines = fs.readFileSync(0, "utf-8").trim().split("\\n");\nconst nums = lines[0].split(" ").map(Number);\nconst target = Number(lines[1]);\nlet l = 0, r = nums.length - 1, ans = -1;\nwhile (l <= r) {\n  const m = Math.floor((l + r) / 2);\n  if (nums[m] === target) { ans = m; break; }\n  else if (nums[m] < target) l = m + 1;\n  else r = m - 1;\n}\nconsole.log(ans);\n',
        c: '#include <stdio.h>\nint main() {\n    int nums[1000], n = 0, target;\n    while (scanf("%d", &nums[n]) == 1) { n++; if (getchar() == \'\\n\') break; }\n    scanf("%d", &target);\n    int l = 0, r = n - 1, ans = -1;\n    while (l <= r) {\n        int m = (l + r) / 2;\n        if (nums[m] == target) { ans = m; break; }\n        else if (nums[m] < target) l = m + 1;\n        else r = m - 1;\n    }\n    printf("%d\\n", ans); return 0;\n}\n',
        cpp: '#include <iostream>\n#include <vector>\n#include <sstream>\nusing namespace std;\nint main() {\n    string line; getline(cin, line);\n    stringstream ss(line); int val; vector<int> nums;\n    while (ss >> val) nums.push_back(val);\n    int target; cin >> target;\n    int l = 0, r = nums.size() - 1, ans = -1;\n    while (l <= r) {\n        int m = l + (r - l) / 2;\n        if (nums[m] == target) { ans = m; break; }\n        else if (nums[m] < target) l = m + 1;\n        else r = m - 1;\n    }\n    cout << ans << endl; return 0;\n}\n'
      },
      testCases: [
        { input: '-1 0 3 5 9 12\n9', expectedOutput: '4', isHidden: false },
        { input: '-1 0 3 5 9 12\n2', expectedOutput: '-1', isHidden: false },
        { input: '2 4 6 8 10 12 14\n14', expectedOutput: '6', isHidden: true }
      ]
    },
    {
      title: 'Maximum Subarray (Kadane)',
      slug: 'maximum-subarray',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      xpReward: 150,
      description: 'Given an integer array nums, find the contiguous subarray with the largest sum, and return its sum.',
      inputFormat: 'Single line of space-separated integers',
      outputFormat: 'Max subarray sum',
      constraints: ['1 <= nums.length <= 10^5'],
      examples: [{ input: '-2 1 -3 4 -1 2 1 -5 4', output: '6', explanation: 'Subarray [4,-1,2,1] has sum = 6' }],
      starterCode: {
        python: 'import sys\nnums = list(map(int, sys.stdin.read().strip().split()))\nmax_so_far = curr = nums[0]\nfor x in nums[1:]:\n    curr = max(x, curr + x)\n    max_so_far = max(max_so_far, curr)\nprint(max_so_far)\n',
        javascript: 'const fs = require("fs");\nconst nums = fs.readFileSync(0, "utf-8").trim().split(" ").map(Number);\nlet maxSoFar = nums[0], curr = nums[0];\nfor (let i = 1; i < nums.length; i++) {\n  curr = Math.max(nums[i], curr + nums[i]);\n  maxSoFar = Math.max(maxSoFar, curr);\n}\nconsole.log(maxSoFar);\n',
        c: '#include <stdio.h>\nint main() {\n    int nums[1000], n = 0;\n    while (scanf("%d", &nums[n]) == 1) n++;\n    int maxSoFar = nums[0], curr = nums[0];\n    for (int i = 1; i < n; i++) {\n        curr = (nums[i] > curr + nums[i]) ? nums[i] : curr + nums[i];\n        if (curr > maxSoFar) maxSoFar = curr;\n    }\n    printf("%d\\n", maxSoFar); return 0;\n}\n',
        cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int val; vector<int> nums;\n    while (cin >> val) nums.push_back(val);\n    int maxSoFar = nums[0], curr = nums[0];\n    for (int i = 1; i < nums.size(); i++) {\n        curr = max(nums[i], curr + nums[i]);\n        maxSoFar = max(maxSoFar, curr);\n    }\n    cout << maxSoFar << endl; return 0;\n}\n'
      },
      testCases: [
        { input: '-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6', isHidden: false },
        { input: '5 4 -1 7 8', expectedOutput: '23', isHidden: true }
      ]
    }
  ];

  for (const c of challenges) {
    await Challenge.create(c);
  }
  console.log('✅ Created 5 Coding Challenges');
};