import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login, Register, Chat } from "./pages"
function App() {
 
  return (
    <Router>
      <Routes>
        <Route path='/' element={ <Login />} exact/>
        <Route path='/register' element={ <Register />} exact/>
        <Route path='/chat' element={ <Chat />} exact/>
      </Routes>
    </Router>
  )
}

export default App
