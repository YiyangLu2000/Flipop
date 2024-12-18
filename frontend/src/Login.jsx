import React, { useState } from "react";
import './Login.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", email, password);
    // Add your login logic here (e.g., call an API for authentication)
  };

  return (
    <div className="login-form container-fluid d-flex flex-column justify-content-center align-items-center min-vh-80">
      <form onSubmit={handleSubmit} className="w-50">
        <div className="mb-3 text-center">
          <label>Email</label>
          <input
            type="email"
            className="form-control text-center"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3 text-center">
          <label>Password</label>
          <input
            type="password"
            className="form-control text-center"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-dark px-5">
            Log In
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
