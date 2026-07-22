import { useState, useEffect } from 'react';
//import './App.css';

function AdminView() {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form submission handling for both CREATE and UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Handling UPDATE (PUT)
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const updatedData = await response.json();
        setStudents(students.map(s => s._id === editingId ? updatedData : s));
        setEditingId(null);
      } else {
        // Handling CREATE (POST)
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const dynamicNewStudent = await response.json();
        if (response.ok) {
          setStudents([...students, dynamicNewStudent]);
        } else {
          alert(dynamicNewStudent.error || "Form validation error occurred.");
        }
      }
      // Reset input form
      setFormData({ name: '', rollNumber: '', subject: '', grade: '' });
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  const startEdit = (student) => {
    setEditingId(student._id);
    setFormData({ name: student.name, rollNumber: student.rollNumber, subject: student.subject, grade: student.grade });
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to drop this student record?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      // Optimistic UI state filtering
      setStudents(students.filter(s => s._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="workspace">
      <header>
        <h1>🎓 Academy Administrator Console</h1>
      </header>
      
      <section className="form-section">
        <form onSubmit={handleSubmit} className="entry-form">
          <h3>{editingId ? "Modify Existing Student Profile" : "Enroll New Student"}</h3>
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          <input type="text" name="rollNumber" placeholder="ID Roll Number" value={formData.rollNumber} onChange={handleChange} disabled={!!editingId} required />
          <input type="text" name="subject" placeholder="Assigned Subject" value={formData.subject} onChange={handleChange} required />
          <input type="number" name="grade" placeholder="Grade (0-100)" value={formData.grade} onChange={handleChange} min="0" max="100" required />
          
          <button type="submit" className="primary-btn">{editingId ? "Save Modifications" : "Commit Record"}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', rollNumber: '', subject: '', grade: '' }); }}>Cancel</button>}
        </form>
      </section>
      <div className="roster-view">
        <table>
          <thead>
            <tr>
              <th>ID Roll Number</th>
              <th>Name</th>
              <th>Subject</th>
              <th>Grade Performance</th>
              <th>Management Control</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id}>
                <td>{student.rollNumber}</td>
                <td>{student.name}</td>
                <td>{student.subject}</td>
                <td><span className="badge">{student.grade}%</span></td>
                <td>
                  <button onClick={() => startEdit(student)} className="edit-btn">Edit</button>
                  <button onClick={() => deleteStudent(student._id)} className="delete-btn">Drop</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminView;