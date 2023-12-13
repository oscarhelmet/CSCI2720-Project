import React from 'react';
import './LoginPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    

      <div class="limiter">
        <div class="container-login100">
          <div class="wrap-login100">
            <div class="login100-pic js-tilt" data-tilt>
            </div>
            <form class="login100-form validate-form">
              <span class="login100-form-title">
                Member Login
              </span>
              <div class="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz">
                <input class="input100" type="text" name="email" placeholder="Email"/>
                  <span class="focus-input100"></span>
                  <span class="symbol-input100">
                    <i class="bi bi-envelope" aria-hidden="true"></i>
                  </span>
              </div>
              <div class="wrap-input100 validate-input" data-validate="Password is required">
                <input class="input100" type="password" name="pass" placeholder="Password"/>
                  <span class="focus-input100"></span>
                  <span class="symbol-input100">
                    <i class="bi bi-lock" aria-hidden="true"></i>
                  </span>
              </div>
              <div class="container-login100-form-btn">
                <button class="login100-form-btn">
                  Login
                </button>
              </div>
              <div class="text-center p-t-12">
                <span class="txt1">
                  Forgot
                </span>
                <a class="txt2" href="#">
                  Username / Password?
                </a>
              </div>
              <div class="text-center p-t-136">
                <a class="txt2" href="#">
                  Create your Account
                  <i class="bi bi-arrow-right" aria-hidden="true"></i>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;