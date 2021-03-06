import { boardSize, cellSize, svgHeight, svgWidth } from "./chessItems.js";

const FLEX = "flex";
const CENTER = "center";
const BLOCK = "block";

//ChessGame
export const svgSize = {
  width: svgWidth,
  height: svgHeight,
};

export const chess = {
  display: FLEX,
  alignItems: CENTER,
  justifyContent: CENTER,
  gap: "1.9rem",
  maxWidth: "800px",
  margin: "2rem auto -6rem",
  border: "3px solid",
};

export const status = {
  display: FLEX,
  gap: "1.9rem",
  maxHeight: svgHeight,
};

export const player = {
  display: BLOCK,
  height: svgHeight,
  maxHeight: svgHeight,
  border: "2px groove var(--primary-color)",
};
