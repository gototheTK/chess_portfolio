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
const MOVE = "move";
const INPASSING = "in_passing";
const CASTLING = "castling";

const castlingPosition = {
  white: {
    king: "e1",
    leftRook: "a1",
    rightRook: "h1",
    castlingLeftRook: "d1",
    castlingLeftKing: "c1",
    castlingRightRook: "f1",
    castlingRightKing: "g1",
  },
  black: {
    king: "e8",
    leftRook: "a8",
    rightRook: "h8",
    castlingLeftRook: "d8",
    castlingLeftKing: "c8",
    castlingRightRook: "f8",
    castlingRightKing: "g8",
  },
};

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
    this.inPassingCell = null;
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
        // console.log(d.xi, d.yi, d.status);
      })
      .on(CLICK, (e, d) => {
        // console.log(d.xi, d.yi, d.status);
        this.select && this.events(e, d);
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

  events = (event, cell) => {
    const contain = this.select.availableCells.indexOf(event.target.id);
    this.select.switchFill();
    console.log();
    if (contain > -1) {
      let action =
        this.select.possibleCastling &&
        (castlingPosition[this.turn].castlingLeftKing === event.target.id ||
          castlingPosition[this.turn].castlingRightKing === event.target.id)
          ? {
              type: CASTLING,
              color: this.turn,
              cell: cell,
              cells: this.cells,
            }
          : this.inPassingCell
          ? {
              type: INPASSING,
              cell: cell,
              cells: this.cells,
              inPassingCell: this.inPassingCell,
            }
          : {
              type: MOVE,
              cell: cell,
              cells: this.cells,
            };
      this.eventsReducer(action);
    }
  };

  eventsReducer = (action) => {
    switch (action.type) {
      case CASTLING:
        this.castling(action.cell, action.cells, action.color);
        break;
      case INPASSING:
        this.inPassing(action.cell, action.cells, action.inPassingCell);
        break;
      case MOVE:
        this.move(action.cell, action.cells);
        break;
      default:
    }
    this.select = null;
    this.switchTurn();
  };

  move = (cell, cells) => {
    // isInPassing
    this.select.type === PAWN &&
      ((this.turn === BLACK && cell.yi === "5") ||
        (this.turn === WHITE && cell.yi === "4")) &&
      this.isInPassing(cell, this.cells, this.turn);

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
  };

  castling = (cell, cells, color) => {
    const kingCoordinate = castlingPosition[color].king;
    const direction = toCol[cell.xi] > toCol[kingCoordinate[0]] ? true : false;
    console.log(direction);
    const rookCoordinate = direction
      ? castlingPosition[color].rightRook
      : castlingPosition[color].leftRook;

    const fromKingCell = cells[calIndex(kingCoordinate[1], kingCoordinate[0])];
    const fromRookCell = cells[calIndex(rookCoordinate[1], rookCoordinate[0])];

    const king = fromKingCell.status;
    const rook = fromRookCell.status;

    console.log(fromKingCell);
    console.log(fromRookCell);

    const toKingCoordinate = direction
      ? castlingPosition[color].castlingRightKing
      : castlingPosition[color].castlingLeftKing;
    const toRookCoordinate = direction
      ? castlingPosition[color].castlingRightRook
      : castlingPosition[color].castlingLeftRook;
    console.log(toRookCoordinate);
    const toKingCell =
      cells[calIndex(toKingCoordinate[1], toKingCoordinate[0])];
    const toRookCell =
      cells[calIndex(toRookCoordinate[1], toRookCoordinate[0])];

    king.piece.svg
      .transition()
      .duration(500)
      .attr(
        TRANSFORM,
        toTransformScale(toKingCell.x, toKingCell.y, this.pieceScale)
      );

    fromKingCell.status = null;
    king.currentCellIndex = toKingCell.index;
    toKingCell.status = king;
    king.coordinate = `${toKingCell.xi}${toKingCell.yi}`;

    rook.piece.svg
      .transition()
      .duration(500)
      .attr(
        TRANSFORM,
        toTransformScale(toRookCell.x, toRookCell.y, this.pieceScale)
      );

    fromRookCell.status = null;
    rook.currentCellIndex = toRookCell.index;
    toRookCell.status = rook;
    rook.coordinate = `${toRookCell.xi}${toRookCell.yi}`;

    king.availableCells = king.findAvailableCells(toKingCoordinate);
    rook.availableCells = rook.findAvailableCells(toRookCoordinate);
  };

  inPassing(cell, cells, inPassingCell) {
    this.select.type === PAWN &&
      cell.index === inPassingCell.moveCell.index &&
      inPassingCell.pieceCell.status.piece.svg
        .transition()
        .duration(500)
        .attr(
          TRANSFORM,
          toTransformScale(cell.x + svgWidth, cell.y, this.pieceScale)
        );
    inPassingCell.pieceCell.status = null;
    this.offInPassing();
    this.move(cell, cells);
  }

  isInPassing(cell, cells, turn) {
    const col = toCol[cell.xi];
    const row = toRow[cell.yi];
    let backRow = turn === BLACK ? row + 1 : turn === WHITE ? row - 1 : null;
    let rightCol = col + 1 < boardSize ? col + 1 : null;
    let leftCol = col - 1 >= 0 ? col - 1 : null;

    console.log("앙파상", backRow, leftCol, rightCol);

    backRow &&
      rightCol &&
      cells[row * boardSize + rightCol].status &&
      cells[row * boardSize + rightCol].status.color !== turn &&
      this.onInPassing(cells[backRow * boardSize + col], cell);
    console.log(this.inPassingCell);
    backRow &&
      leftCol &&
      cells[row * boardSize + leftCol].status &&
      cells[row * boardSize + leftCol].status.color !== turn &&
      this.onInPassing(cells[backRow * boardSize + col], cell);

    console.log(this.inPassingCell);
  }

  offInPassing() {
    this.inPassingCell = null;
  }

  onInPassing(moveCell, pieceCell) {
    this.inPassingCell = { moveCell: moveCell, pieceCell: pieceCell };
  }

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
    this.givenCells = [];
    this.possibleCastling = false;
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

    this.possibleCastling = type === KING ? true : false;

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
          console.log(this.coordinate);
          if (index > -1) {
            this.board.select.piece.svg
              .transition()
              .duration(500)
              .attr(
                TRANSFORM,
                toTransformScale(
                  toX(this.coordinate[0]),
                  toY(this.coordinate[1]),
                  this.board.pieceScale
                )
              ) &&
              this.piece.svg
                .transition()
                .duration(500)
                .attr(
                  TRANSFORM,
                  toTransformScale(
                    toX(this.coordinate[0]) + svgWidth,
                    toY(this.coordinate[1]),
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
    this.selected &&
      (this.availableCells = this.findAvailableCells(this.coordinate));

    console.log(this.availableCells);

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
          const result = this.possibleCastling ? this.castlingCells() : [];

          //North
          let row = toRow[coordinate[1]] + 1;
          let col = toCol[coordinate[0]];
          row < ROWS.length &&
            col < COLUMNS.length &&
            (this.cells[row * boardSize + col].status == null ||
              this.cells[row * boardSize + col].status.color !== this.color) &&
            result.push(COLUMNS[col] + ROWS[row]);

          //NorthEast
          row = toRow[coordinate[1]] + 1;
          col = toCol[coordinate[0]] + 1;
          row < ROWS.length &&
            col < COLUMNS.length &&
            (this.cells[row * boardSize + col].status == null ||
              this.cells[row * boardSize + col].status.color !== this.color) &&
            result.push(COLUMNS[col] + ROWS[row]);

          //East
          row = toRow[coordinate[1]];
          col = toCol[coordinate[0]] + 1;
          row < ROWS.length &&
            col < COLUMNS.length &&
            (this.cells[row * boardSize + col].status == null ||
              this.cells[row * boardSize + col].status.color !== this.color) &&
            result.push(COLUMNS[col] + ROWS[row]);

          //EastSouth
          row = toRow[coordinate[1]] - 1;
          col = toCol[coordinate[0]] + 1;
          row >= 0 &&
            col < COLUMNS.length &&
            (this.cells[row * boardSize + col].status == null ||
              this.cells[row * boardSize + col].status.color !== this.color) &&
            result.push(COLUMNS[col] + ROWS[row]);

          //South
          row = toRow[coordinate[1]] - 1;
          col = toCol[coordinate[0]];
          row >= 0 &&
            col < COLUMNS.length &&
            (this.cells[row * boardSize + col].status == null ||
              this.cells[row * boardSize + col].status.color !== this.color) &&
            result.push(COLUMNS[col] + ROWS[row]);

          //SouthWest
          row = toRow[coordinate[1]] - 1;
          col = toCol[coordinate[0]] - 1;
          row >= 0 &&
            col >= 0 &&
            (this.cells[row * boardSize + col].status == null ||
              this.cells[row * boardSize + col].status.color !== this.color) &&
            result.push(COLUMNS[col] + ROWS[row]);

          //West
          row = toRow[coordinate[1]];
          col = toCol[coordinate[0]] - 1;
          row >= 0 &&
            col >= 0 &&
            (this.cells[row * boardSize + col].status == null ||
              this.cells[row * boardSize + col].status.color !== this.color) &&
            result.push(COLUMNS[col] + ROWS[row]);

          //WestNorth
          row = toRow[coordinate[1]] + 1;
          col = toCol[coordinate[0]] - 1;
          row < ROWS.length &&
            col >= 0 &&
            (this.cells[row * boardSize + col].status == null ||
              this.cells[row * boardSize + col].status.color !== this.color) &&
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

          let row = toRow[coordinate[1]] + 1;
          let col = toCol[coordinate[0]] + 1;
          let cell = null;
          for (let i = 1; row < ROWS.length && col < COLUMNS.length; i++) {
            cell = this.cells[row * boardSize + col].status;
            if (cell) {
              cell.color !== this.color &&
                result.push(COLUMNS[col] + ROWS[row]);
              break;
            } else {
              result.push(COLUMNS[col] + ROWS[row]);
              row = row + 1;
              col = col + 1;
            }
          }

          row = toRow[coordinate[1]] + 1;
          col = toCol[coordinate[0]] - 1;
          for (let i = 1; row < ROWS.length && col >= 0; i++) {
            cell = this.cells[row * boardSize + col].status;
            if (cell) {
              cell.color !== this.color &&
                result.push(COLUMNS[col] + ROWS[row]);
              break;
            } else {
              result.push(COLUMNS[col] + ROWS[row]);
              row = row + 1;
              col = col - 1;
            }
          }

          row = toRow[coordinate[1]] - 1;
          col = toCol[coordinate[0]] + 1;
          for (let i = 1; row >= 0 && col < COLUMNS.length; i++) {
            cell = this.cells[row * boardSize + col].status;
            if (cell) {
              cell.color !== this.color &&
                result.push(COLUMNS[col] + ROWS[row]);
              break;
            } else {
              result.push(COLUMNS[col] + ROWS[row]);
              row = row - 1;
              col = col + 1;
            }
          }

          row = toRow[coordinate[1]] - 1;
          col = toCol[coordinate[0]] - 1;
          for (let i = 1; row >= 0 && col >= 0; i++) {
            cell = this.cells[row * boardSize + col].status;
            if (cell) {
              cell.color !== this.color &&
                result.push(COLUMNS[col] + ROWS[row]);
              break;
            } else {
              result.push(COLUMNS[col] + ROWS[row]);
              row = row - 1;
              col = col - 1;
            }
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
            (this.cells[row * boardSize + col].status == null ||
              this.cells[row * boardSize + col].status.color !== this.color) &&
            result.push(COLUMNS[col] + ROWS[row]);

          row = toRow[coordinate[1]] + 1;
          col = toCol[coordinate[0]] - 2;
          row < ROWS.length &&
            col >= 0 &&
            (this.cells[row * boardSize + col].status == null ||
              this.cells[row * boardSize + col].status.color !== this.color) &&
            result.push(COLUMNS[col] + ROWS[row]);

          row = toRow[coordinate[1]] + 2;
          col = toCol[coordinate[0]] + 1;
          row < ROWS.length &&
            col < COLUMNS.length &&
            (this.cells[row * boardSize + col].status == null ||
              this.cells[row * boardSize + col].status.color !== this.color) &&
            result.push(COLUMNS[col] + ROWS[row]);

          row = toRow[coordinate[1]] + 2;
          col = toCol[coordinate[0]] - 1;
          row < ROWS.length &&
            col >= 0 &&
            (this.cells[row * boardSize + col].status == null ||
              this.cells[row * boardSize + col].status.color !== this.color) &&
            result.push(COLUMNS[col] + ROWS[row]);

          row = toRow[coordinate[1]] - 1;
          col = toCol[coordinate[0]] + 2;
          row >= 0 &&
            col < COLUMNS.length &&
            (this.cells[row * boardSize + col].status == null ||
              this.cells[row * boardSize + col].status.color !== this.color) &&
            result.push(COLUMNS[col] + ROWS[row]);

          row = toRow[coordinate[1]] - 1;
          col = toCol[coordinate[0]] - 2;
          row >= 0 &&
            col >= 0 &&
            (this.cells[row * boardSize + col].status == null ||
              this.cells[row * boardSize + col].status.color !== this.color) &&
            result.push(COLUMNS[col] + ROWS[row]);

          row = toRow[coordinate[1]] - 2;
          col = toCol[coordinate[0]] + 1;
          row >= 0 &&
            col < COLUMNS.length &&
            (this.cells[row * boardSize + col].status == null ||
              this.cells[row * boardSize + col].status.color !== this.color) &&
            result.push(COLUMNS[col] + ROWS[row]);

          row = toRow[coordinate[1]] - 2;
          col = toCol[coordinate[0]] - 1;
          row >= 0 &&
            col >= 0 &&
            (this.cells[row * boardSize + col].status == null ||
              this.cells[row * boardSize + col].status.color !== this.color) &&
            result.push(COLUMNS[col] + ROWS[row]);
          return result;
        };
      case ROOK:
        return (coordinate) => {
          const result = [];

          let col = toCol[coordinate[0]] + 1;
          let row = toRow[coordinate[1]];
          let cell = null;
          for (let i = 1; col < COLUMNS.length; i++) {
            cell = this.cells[row * boardSize + col].status;
            if (cell) {
              cell.color !== this.color &&
                result.push(COLUMNS[col] + ROWS[row]);
              break;
            } else {
              result.push(COLUMNS[col] + ROWS[row]);
              col = col + 1;
            }
          }

          col = toCol[coordinate[0]] - 1;
          for (let i = 1; col >= 0; i++) {
            cell = this.cells[row * boardSize + col].status;
            if (cell) {
              cell.color !== this.color &&
                result.push(COLUMNS[col] + ROWS[row]);
              break;
            } else {
              result.push(COLUMNS[col] + ROWS[row]);
              col = col - 1;
            }
          }

          col = toCol[coordinate[0]];
          row = toRow[coordinate[1]] + 1;
          for (let i = 1; row < ROWS.length; i++) {
            cell = this.cells[row * boardSize + col].status;
            if (cell) {
              cell.color !== this.color &&
                result.push(COLUMNS[col] + ROWS[row]);
              break;
            } else {
              result.push(COLUMNS[col] + ROWS[row]);
              row = row + 1;
            }
          }

          row = toRow[coordinate[1]] - 1;
          for (let i = 1; row >= 0; i++) {
            cell = this.cells[row * boardSize + col].status;
            if (cell) {
              cell.color !== this.color &&
                result.push(COLUMNS[col] + ROWS[row]);
              break;
            } else {
              result.push(COLUMNS[col] + ROWS[row]);
              row = row - 1;
            }
          }

          return result;
        };
      case PAWN:
        return (coordinate, passedResult = []) => {
          let result = passedResult;
          let col = toCol[coordinate[0]];
          let row = toRow[coordinate[1]];

          let col1 = col + 1 < boardSize ? col + 1 : null;
          let col2 = col - 1 >= 0 ? col - 1 : null;

          let row1 = this.color === WHITE ? row + 1 : row - 1;
          row1 < boardSize &&
            row1 >= 0 &&
            this.cells[row1 * boardSize + col].status == null &&
            result.push(COLUMNS[col] + ROWS[row1]);

          let row2 =
            this.color === WHITE && coordinate[1] === "2"
              ? row + 2
              : this.color === BLACK && coordinate[1] === "7"
              ? row - 2
              : null;

          this.color === WHITE &&
            coordinate[1] === "5" &&
            this.board.inPassingCell &&
            result.push(
              this.board.inPassingCell.moveCell.xi +
                this.board.inPassingCell.moveCell.yi
            );
          this.color === BLACK &&
            coordinate[1] === "4" &&
            this.board.inPassingCell &&
            result.push(
              this.board.inPassingCell.moveCell.xi +
                this.board.inPassingCell.moveCell.yi
            );

          row2 &&
            this.cells[row2 * boardSize + col].status == null &&
            row2 &&
            result.push(COLUMNS[col] + ROWS[row2]);

          col1 &&
            this.cells[row1 * boardSize + col1].status &&
            this.cells[row1 * boardSize + col1].status.color !== this.color &&
            result.push(COLUMNS[col1] + ROWS[row1]);
          col2 &&
            this.cells[row1 * boardSize + col2].status &&
            this.cells[row1 * boardSize + col2].status.color !== this.color &&
            result.push(COLUMNS[col2] + ROWS[row1]);

          return result;
        };
      default:
        return null;
    }
  }

  castlingCells() {
    let result = [];
    const leftCoordinate = castlingPosition[this.color].leftRook;
    const leftCol = toCol[leftCoordinate[0]];
    const leftRow = toRow[leftCoordinate[1]];
    const rightPosition = castlingPosition[this.color].rightRook;
    const rightCol = toCol[rightPosition[0]];
    const rightRow = toRow[rightPosition[1]];

    const leftRook = this.cells[leftRow * boardSize + leftCol];
    const rightRook = this.cells[rightRow * boardSize + rightCol];

    const castedRightKing = castlingPosition[this.color].castlingRightKing;
    const rightKingCol = toCol[castedRightKing[0]];
    const rightKingRow = toRow[castedRightKing[1]];

    const castedLeftKing = castlingPosition[this.color].castlingLeftKing;
    const leftKingCol = toCol[castedLeftKing[0]];
    const leftKingRow = toRow[castedLeftKing[1]];

    const castedRightRook = castlingPosition[this.color].castlingRightRook;
    const rightRookCol = toCol[castedRightRook[0]];
    const rightRookRow = toRow[castedRightRook[1]];

    const castedLeftRook = castlingPosition[this.color].castlingLeftRook;
    const leftRookCol = toCol[castedLeftRook[0]];
    const leftRookRow = toRow[castedLeftRook[1]];

    const isLeftPossible =
      this.coordinate === castlingPosition[this.color].king &&
      leftRook.status &&
      leftRook.status.color === this.color;
    const isRightPossible =
      this.coordinate === castlingPosition[this.color].king &&
      rightRook.status &&
      rightRook.status.color === this.color;

    if (isLeftPossible || isRightPossible) {
      isLeftPossible &&
        this.cells[leftKingRow * boardSize + leftKingCol] &&
        this.cells[leftRookRow * boardSize + leftRookCol] &&
        this.cells[leftKingRow * boardSize + leftKingCol].status == null &&
        this.cells[leftRookRow * boardSize + leftRookCol].status == null &&
        result.push(castedLeftKing);

      isRightPossible &&
        this.cells[rightKingRow * boardSize + rightKingCol].status == null &&
        this.cells[rightRookRow * boardSize + rightRookCol].status == null &&
        result.push(castedRightKing);
    } else {
      this.possibleCastling = false;
    }

    return result;
  }
}

export { Board };
