import { boardSize, cellSize, svgHeight, svgWidth } from "./chessItems.js";

//ChessGame
export const svgSize = {
  width: svgWidth,
  height: svgHeight,
};

export const chess = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "1.9rem",
  maxWidth: "1100px",
  margin: "2rem auto -6rem",
};

export const status = {
  display: "flex",
  gap: "1.9rem",
  maxHeight: svgHeight,
};

export const player = {
  display: "block",
  height: svgHeight,
  maxHeight: svgHeight,
  border: "2px groove var(--primary-color)",
};
