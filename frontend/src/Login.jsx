import React, { useState } from "react";
import './Login.css';

function Login({ toggleLoginPopup }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isRegistered, setIsRegistered] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showEmailValidation, setShowEmailValidation] = useState(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setShowEmailValidation(true);
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    try {
      const response = await fetch("http://localhost:8080/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
        throw new Error(errorData.message || "Failed to validate email");
      }
      const data = await response.json();
      if (data.exist) {
        setIsRegistered(true);
      }
      setErrorMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  const validatePassword = (password) => {
    const rules = [
      { rule: "A minimum length of 8 characters.", isValid: password.length >= 8 },
      { rule: "At least one number.", isValid: /\d/.test(password) },
      { rule: "At least one letter.", isValid: /[a-zA-Z]/.test(password) },
    ];
    const hasInvalidRule = rules.some((rule) => !rule.isValid);
    if (hasInvalidRule) {
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const validPassword = validatePassword(password);
    setShowPasswordValidation(true);
    if (!validPassword) {
      setPasswordError("Password invalid, fix errors before submitting.");
      return;
    }
    setPasswordError("");
    try {
      const response = await fetch(`http://localhost:8080/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
        throw new Error(errorData.message || "Failed to process request");
      }

      const data = await response.json();
      console.log("Login successful", data);
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
          {isRegistered === null && (
            <>
              <div className="mt-4 mb-3 text-center">
                <h2 className="modal-title text-center">
                  Log in or Create an account
                </h2>
              </div>
              <div className="modal-body mb-5">
                <form onSubmit={handleEmailSubmit} noValidate>
                  <div className="mb-3 w-50 mx-auto">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      id="email"
                      className={`form-control ${showEmailValidation && emailError ? "is-invalid" : ""}`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    {/* Front end check */}
                    {showEmailValidation && emailError && (
                      <div className="text-danger mt-2">{emailError}</div>
                    )}
                    {/* Back end check */}
                    {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
                  </div>
                  <div className="mt-4 mb-5 w-50 mx-auto">
                    <button type="submit" className="btn btn-dark mb-5 w-100 custom-rounded-cell">
                      Continue
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
          {(isRegistered === true) && (
            <>
              <div className="mt-4 mb-3 text-center">
                <h2 className="modal-title text-center">
                  You already have an account with us.
                </h2>
                <p className="text-center">
                  Enter your password to log in.
                </p>
              </div>
              <div className="modal-body mb-5">
                <form onSubmit={handleFormSubmit} noValidate>
                  <div className="mb-3 w-50 mx-auto">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className={`form-control ${showPasswordValidation && passwordError ? "is-invalid" : ""}`}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    {showPasswordValidation && passwordError && (
                      <div className="text-danger mt-2">{passwordError}</div>
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
            </>
          )}
        </div>
      </div>
    </div >
  );
}

export default Login;
