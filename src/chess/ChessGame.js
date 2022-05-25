import React from "react";
import * as d3 from "d3";
import * as items from "./chessItems.js";
import * as styles from "./chessStyles";

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

const WHITE = "white";
const BLACK = "black";
const KING = "king";
const QUEEN = "queen";
const KNIGHT = "knight";
const BISHOP = "bishop";
const ROOK = "rook";
const PAWN = "pawn";

class ChessGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      white: new items.Player(),
      black: new items.Player(),
      svg: {},
    };
  }

  componentDidMount() {
    var svg = d3.select(items.CHESSID);
    var board = new items.Board(svg, this.state.white);

    var whitePlayer = {
      king: start[WHITE][KING].map(
        (place) => new items.Piece(svg, board, place, WHITE, KING)
      ),
      queen: start[WHITE][QUEEN].map(
        (place) => new items.Piece(svg, board, place, WHITE, QUEEN)
      ),
      bishop: start[WHITE][BISHOP].map(
        (place) => new items.Piece(svg, board, place, WHITE, BISHOP)
      ),
      knight: start[WHITE][KNIGHT].map(
        (place) => new items.Piece(svg, board, place, WHITE, KNIGHT)
      ),
      rook: start[WHITE][ROOK].map(
        (place) => new items.Piece(svg, board, place, WHITE, ROOK)
      ),
      pawn: start[WHITE][PAWN].map(
        (place) => new items.Piece(svg, board, place, WHITE, PAWN)
      ),
    };
    var BlackPlayer = {
      king: start[BLACK][KING].map(
        (place) => new items.Piece(svg, board, place, BLACK, KING)
      ),
      queen: start[BLACK][QUEEN].map(
        (place) => new items.Piece(svg, board, place, BLACK, QUEEN)
      ),
      bishop: start[BLACK][BISHOP].map(
        (place) => new items.Piece(svg, board, place, BLACK, BISHOP)
      ),
      knight: start[BLACK][KNIGHT].map(
        (place) => new items.Piece(svg, board, place, BLACK, KNIGHT)
      ),
      rook: start[BLACK][ROOK].map(
        (place) => new items.Piece(svg, board, place, BLACK, ROOK)
      ),
      pawn: start[BLACK][PAWN].map(
        (place) => new items.Piece(svg, board, place, BLACK, PAWN)
      ),
    };
    //Do svg stuff
  }

  render() {
    return (
      <section style={styles.chess}>
        <svg
          id={items.CHESS}
          width={items.svgSize}
          height={items.svgSize}
        ></svg>
        <div style={styles.status}>
          <ul style={styles.player}>
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
          <ul style={styles.player}>
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
