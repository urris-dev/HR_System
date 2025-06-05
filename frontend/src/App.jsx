import {BrowserRouter, Routes, Route} from 'react-router-dom';
import LoginForm from "./components/Login/Login";
import Workspace from './components/Workspace/Workspace';
import './App.css';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/workspace" element={<Workspace />}/>
    </Routes>
  </BrowserRouter>
  )
}

export default App
