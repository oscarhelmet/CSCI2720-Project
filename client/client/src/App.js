import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import LoginPage from './LoginPage';
import AdminPage from './AdminPage';
import UserPage from './UserPage';
import LocationDetail from './LocationDetail';
import EventPage from './EventPage';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: true,       //for implementing admin page, so it is on 
      isLoggedIn: true
    };
  }

  logInAsAdmin = () => {
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
          <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-light" id='nav-index'>
            <NavLink className="navbar-brand" to="/">Home</NavLink>
            <NavLink className="navbar-brand" to="/admin">Admin</NavLink>
            <NavLink className="navbar-brand" to="/user">User</NavLink>
            {this.state.isLoggedIn && (
              <>
                <div className="ms-auto" id='logout'>
                  <button onClick={this.logOut} className="btn btn-danger rounded-pill">
                    <i className="bi bi-key"></i> Log Out
                  </button>
                </div>
              </>
            )}
          </nav>
          <hr />
          <Routes>
            <Route path="/" element={isLoggedIn ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/user" />) : <LoginPage logInAsAdmin={this.logInAsAdmin} />} />
            {/* <Route path="/user" element={<UserPage />} /> */}
            <Route path="/admin" element={<AdminPage />} />   {/*This is for debugging only*/}
            <Route path="/user" element={<UserPage />} /> 
            <Route path='/user/:id' element={<LocationDetail/>}/>
            <Route path='/user/event' element={<EventPage/>}/>
            
             

            <Route path="/admin" element={isAdmin ? <AdminPage /> : <Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;