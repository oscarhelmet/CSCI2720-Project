import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'; 
import LoginPage from './LoginPage';
import AdminPage from './AdminPage';
import UserPage from './UserPage';

// import UserPage from './UserPage'; // This is for debugging only


class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <NavLink className="navbar-brand" to="/">Home</NavLink>
            <NavLink className="navbar-brand" to="/admin">Admin</NavLink>
            <NavLink className="navbar-brand" to="/user">User</NavLink>
          </nav>
          <hr/>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            {/* <Route path="/user" element={<UserPage />} /> */}
            <Route path="/admin" element={<AdminPage />} />   {/*This is for debugging only*/}
            <Route path="/user" element={<UserPage />} /> 
             
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;