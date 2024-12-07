import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm.jsx'; 
import TableView from "./components/TableView.jsx"; 
import EditUser from "./components/EditUser.jsx"; 
import './styles.css'; 

const App = () => {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<> <RegistrationForm /> </>} />
          <Route path="/table-view" element={<TableView />} />
          <Route path="/edit/:id" element={<EditUser />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
