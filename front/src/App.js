import logo from './logo.svg';
import './App.css';


import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import ChessMain from "./components/ChessMain";
import MainMenu from "./components/MainMenu";

function App() {
  return (
      <div className="App">

          <BrowserRouter>

              <Routes>
                  <Route path="/" element = {<MainMenu/>}/>
                  <Route path="/:id" element={<ChessMain/>}/>
              </Routes>

          </BrowserRouter>


          {/*<h1 className="text-3xl bg-green-200 font-bold underline">*/}
          {/*    Hello world!*/}
          {/*</h1>*/}

          <p>test</p>
      </div>
  );
}

export default App;
