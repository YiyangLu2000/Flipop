import React, { useState } from "react";
import './App.css';
import Header from "./Header";
import Footer from "./Footer";
import Login from "./Login";

function App() {
  const [showLogin, setShowLogin] = useState(false);

  const toggleLoginPopup = () => {
    setShowLogin(!showLogin);
  };


  return (
    <>
      <Header onLoginClick={toggleLoginPopup} />
      <hr className="border border-secondary" />
      <div className="app container-fluid d-flex flex-column justify-content-center align-items-center min-vh-80">
        <h1 className="text-center">What do you want to read today?</h1>
        <p className="text-center">Tap to start and select the keywords you’re interested in</p>
        <button className="btn btn-dark px-5">Start</button>
      </div>
      <hr className="border border-secondary" />
      <Footer />
      {showLogin && (
        <div className="modal-backdrop fade show">
          <div className="modal modal-lg d-block" tabIndex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="close btn btn-light"
                    data-dismiss="modal"
                    onClick={toggleLoginPopup}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <Login />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
