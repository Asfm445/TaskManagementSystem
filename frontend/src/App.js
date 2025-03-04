import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RenderProgress from "./components/continuous/progressDates";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} path="/"></Route>
        <Route
          element={<RenderProgress></RenderProgress>}
          path="/continuous/progress"
        />
        <Route element={<Login></Login>} path="/login" />
        <Route element={<Register></Register>} path="/register" />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
