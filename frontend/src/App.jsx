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
        <Login toggleLoginPopup={toggleLoginPopup} />
      )}
    </>
  );
}

export default App;
