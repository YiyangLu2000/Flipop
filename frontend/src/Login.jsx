import React, { useState } from "react";
import './Login.css';

function Login({ toggleLoginPopup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const initialPasswordRules = [
    { rule: "A minimum length of 8 characters.", isValid: false },
    { rule: "At least one number.", isValid: false },
    { rule: "At least one letter.", isValid: false },
  ];
  const [passwordErrors, setPasswordErrors] = useState(initialPasswordRules);
  const [isRegistered, setIsRegistered] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showValidation, setShowValidation] = useState(false);

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

  const validatePassword = (password) => {
    const rules = [
      { rule: "A minimum length of 8 characters.", isValid: password.length >= 8 },
      { rule: "At least one number.", isValid: /\d/.test(password) },
      { rule: "At least one letter.", isValid: /[a-zA-Z]/.test(password) },
    ];
    return rules;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordErrors(validatePassword(newPassword));
  };

  const sortedErrors = [...passwordErrors].sort((a, b) => a.isValid - b.isValid);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const updatedErrors = validatePassword(password);
    setPasswordErrors(updatedErrors);
    setShowValidation(true); // Highlight unsatisfied rules

    // Check if all rules are satisfied
    if (updatedErrors.every((error) => error.isValid)) {
      console.log("Password valid, sending to backend...");
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
          setErrorMessage(errorData.message);
          throw new Error(errorData.message || "Failed to process request");
        }
  
        const data = await response.json();
        console.log(`${isRegistered ? "Login" : "Register"} successful`, data);
        // Handle success (e.g., redirect, store token, etc.)
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Password invalid, fix errors before submitting.");
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
            <form onSubmit={isRegistered === null ? handleEmailSubmit : handleFormSubmit} noValidate>
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
                      className={`form-control custom-rounded-cell ${showValidation && passwordErrors.some((error) => !error.isValid) ? "is-invalid" : ""}`}
                      id="password"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                    />
                    <ul className="custom-bullet-fs mt-2">
                      {sortedErrors.map((error, index) => (
                        <li
                          key={index}
                          className={`${error.isValid ? "text-success" : "text-secondary"} ${!error.isValid && showValidation ? "text-danger" : ""}`}
                        >
                          {error.rule}
                        </li>
                      ))}
                    </ul>
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
