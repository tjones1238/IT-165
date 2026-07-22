import { useState, useEffect } from 'react';
//import './App.css';

function StudentView() {
  // Application State
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: '', rollNumber: '', subject: '', grade: '' });
  const [editingId, setEditingId] = useState(null);

  const API_URL = 'http://localhost:5019/api/students';

  // Fetch student roster automatically when the UI renders
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error("Failed to fetch students from API backend:", err);
    }
  };


  return (
    <div className="workspace">
      <header>
        <h1>🎓 Academy Student Portal</h1>
      </header>
      <div className="roster-view">
        <table>
          <thead>
            <tr>
              <th>ID Roll Number</th>
              <th>Name</th>
              <th>Subject</th>
              <th>Grade Performance</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id}>
                <td>{student.rollNumber}</td>
                <td>{student.name}</td>
                <td>{student.subject}</td>
                <td><span className="badge">{student.grade}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentView;