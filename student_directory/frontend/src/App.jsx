import './App.css';
import AdminView from './components/AdminView/AdminView.jsx';
import StudentView from './components/StudentView/StudentView.jsx';
import SearchSportsAPI from './components/SearchSportsAPI/SearchSportsAPI.jsx';

function App() {
  const isAdmin = true; // Change this to false to simulate a student view

  return (
    <div className="main-container">
      {isAdmin ? <AdminView /> : <StudentView />}
      <br/>
      <h3> Sporst API Data</h3>
      <SearchSportsAPI />
    </div>
  );
}

export default App;