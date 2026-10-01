import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let isConnected = false;
let fallbackStore = null;

class MemoryModel {
  constructor(name, dataStore) {
    this.name = name;
    this.store = dataStore;
  }

  _getDocs() {
    if (!this.store.data[this.name]) {
      this.store.data[this.name] = [];
    }
    return this.store.data[this.name];
  }

  _save() {
    this.store.persist();
  }

  _match(doc, filter = {}) {
    if (!filter || Object.keys(filter).length === 0) return true;
    for (const [key, val] of Object.entries(filter)) {
      if (key === '_id') {
        if (String(doc._id) !== String(val)) return false;
      } else if (key === '$or') {
        const matchesOr = val.some(subFilter => this._match(doc, subFilter));
        if (!matchesOr) return false;
      } else if (val && typeof val === 'object' && !Array.isArray(val)) {
        if ('$in' in val && !val.$in.map(String).includes(String(doc[key]))) return false;
        if ('$gte' in val && !(doc[key] >= val.$gte)) return false;
        if ('$lte' in val && !(doc[key] <= val.$lte)) return false;
        if ('$ne' in val && doc[key] === val.$ne) return false;
      } else if (doc[key] !== val) {
        return false;
      }
    }
    return true;
  }

  find(filter = {}) {
    const docs = this._getDocs().filter(d => this._match(d, filter));
    const clone = JSON.parse(JSON.stringify(docs));
    return new QueryBuilder(clone, this.store);
  }

  findOne(filter = {}) {
    const doc = this._getDocs().find(d => this._match(d, filter));
    const result = doc ? JSON.parse(JSON.stringify(doc)) : null;
    return new SingleQueryBuilder(result, this.store);
  }

  findById(id) {
    return this.findOne({ _id: id });
  }

  async countDocuments(filter = {}) {
    const docs = this._getDocs().filter(d => this._match(d, filter));
    return docs.length;
  }

  async create(docData) {
    const docs = Array.isArray(docData) ? docData : [docData];
    const created = docs.map(data => {
      const item = {
        _id: data._id || 'id_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data
      };
      this._getDocs().push(item);
      return item;
    });
    this._save();
    return Array.isArray(docData) ? JSON.parse(JSON.stringify(created)) : JSON.parse(JSON.stringify(created[0]));
  }

  async insertMany(docs) {
    return this.create(docs);
  }

  async updateOne(filter, update) {
    const doc = this._getDocs().find(d => this._match(d, filter));
    if (!doc) return { matchedCount: 0, modifiedCount: 0 };
    if (update.$set) Object.assign(doc, update.$set);
    if (update.$inc) {
      for (const [k, v] of Object.entries(update.$inc)) {
        doc[k] = (doc[k] || 0) + v;
      }
    }
    if (update.$push) {
      for (const [k, v] of Object.entries(update.$push)) {
        if (!Array.isArray(doc[k])) doc[k] = [];
        doc[k].push(v);
      }
    }
    for (const [k, v] of Object.entries(update)) {
      if (!k.startsWith('$')) doc[k] = v;
    }
    doc.updatedAt = new Date().toISOString();
    this._save();
    return { matchedCount: 1, modifiedCount: 1 };
  }

  async updateMany(filter, update) {
    const docs = this._getDocs().filter(d => this._match(d, filter));
    docs.forEach(doc => {
      if (update.$set) Object.assign(doc, update.$set);
      if (update.$inc) {
        for (const [k, v] of Object.entries(update.$inc)) doc[k] = (doc[k] || 0) + v;
      }
      for (const [k, v] of Object.entries(update)) {
        if (!k.startsWith('$')) doc[k] = v;
      }
      doc.updatedAt = new Date().toISOString();
    });
    this._save();
    return { matchedCount: docs.length, modifiedCount: docs.length };
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const doc = this._getDocs().find(d => String(d._id) === String(id));
    if (!doc) return null;
    if (update.$set) Object.assign(doc, update.$set);
    if (update.$inc) {
      for (const [k, v] of Object.entries(update.$inc)) doc[k] = (doc[k] || 0) + v;
    }
    for (const [k, v] of Object.entries(update)) {
      if (!k.startsWith('$')) doc[k] = v;
    }
    doc.updatedAt = new Date().toISOString();
    this._save();
    return JSON.parse(JSON.stringify(doc));
  }

  async deleteOne(filter) {
    const index = this._getDocs().findIndex(d => this._match(d, filter));
    if (index !== -1) {
      this._getDocs().splice(index, 1);
      this._save();
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  async deleteMany(filter) {
    const initialLen = this._getDocs().length;
    const remaining = this._getDocs().filter(d => !this._match(d, filter));
    this.store.data[this.name] = remaining;
    this._save();
    return { deletedCount: initialLen - remaining.length };
  }
}

class QueryBuilder {
  constructor(data, store) {
    this.data = data;
    this.store = store;
  }

  sort(sortObj) {
    if (!sortObj) return this;
    const [field, order] = Object.entries(sortObj)[0];
    this.data.sort((a, b) => {
      if (a[field] < b[field]) return order === -1 || order === 'desc' ? 1 : -1;
      if (a[field] > b[field]) return order === -1 || order === 'desc' ? -1 : 1;
      return 0;
    });
    return this;
  }

  limit(num) {
    this.data = this.data.slice(0, num);
    return this;
  }

  skip(num) {
    this.data = this.data.slice(num);
    return this;
  }

  select(fields) {
    return this;
  }

  populate(field, select) {
    // Basic automatic relationship population
    const modelMap = {
      userId: 'User',
      pathId: 'LearningPath',
      moduleId: 'Module',
      taskId: 'Task',
      challengeId: 'Challenge',
      quizId: 'Quiz',
      achievementId: 'Achievement',
      resourceId: 'Resource',
      createdBy: 'User'
    };
    const targetModel = modelMap[field];
    if (targetModel && this.store.data[targetModel]) {
      this.data.forEach(item => {
        if (item[field]) {
          const matched = this.store.data[targetModel].find(m => String(m._id) === String(item[field]));
          if (matched) {
            item[field] = JSON.parse(JSON.stringify(matched));
            if (select && targetModel === 'User') {
              delete item[field].passwordHash;
            }
          }
        }
      });
    }
    return this;
  }

  lean() {
    return this;
  }

  then(resolve, reject) {
    return Promise.resolve(this.data).then(resolve, reject);
  }
}

class SingleQueryBuilder {
  constructor(data, store) {
    this.data = data;
    this.store = store;
  }

  select(fields) {
    if (this.data && fields.includes('-passwordHash')) {
      delete this.data.passwordHash;
    }
    return this;
  }

  populate(field) {
    if (!this.data) return this;
    const modelMap = {
      userId: 'User',
      pathId: 'LearningPath',
      moduleId: 'Module',
      taskId: 'Task',
      challengeId: 'Challenge',
      quizId: 'Quiz',
      achievementId: 'Achievement',
      resourceId: 'Resource',
      createdBy: 'User'
    };
    const targetModel = modelMap[field];
    if (targetModel && this.store.data[targetModel] && this.data[field]) {
      const matched = this.store.data[targetModel].find(m => String(m._id) === String(this.data[field]));
      if (matched) {
        this.data[field] = JSON.parse(JSON.stringify(matched));
        delete this.data[field].passwordHash;
      }
    }
    return this;
  }

  lean() {
    return this;
  }

  then(resolve, reject) {
    return Promise.resolve(this.data).then(resolve, reject);
  }
}

class JSONStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = {};
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf8');
        this.data = JSON.parse(raw);
      } else {
        this.data = {};
        this.persist();
      }
    } catch (err) {
      this.data = {};
    }
  }

  persist() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to persist store:', err.message);
    }
  }
}

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codequest';
  try {
    const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.log('ℹ️ Local MongoDB instance not reachable, activating CodeQuest In-Memory Document Store with auto-persistence.');
    const storePath = path.join(__dirname, '../data/store.json');
    fallbackStore = new JSONStore(storePath);
    isConnected = false;
    return false;
  }
};

export const getModel = (modelName, mongooseModel) => {
  if (isConnected && mongooseModel) {
    return mongooseModel;
  }
  if (!fallbackStore) {
    const storePath = path.join(__dirname, '../data/store.json');
    fallbackStore = new JSONStore(storePath);
  }
  return new MemoryModel(modelName, fallbackStore);
};