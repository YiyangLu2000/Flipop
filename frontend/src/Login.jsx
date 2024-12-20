import React, { useState } from "react";
import './Login.css';

function Login({ toggleLoginPopup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
    <div className="modal modal-lg d-block modal-background" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="d-flex justify-content-end mb-5">
            <button
              type="button"
              className="btn-close p-4"
              aria-label="Close"
              onClick={toggleLoginPopup}
            ></button>
          </div>
          <div className="mt-4 mb-3 text-center">
            <h2 className="modal-title text-center">Log in or Create an account</h2>
          </div>
          <div className="modal-body mb-5">
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-3 w-50 mx-auto">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}
              <div className="mt-4 mb-5 w-50 mx-auto">
                <button type="submit" className="btn btn-dark mb-5 w-100">Log In</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
