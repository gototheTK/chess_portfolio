import * as items from "./chessItems.js";

//ChessGame

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
  maxHeight: items.svgSize,
};

export const player = {
  display: "block",
  height: items.svgSize,
  maxHeight: items.svgSize,
  border: "2px groove var(--primary-color)",
};
