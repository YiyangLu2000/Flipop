import React, { useState } from "react";
import './Login.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log("Logging in with:", email, password);

    const loginData = {
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      console.log("Login successful:", data);
      // Handle login success (e.g., redirect to a dashboard or store user info)
    } catch (error) {
      console.error(error);
    }
  };

  // Handle Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    console.log("Registering with:", email, password);

    const registerData = {
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      // Handle registration success (e.g., redirect to login or welcome page)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-form container-fluid d-flex flex-column justify-content-center align-items-center min-vh-80">
      <form onSubmit={handleLoginSubmit} className="w-50">
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
        {errorMessage && <div className="text-danger">{errorMessage}</div>}
        <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-sm-between align-items-center text-center mx-auto">
          <button type="submit" className="btn btn-dark px-5 mb-2 mb-sm-0">
            Log In
          </button>
          <button type="button" onClick={handleRegisterSubmit} className="btn btn-dark px-5">
            New User Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
