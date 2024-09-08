import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Test from "./components/Test";

function App() {
  return (
    <div className="App">

      <BrowserRouter>

        <Routes>
          <Route path="/" element={<Test/>} />
        </Routes>

      </BrowserRouter>



    </div>
  );
}

export default App;
