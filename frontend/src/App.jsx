import React from "react";
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 
import Header from "./Header";
import Footer from "./Footer";
import Login from "./Login";

function App() {
  return (
    <Router>
      <Header />
      <hr className="border border-secondary" />
      <Routes>
        <Route
          path="/"
          element={
            <div className="app container-fluid d-flex flex-column justify-content-center align-items-center min-vh-80">
              <h1 className="text-center">What do you want to read today?</h1>
              <p className="text-center">Tap to start and select the keywords you’re interested in</p>
              <button className="btn btn-dark px-5">Start</button>
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
      <hr className="border border-secondary" />
      <Footer />
    </Router>
  );
}

export default App;
