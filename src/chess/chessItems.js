import * as d3 from "d3";
import { blackPieces } from "./pieces/blackPieces";
import { whitePieces } from "./pieces/whitePieces";

const WIDTH = "width";
const HEIGHT = "height";

export const CHESS = "chess";
export const CHESSID = "#chess";

const RECT = "rect";
const X = "x";
const Y = "y";
const ROWS = ["1", "2", "3", "4", "5", "6", "7", "8"];
const COLUMNS = ["a", "b", "c", "d", "e", "f", "g", "h"];

const toRow = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7 };
const toCol = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 };

const FILL = "fill";
const FILLOPACITY = "fill-opacity";

const svgWidth = 1280;
const svgHeight = 720;

const boardSize = 8;
const cellSize = 45;

const boardHeight = (boardSize - 1) * cellSize;

export let svgSize = boardSize * cellSize;

const cellNumbers = 64;
const cellColors = ["hsl(30, 100%, 81%, 0.7)", "	hsl(30, 60%, 55%, 0.7)"];

const previousPlaceColor = "hsl(131, 54%, 20%, 0.5)";
export const possiblePlaceColor = "hsl(131, 54%, 30%, 0.5)";
const currentPlaceColor = "hsl(131, 54%, 50%, 0.4)";

const attackPlaceColor = "hsl(131, 10%, 50%, 0.4)";
const checkPlaceColor = "hsl(0, 100%, 50%, 0.3)";

const pieaceScale = 1;

const WHITE = "white";
const BLACK = "black";
const KING = "king";
const QUEEN = "queen";
const KNIGHT = "knight";
const BISHOP = "bishop";
const ROOK = "rook";
const PAWN = "pawn";

class Player {
  constructor() {
    this.select = null;
    this.x = 0;
    this.y = 0;
    this.turn = "white";
  }
  show = () => console.log(this.x, this.y, this.select);
  move = (cell) => {
    this.select.rect.attr("fill-opacity", 0);
    this.select.svg
      .transition()
      .duration(500)
      .attr("transform", `translate(${this.x}, ${this.y}) scale(1)`);
    cell.status = this.turn;
    this.select = null;
  };
}

const toX = (x) => toCol[x] * cellSize;
const toY = (y) => boardHeight - toRow[y] * cellSize;

const cells = () => {
  const boardHeight = cellSize * (boardSize - 1);
  const result = [];
  // (x,y)=>(y,x) ex) (a,1) => (0, height)
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const x = cellSize * j;
      const y = boardHeight - cellSize * i;
      let color = (j + i + 1) % 2;
      result.push({
        xi: COLUMNS[j],
        yi: ROWS[i],
        x: x,
        y: y,
        color: cellColors[color],
        status: null,
      });
    }
  }

  return result;
};

class Board {
  constructor(svg, player) {
    this.select = null;
    this.x = 0;
    this.y = 0;
    this.turn = "white";
    this.cells = cells();
    this.playCells = cells();

    this.board = svg
      .attr("id", "board")
      .selectAll(RECT)
      .data(this.cells)
      .enter()
      .append(RECT)
      .attr("id", (d) => d.xi + d.yi)
      .attr(WIDTH, cellSize)
      .attr(HEIGHT, cellSize)
      .style(FILL, (d) => d.color)
      .attr(X, (d) => d.x)
      .attr(Y, (d) => d.y)
      .attr("transform", "scale(" + pieaceScale + ")")
      .on("mouseover", (e, d) => {
        this.x = d.x;
        this.y = d.y;
        this.show();
        console.log(d.xi, d.yi, d.status);
      })
      .on("click", (e, d) => {
        console.log(d.xi, d.yi, d.status);
        this.show();
        this.select && this.move(e, d);
        console.log(d.xi, d.yi, d.status);
      });

    this.circles = d3
      .select("#board")
      .selectAll("circle")
      .data(this.playCells)
      .enter()
      .append("circle")
      .attr("id", (d) => "c" + d.xi + d.yi)
      .attr("r", 10)
      .style("pointer-events", "none")
      .attr(FILL, possiblePlaceColor)
      .attr(FILLOPACITY, 0)
      .attr("cx", (d) => d.x + cellSize / 2)
      .attr("cy", (d) => d.y + cellSize / 2)
      .attr("transform", "scale(" + pieaceScale + ")");
  }

  show = () => console.log(this.x, this.y, this.select);
  move = (event, cell) => {
    const contain = this.select.availableCells.indexOf(event.target.id);
    this.select.availableCells.map((data) => {
      d3.select("#c" + data).attr(FILLOPACITY, 0);
    });
    this.select.piece.rect.attr(FILLOPACITY, 0);
    if (contain > -1) {
      this.select.piece.svg
        .transition()
        .duration(500)
        .attr("transform", `translate(${this.x}, ${this.y}) scale(1)`);
      cell.status = this.turn;
      this.select.coordinate = `${cell.xi}${cell.yi}`;
      this.select.availableCells = this.select.findAvailableCells(
        this.select.coordinate
      );
    }
    this.select = null;
  };
}

const pieceTypes = {
  white: whitePieces,
  black: blackPieces,
};

export class Piece {
  constructor(svg, board, coordinate, color, type) {
    this.board = board;
    this.coordinate = coordinate;
    this.color = color;
    this.type = type;
    this.availableCells = this.findAvailableCells(coordinate);
    this.piece = this.makePiece(svg, color, type, coordinate);
  }

  makePiece(svg, color, type, coordinate) {
    this.piece = new pieceTypes[color][type](svg);
    this.piece.svg.attr(
      "transform",
      `translate(${toX(coordinate[0])},${toY(
        coordinate[1]
      )}) scale(${pieaceScale})`
    );

    this.piece.rect.attr("fill", possiblePlaceColor).on("click", () => {
      if (this.board.select !== null) {
        this.piece.rect.attr(FILLOPACITY, 0);
        this.availableCells.map((cell) => {
          d3.select("#c" + cell).attr(FILLOPACITY, 0);
        });
        this.board.select = null;
      } else {
        this.board.select = this;
        this.piece.rect.attr("fill-opacity", 0.5);
        this.availableCells.map((cell) => {
          d3.select("#c" + cell).attr(FILLOPACITY, 0.5);
        });
      }
    });
    return this.piece;
  }

  findAvailableCells(coordinate) {
    return this.decideMove(this.type)(coordinate);
  }
  decideMove(type) {
    switch (type) {
      case "king":
        return (coordinate) => {
          const result = [];

          //North
          let row = toRow[coordinate[1]] + 1;
          let col = toCol[coordinate[0]];
          row < ROWS.length &&
            col < COLUMNS.length &&
            result.push(COLUMNS[col] + ROWS[row]);

          //NorthEast
          row = toRow[coordinate[1]] + 1;
          col = toCol[coordinate[0]] + 1;
          row < ROWS.length &&
            col < COLUMNS.length &&
            result.push(COLUMNS[col] + ROWS[row]);

          //East
          row = toRow[coordinate[1]];
          col = toCol[coordinate[0]] + 1;
          row < ROWS.length &&
            col < COLUMNS.length &&
            result.push(COLUMNS[col] + ROWS[row]);

          //EastSouth
          row = toRow[coordinate[1]] - 1;
          col = toCol[coordinate[0]] + 1;
          row >= 0 &&
            col < COLUMNS.length &&
            result.push(COLUMNS[col] + ROWS[row]);

          //South
          row = toRow[coordinate[1]] - 1;
          col = toCol[coordinate[0]];
          row >= 0 &&
            col < COLUMNS.length &&
            result.push(COLUMNS[col] + ROWS[row]);

          //SouthWest
          row = toRow[coordinate[1]] - 1;
          col = toCol[coordinate[0]] - 1;
          row >= 0 && col >= 0 && result.push(COLUMNS[col] + ROWS[row]);

          //West
          row = toRow[coordinate[1]];
          col = toCol[coordinate[0]] - 1;
          row >= 0 && col >= 0 && result.push(COLUMNS[col] + ROWS[row]);

          //WestNorth
          row = toRow[coordinate[1]] + 1;
          col = toCol[coordinate[0]] - 1;
          row < ROWS.length &&
            col >= 0 &&
            result.push(COLUMNS[col] + ROWS[row]);

          return result;
        };
      case "queen":
        return (coordinate) => {
          const horizontal = this.decideMove(BISHOP)(coordinate);
          const diagonal = this.decideMove(ROOK)(coordinate);
          return [...horizontal, ...diagonal];
        };
      case "bishop":
        return (coordinate) => {
          const result = [];

          let row = toRow[coordinate[1]];
          let col = toCol[coordinate[0]];
          for (let i = 1; row < ROWS.length && col < COLUMNS.length; i++) {
            row = row + 1;
            col = col + 1;
            result.push(COLUMNS[col] + ROWS[row]);
          }

          row = toRow[coordinate[1]];
          col = toCol[coordinate[0]];
          for (let i = 1; row < ROWS.length && col >= 0; i++) {
            row = row + 1;
            col = col - 1;
            result.push(COLUMNS[col] + ROWS[row]);
          }

          row = toRow[coordinate[1]];
          col = toCol[coordinate[0]];
          for (let i = 1; row >= 0 && col < COLUMNS.length; i++) {
            row = row - 1;
            col = col + 1;
            result.push(COLUMNS[col] + ROWS[row]);
          }

          row = toRow[coordinate[1]];
          col = toCol[coordinate[0]];
          for (let i = 1; row >= 0 && col >= 0; i++) {
            row = row - 1;
            col = col - 1;
            result.push(COLUMNS[col] + ROWS[row]);
          }

          return result;
        };
      case "knight":
        return (coordinate) => {
          const result = [];
          let row = toRow[coordinate[1]] + 1;
          let col = toCol[coordinate[0]] + 2;
          row < ROWS.length &&
            col < COLUMNS.length &&
            result.push(COLUMNS[col] + ROWS[row]);

          row = toRow[coordinate[1]] + 1;
          col = toCol[coordinate[0]] - 2;
          row < ROWS.length &&
            col >= 0 &&
            result.push(COLUMNS[col] + ROWS[row]);

          row = toRow[coordinate[1]] + 2;
          col = toCol[coordinate[0]] + 1;
          row < ROWS.length &&
            col < COLUMNS.length &&
            result.push(COLUMNS[col] + ROWS[row]);

          row = toRow[coordinate[1]] + 2;
          col = toCol[coordinate[0]] - 1;
          row < ROWS.length &&
            col >= 0 &&
            result.push(COLUMNS[col] + ROWS[row]);

          row = toRow[coordinate[1]] - 1;
          col = toCol[coordinate[0]] + 2;
          row >= 0 &&
            col < COLUMNS.length &&
            result.push(COLUMNS[col] + ROWS[row]);

          row = toRow[coordinate[1]] - 1;
          col = toCol[coordinate[0]] - 2;
          row >= 0 && col >= 0 && result.push(COLUMNS[col] + ROWS[row]);

          row = toRow[coordinate[1]] - 2;
          col = toCol[coordinate[0]] + 1;
          row >= 0 &&
            col < COLUMNS.length &&
            result.push(COLUMNS[col] + ROWS[row]);

          row = toRow[coordinate[1]] - 2;
          col = toCol[coordinate[0]] - 1;
          row >= 0 && col >= 0 && result.push(COLUMNS[col] + ROWS[row]);
          return result;
        };
      case "rook":
        return (coordinate) => {
          const result = [];

          let col = toCol[coordinate[0]];
          let row = toRow[coordinate[1]];
          for (let i = 1; col < COLUMNS.length; i++) {
            col = col + 1;
            result.push(COLUMNS[col] + ROWS[row]);
          }

          col = toCol[coordinate[0]];
          for (let i = 1; col >= 0; i++) {
            col = col - 1;
            result.push(COLUMNS[col] + ROWS[row]);
          }

          col = toCol[coordinate[0]];
          row = toRow[coordinate[1]];
          for (let i = 1; row < ROWS.length; i++) {
            row = row + 1;
            result.push(COLUMNS[col] + ROWS[row]);
          }

          row = toRow[coordinate[1]];
          for (let i = 1; row >= 0; i++) {
            row = row - 1;
            result.push(COLUMNS[col] + ROWS[row]);
          }

          return result;
        };
      case "pawn":
        return (coordinate) => {
          let result;
          const col = toCol[coordinate[0]];
          const row =
            this.color === WHITE
              ? toRow[coordinate[1]] + 1
              : toRow[coordinate[1]] - 1;
          const cellId = COLUMNS[col] + ROWS[row];
          result = [cellId];
          return result;
        };
      default:
        return null;
    }
  }
}

export { Player, Board };
