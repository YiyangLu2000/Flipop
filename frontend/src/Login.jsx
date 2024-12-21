import React, { useState } from "react";
import './Login.css';

function Login({ toggleLoginPopup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
        throw new Error(errorData.message || "Failed to validate email");
      }

      const data = await response.json();
      setIsRegistered(data.exist);
      setErrorMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegistered ? "login" : "register";
      const response = await fetch(`http://localhost:8080/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("errorData.message", errorData.message);
        setErrorMessage(errorData.message);
        throw new Error(errorData.message || "Failed to process request");
      }

      const data = await response.json();
      console.log(`${isRegistered ? "Login" : "Register"} successful`, data);
      // Handle success (e.g., redirect, store token, etc.)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal modal-lg d-block modal-background" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content custom-rounded-modal">
          <div className="d-flex justify-content-end p-5">
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => {
                toggleLoginPopup();
                setIsRegistered(null);
              }}
            ></button>
          </div>
          <div className="mt-4 mb-3 text-center">
            <h2 className="modal-title text-center">
              {isRegistered === null
                ? "Log in or Create an account"
                : isRegistered
                  ? "You have registered with us."
                  : "Please create your account."}
            </h2>
            <p className="text-center">
              {isRegistered
                ? "Enter your password to log in."
                : "Enter your password to create an account on Flipop."}
            </p>
          </div>

          <div className="modal-body mb-5">
            <form onSubmit={isRegistered === null ? handleEmailSubmit : handleFormSubmit}>
              <div className="mb-3 w-50 mx-auto">
                {isRegistered === null && (
                  <>
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control custom-rounded-cell"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </>
                )}
                {(isRegistered === true || isRegistered === false) && (
                  <>
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control custom-rounded-cell"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                      {!isRegistered
                        && <ul className="custom-bullet-fs text-secondary">
                        <li>A minimal length of 8 characters.</li>
                        <li>At least one number.</li>
                        <li>At least one letter.</li>
                      </ul>
                      }
                  </>
                )}

                {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
              </div>

              <div className="mt-4 mb-5 w-50 mx-auto">
                <button type="submit" className="btn btn-dark mb-5 w-100 custom-rounded-cell">
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
