import * as d3 from "d3";
import { blackPieces } from "./pieces/blackPieces";
import { whitePieces } from "./pieces/whitePieces";

const BOARD = "board";
const WIDTH = "width";
const HEIGHT = "height";
const FILL = "fill";
const ID = "id";
const FILLOPACITY = "fill-opacity";
const CLICK = "click";
const TRANSFORM = "transform";
const POINTEREVENTS = "pointer-events";
const MOUSEOVER = "mouseover";
const NONE = "none";

const RECT = "rect";
const X = "x";
const Y = "y";

const CIRCLE = "circle";
const C = "c";
const CX = "cx";
const CY = "cy";
const R = "r";

const INDEX = "index";

const ROWS = ["1", "2", "3", "4", "5", "6", "7", "8"];
const COLUMNS = ["a", "b", "c", "d", "e", "f", "g", "h"];

const toRow = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7 };
const toCol = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 };

export const boardSize = 8;
export const cellSize = 45;
export const svgWidth = boardSize * cellSize;
export const svgHeight = boardSize * cellSize;
const boardHeight = (boardSize - 1) * cellSize;

const cellNumbers = 64;
const cellColors = ["hsl(30, 100%, 81%, 0.7)", "	hsl(30, 60%, 55%, 0.7)"];
const previousPlaceColor = "hsl(131, 54%, 20%, 0.5)";
const possiblePlaceColor = "hsl(131, 54%, 30%, 0.5)";
const currentPlaceColor = "hsl(131, 54%, 50%, 0.4)";
const attackPlaceColor = "hsl(131, 10%, 50%, 0.4)";
const checkPlaceColor = "hsl(0, 100%, 50%, 0.3)";

const WHITE = "white";
const BLACK = "black";
const KING = "king";
const QUEEN = "queen";
const KNIGHT = "knight";
const BISHOP = "bishop";
const ROOK = "rook";
const PAWN = "pawn";

const toID = (id) => "#" + id;
const toCircleID = (id) => "#c" + id;

const toX = (x) => toCol[x] * cellSize;
const toY = (y) => boardHeight - toRow[y] * cellSize;

const toScale = (scale) => `scale(${scale})`;
const toTransformScale = (x, y, scale) =>
  `translate(${x}, ${y}) scale(${scale})`;

const calIndex = (row, col) => toRow[row] * boardSize + toCol[col];

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
        index: i * boardSize + j,
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
    this.index = 0;
    this.turn = WHITE;
    this.cells = cells();
    this.pieceScale = 1;
    this.board = svg
      .attr(ID, BOARD)
      .selectAll(RECT)
      .data(this.cells)
      .enter()
      .append(RECT)
      .attr(ID, (d) => d.xi + d.yi)
      .attr(WIDTH, cellSize)
      .attr(HEIGHT, cellSize)
      .style(FILL, (d) => d.color)
      .attr(X, (d) => d.x)
      .attr(Y, (d) => d.y)
      .attr(TRANSFORM, toScale(this.pieceScale))
      .attr(INDEX, (d) => d.index)
      .on(MOUSEOVER, (e, d) => {
        this.x = d.x;
        this.y = d.y;
        this.show();
        // console.log(d.xi, d.yi, d.status);
      })
      .on(CLICK, (e, d) => {
        // console.log(d.xi, d.yi, d.status);
        this.show();
        this.select && this.move(e, d);
        // console.log(d.xi, d.yi, d.status);
      });

    this.circles = d3
      .select(toID(BOARD))
      .selectAll(CIRCLE)
      .data(this.cells)
      .enter()
      .append(CIRCLE)
      .attr(ID, (d) => C + d.xi + d.yi)
      .attr(R, 10)
      .style(POINTEREVENTS, NONE)
      .attr(FILL, possiblePlaceColor)
      .attr(FILLOPACITY, 0)
      .attr(CX, (d) => d.x + cellSize / 2)
      .attr(CY, (d) => d.y + cellSize / 2)
      .attr(TRANSFORM, toScale(this.pieceScale));
  }

  show = () => console.log(this.x, this.y, this.select);
  move = (event, cell) => {
    const contain = this.select.availableCells.indexOf(event.target.id);
    this.select.switchFill();
    if (contain > -1) {
      this.select.piece.svg
        .transition()
        .duration(500)
        .attr(TRANSFORM, toTransformScale(this.x, this.y, this.pieceScale));
      this.cells[this.select.currentCellIndex].status = null;
      this.select.currentCellIndex = cell.index;
      this.cells[cell.index].status = this.select;
      this.select.coordinate = `${cell.xi}${cell.yi}`;
      this.select.availableCells = this.select.findAvailableCells(
        this.select.coordinate
      );
      this.switchTurn();
    }
    this.select = null;
  };

  switchTurn() {
    this.turn = this.turn === WHITE ? BLACK : WHITE;
  }
}

const pieceTypes = {
  white: whitePieces,
  black: blackPieces,
};

export class Piece {
  constructor(svg, board, coordinate, color, type) {
    this.board = board;
    this.cells = board.cells;
    this.coordinate = coordinate;
    this.currentCellIndex = null;
    this.color = color;
    this.type = type;
    this.availableCells = this.findAvailableCells(coordinate);
    this.piece = this.makePiece(svg, color, type, coordinate);
    this.selected = false;
    this.fillStatus = 0;
  }

  makePiece(svg, color, type, coordinate) {
    this.piece = new pieceTypes[color][type](svg);
    this.piece.svg.attr(
      TRANSFORM,
      toTransformScale(
        toX(coordinate[0]),
        toY(coordinate[1]),
        this.board.pieceScale
      )
    );
    const index = calIndex(coordinate[1], coordinate[0]);
    this.currentCellIndex = index;
    this.board.cells[index].status = this;
    this.piece.rect.attr(FILL, possiblePlaceColor).on(CLICK, (d, e) => {
      // Have you already a piece?
      this.board.turn === this.color &&
        (() => {
          // Isn't it same selected piece's color and your color?
          this.board.select &&
            this.selected !== this.board.select.selected &&
            this.board.select.switchFill();

          this.switchFill();

          this.board.select = this.selected ? this : null;
        })();

      // Do you select a opponent piece?
      this.board.turn !== this.color &&
        this.board.select &&
        (() => {
          this.board.select && this.board.select.switchFill();
          const index = this.board.select.availableCells.indexOf(
            this.coordinate
          );
          if (index > -1) {
            this.board.select.piece.svg
              .transition()
              .duration(500)
              .attr(
                TRANSFORM,
                toTransformScale(
                  toX(coordinate[0]),
                  toY(coordinate[1]),
                  this.board.pieceScale
                )
              ) &&
              this.piece.svg
                .transition()
                .duration(500)
                .attr(
                  TRANSFORM,
                  toTransformScale(
                    toX(coordinate[0]) + svgWidth,
                    toY(coordinate[1]),
                    this.board.pieceScale
                  )
                );
            this.cells[this.board.select.currentCellIndex].status = null;
            this.board.select.currentCellIndex = this.currentCellIndex;
            this.cells[this.currentCellIndex].status = this.board.select;
            this.board.select.coordinate = this.coordinate;
            this.board.select.availableCells =
              this.board.select.findAvailableCells(this.coordinate);
            this.board.switchTurn();
          }
          this.board.select = null;
        })();
    });
    return this.piece;
  }

  switchFill() {
    this.selected = !this.selected;
    this.fillStatus = this.selected ? 0.5 : 0;
    this.piece.rect.attr(FILLOPACITY, this.fillStatus) &&
      this.availableCells.map((cell) => {
        let isPiece = this.cells[calIndex(cell[1], cell[0])].status;
        if (isPiece) {
          isPiece.piece.rect.attr(FILLOPACITY, this.fillStatus);
        }
        d3.select(toCircleID(cell)).attr(FILLOPACITY, this.fillStatus);
      });
    return this.selected;
  }

  findAvailableCells(coordinate) {
    return this.decideMove(this.type)(coordinate);
  }
  decideMove(type) {
    switch (type) {
      case KING:
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
      case QUEEN:
        return (coordinate) => {
          const horizontal = this.decideMove(BISHOP)(coordinate);
          const diagonal = this.decideMove(ROOK)(coordinate);
          return [...horizontal, ...diagonal];
        };
      case BISHOP:
        return (coordinate) => {
          const result = [];

          let row = toRow[coordinate[1]];
          let col = toCol[coordinate[0]];
          for (let i = 1; row < ROWS.length && col < COLUMNS.length; i++) {
            result.push(COLUMNS[col] + ROWS[row]);
            row = row + 1;
            col = col + 1;
          }

          row = toRow[coordinate[1]];
          col = toCol[coordinate[0]];
          for (let i = 1; row < ROWS.length && col >= 0; i++) {
            result.push(COLUMNS[col] + ROWS[row]);
            row = row + 1;
            col = col - 1;
          }

          row = toRow[coordinate[1]];
          col = toCol[coordinate[0]];
          for (let i = 1; row >= 0 && col < COLUMNS.length; i++) {
            result.push(COLUMNS[col] + ROWS[row]);
            row = row - 1;
            col = col + 1;
          }

          row = toRow[coordinate[1]];
          col = toCol[coordinate[0]];
          for (let i = 1; row >= 0 && col >= 0; i++) {
            result.push(COLUMNS[col] + ROWS[row]);
            row = row - 1;
            col = col - 1;
          }

          return result;
        };
      case KNIGHT:
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
      case ROOK:
        return (coordinate) => {
          const result = [];

          let col = toCol[coordinate[0]] + 1;
          let row = toRow[coordinate[1]];
          for (let i = 1; col < COLUMNS.length; i++) {
            result.push(COLUMNS[col] + ROWS[row]);
            col = col + 1;
          }

          col = toCol[coordinate[0]] - 1;
          console.log(coordinate);
          for (let i = 1; col >= 0; i++) {
            result.push(COLUMNS[col] + ROWS[row]);
            col = col - 1;
          }

          col = toCol[coordinate[0]];
          row = toRow[coordinate[1]] + 1;
          for (let i = 1; row < ROWS.length; i++) {
            result.push(COLUMNS[col] + ROWS[row]);
            row = row + 1;
          }

          row = toRow[coordinate[1]] - 1;
          for (let i = 1; row >= 0; i++) {
            result.push(COLUMNS[col] + ROWS[row]);
            row = row - 1;
          }

          return result;
        };
      case PAWN:
        return (coordinate) => {
          let result = [];
          let col = toCol[coordinate[0]];
          let row =
            this.color === WHITE
              ? toRow[coordinate[1]] + 1
              : toRow[coordinate[1]] - 1;
          let cellId = COLUMNS[col] + ROWS[row];
          result.push(cellId);

          if (
            (coordinate[1] === "2" && this.color === WHITE) ||
            (coordinate[1] === "7" && this.color === BLACK)
          ) {
            row =
              this.color === WHITE
                ? toRow[coordinate[1]] + 2
                : toRow[coordinate[1]] - 2;
            cellId = COLUMNS[col] + ROWS[row];
            result.push(cellId);
          }

          return result;
        };
      default:
        return null;
    }
  }
}

export { Board };
