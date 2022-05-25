import React from "react";
import * as d3 from "d3";
import { Board, Piece } from "./chessItems.js";
import { chess, player, status, svgSize } from "./chessStyles";

const CHESS = "chess";
const CHESSID = "#chess";

const WHITE = "white";
const BLACK = "black";
const KING = "king";
const QUEEN = "queen";
const KNIGHT = "knight";
const BISHOP = "bishop";
const ROOK = "rook";
const PAWN = "pawn";

const piecesTypes = [KING, QUEEN, KNIGHT, BISHOP, ROOK, PAWN];

const start = {
  white: {
    king: ["d1"],
    queen: ["e1"],
    bishop: ["c1", "f1"],
    knight: ["b1", "g1"],
    rook: ["a1", "h1"],
    pawn: ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"],
  },
  black: {
    king: ["d8"],
    queen: ["e8"],
    bishop: ["c8", "f8"],
    knight: ["b8", "g8"],
    rook: ["a8", "h8"],
    pawn: ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"],
  },
};

class ChessGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      game: {},
      svg: {},
    };
  }

  componentDidMount() {
    var svg = d3.select(CHESSID);
    var board = new Board(svg, this.state.white);

    var game = {
      white: piecesTypes.map((key) =>
        start.white[key].map(
          (place) => new Piece(svg, board, place, WHITE, key)
        )
      ),
      black: piecesTypes.map((key) =>
        start.black[key].map(
          (place) => new Piece(svg, board, place, BLACK, key)
        )
      ),
    };
    //Do svg stuff
  }

  render() {
    return (
      <section style={chess}>
        <svg id={CHESS} style={svgSize}></svg>
        <div style={status}>
          <ul style={player}>
            <span>black</span>
            <li>1</li>
            <li>1</li>
            <li>1</li>
            <li>1</li>
            <li>1</li>
            <li>1</li>
            <li>1</li>
            <li>1</li>
            <li>1</li>
            <li>1</li>
            <li>1</li>
            <li>1</li>
          </ul>
          <ul style={player}>
            <span>white</span>
            <li>1</li>
            <li>1</li>
            <li>1</li>
            <li>1</li>
            <li>1</li>
            <li>1</li>
            <li>1</li>
            <li>1</li>
          </ul>
        </div>
      </section>
    );
  }
}

export default ChessGame;
