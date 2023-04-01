import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./assets/global.css";
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Home from "./home/Home"
import Login from "./login/Login";
import Register from "./register/Register";
import ProtectedRoute from "./utils/ProtectedRoute";
import PublishedRoute from "./utils/publishedRoute";


const App = () => {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
          <Route path="/login" element={<PublishedRoute><Login/></PublishedRoute>}/>
          <Route path="/register" element={<PublishedRoute><Register/></PublishedRoute>}/>
        </Routes>
      </BrowserRouter>
    );
};

export default App;
