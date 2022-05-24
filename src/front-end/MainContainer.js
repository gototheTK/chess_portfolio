import React, { Component } from "react";
import Navbar from "./Navbar";
import Hamburger from "./Hamburger";
import ChessGame from "../chess/ChessGame";
import Board from "./board/Board";

class MainContainer extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <Hamburger />
        <ChessGame />
        <Board />
      </div>
    );
  }
}

export default MainContainer;
