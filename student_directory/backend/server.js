const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { randomUUID } = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5009;
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_lecture_db';

let memoryStudents = [];
let dbConnected = false;

// Middleware
app.use(cors());
app.use(express.json());

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  subject: { type: String, required: true },
  grade: { type: Number, required: true, min: 0, max: 100 },
});

const Student = mongoose.model('Student', studentSchema);

const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    dbConnected = true;
    console.log('🚀 Successfully connected to MongoDB.');
  } catch (err) {
    dbConnected = false;
    console.warn('⚠ MongoDB not available. Falling back to in-memory storage.', err.message);
  }
};

const createStudentRecord = async (payload) => {
  if (dbConnected) {
    const newStudent = new Student(payload);
    return newStudent.save();
  }

  const student = {
    _id: randomUUID(),
    ...payload,
  };

  memoryStudents.push(student);
  return student;
};

const readStudentRecords = async () => {
  if (dbConnected) {
    return Student.find();
  }

  return memoryStudents;
};

const readStudentRecordById = async (id) => {
  if (dbConnected) {
    return Student.findById(id);
  }

  return memoryStudents.find((student) => student._id === id);
};

const deleteStudentRecord = async (id) => {
  if (dbConnected) {
    return Student.findByIdAndDelete(id);
  }

  const index = memoryStudents.findIndex((student) => student._id === id);
  if (index === -1) return null;

  const [deletedStudent] = memoryStudents.splice(index, 1);
  return deletedStudent;
};
// 1. CREATE (POST)
app.post('/api/students', async (req, res) => {
  try {
    const savedStudent = await createStudentRecord(req.body);
    res.status(201).json(savedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 2. READ ALL (GET)
app.get('/api/students', async (req, res) => {
  try {
    const students = await readStudentRecords();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2.1 READ BY ID (GET)
app.get('/api/students/:id', async (req, res) => {
  try {
    const student = await readStudentRecordById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. UPDATE (PUT)
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await updateStudentRecord(req.params.id, req.body);
    if (!updatedStudent) return res.status(404).json({ error: 'Student not found' });
    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. DELETE (DELETE)
app.delete('/api/students/:id', async (req, res) => {
  try {
    const deletedStudent = await deleteStudentRecord(req.params.id);
    if (!deletedStudent) return res.status(404).json({ error: 'Student not found' });
    res.status(200).json({ message: 'Student record deleted cleanly.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', database: dbConnected ? 'mongo' : 'memory' });
});

connectToDatabase().catch(() => {});

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`📡 Server is actively listening on port ${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const fallbackPort = port + 1;
      console.warn(`⚠ Port ${port} is busy. Trying ${fallbackPort} instead.`);
      startServer(fallbackPort);
    } else {
      throw error;
    }
  });
};

startServer(PORT);