import React from "react";
import * as d3 from "d3";
import * as items from "./chessItems.js";
import * as styles from "./chessStyles";

class ChessGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      white: new items.Player(),
      svg: {},
    };
  }

  componentDidMount() {
    var svg = d3.select(items.CHESSID);
    var board = items.board(svg, this.state.white);
    var whiteKing = new items.WhiteKing(svg, this.state.white);
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
