import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import LoginPage from './LoginPage';
import AdminPage from './AdminPage';
// import UserPage from './UserPage'; // Commented out as it's not finished

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initially, no one is logged in
    this.state = {
      isAdmin: true,       //for implementing admin page, so it is on 
      isLoggedIn: true
    };
  }

  logInAsAdmin = () => {
    // This method would be called when the admin successfully logs in
    this.setState({ isAdmin: true, isLoggedIn: true });
  }

  logOut = () => {
    // When logging out, revert to the initial state
    this.setState({ isAdmin: false, isLoggedIn: false });
  }

  render() {
    const { isLoggedIn, isAdmin } = this.state;
    return (
      <BrowserRouter>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <NavLink className="navbar-brand" to="/">Home</NavLink>
            <div className="ms-auto">
              <button onClick={this.logOut} className="btn btn-danger rounded-pill"> <i class="bi bi-key"></i> Log Out</button>
            </div>
          </nav>
          <hr />
          <Routes>
            <Route path="/" element={isLoggedIn ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/user" />) : <LoginPage logInAsAdmin={this.logInAsAdmin} />} />
            {/* <Route path="/user" element={<UserPage />} /> */}
            <Route path="/admin" element={isAdmin ? <AdminPage /> : <Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;