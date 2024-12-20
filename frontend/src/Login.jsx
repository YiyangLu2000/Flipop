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

  return (
    <div className="login-form container-fluid d-flex flex-column justify-content-center align-items-center min-vh-100">
      <form onSubmit={handleLoginSubmit} className="w-100">
        <div className="mb-3 text-center">
          <h2 className="modal-title text-center">Log in or Create an account</h2>
        </div>
        <div className="mb-3 text-center w-50 mx-auto">
          <label>Email</label>
          <input
            type="email"
            className="form-control text-center"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {errorMessage && <div className="text-danger">{errorMessage}</div>}
        <div className="text-center">
          <button type="submit" className="btn btn-dark px-5 w-50 mx-auto">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
