import { useState } from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import PropertyDetails from "./pages/PropertyDetails";
import Dashboard from "./pages/Dashboard";
import AddProperty from "./pages/AddProperty";
import Verification from "./pages/Verification";
// import './App.css'

function App() {
   return (
    
    
    <BrowserRouter>
      <Navbar/>
      <Routes>
        
        <Route path = "/" element={<Home/>} />
        <Route path = "/login" element = {<Login/>} />
        <Route path = "/register" element = {<Register/>} />
        <Route path = "/property/:id" element = {<PropertyDetails/>}/>
        <Route path = "/dashboard" element = {<Dashboard/>} />
        <Route path = "/add-property" element = {<AddProperty/>} />
        <Route path="/verification" element={<Verification />} />
        


      </Routes>

    </BrowserRouter>
    
  );
}

export default App
