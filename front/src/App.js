import logo from './logo.svg';
import './App.css';


import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import ChessMain from "./components/ChessMain";
import MainMenu from "./components/MainMenu";

import { Chessboard } from 'react-chessboard';
import NewChess from "./components/NewChess";
function App() {
  return (
      <div className="App">

          <BrowserRouter>

              <Routes>
                  {/*<Route path="/" element = {<MainMenu/>}/>*/}
                  <Route path="/" element={<NewChess/>}/>
              </Routes>

          </BrowserRouter>


          {/*<h1 className="text-3xl bg-green-200 font-bold underline">*/}
          {/*    Hello world!*/}
          {/*</h1>*/}

          <p>testing</p>


      </div>
  );
}

export default App;
