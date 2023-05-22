import React from 'react';
import Navbar from './navbar';
import Charts from './Charts';
import AM from './AM';
import FM from './FM';
import PM from './PM';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';




function App() {
  return (
    <>
    <Router>
      <Navbar></Navbar>
        <Routes>
          <Route path='/' element={<Charts/>}></Route>
          <Route path='/AM' element={<AM/>}></Route>
          <Route path='/FM' element={<FM/>}></Route>
          <Route path='/PM' element={<PM/>}></Route>
        </Routes>
    </Router>
    </>

  );
}

export default App;
