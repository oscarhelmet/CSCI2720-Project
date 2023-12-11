import React from 'react';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  handleLogin = (event) => {
    event.preventDefault();
    // Here you would handle the login verification logic
    // For now, simulate successful login
    this.props.history.push('/admin');
  }

  render() {
    return (
      <div className="container mt-5">
        <h2>Login</h2>
        <form onSubmit={this.handleLogin}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              className="form-control"
              value={this.state.username}
              onChange={(e) => this.setState({ username: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              className="form-control"
              value={this.state.password}
              onChange={(e) => this.setState({ password: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
      </div>
    );
  }
}

export default LoginPage;