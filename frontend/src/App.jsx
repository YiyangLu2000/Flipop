import React from "react";
import './App.css'
import Header from "./Header";

function App() {
  return (
    <>
      <Header />
      <div className="app container-fluid d-flex flex-column justify-content-center align-items-center pt-5">
        <h1>What do you want to read today?</h1>
        <p>Tap to start and select the keywords you’re interested in</p>
      </div>
    </>
  )
}

export default App
