const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

import { Game } from "./Game.js";
import { board, getBoardItem, getYCoordinate } from "./board.js";
import { config } from "./config.js";
import { getFieldCoordinate } from "./utils/getFieldCoordinate.js";
import { getLetter } from "./utils/getLetter.js";

const { fieldSize } = config;

const drawBoard = (ix, iy) => {
  const { leftOffset } = config;

  const colors = ["#f4f6f6", "#ba4a00"];
  const useColors = ix % 2 === 0 ? colors : [...colors.reverse()];
  ctx.fillStyle = useColors[iy % 2];
  ctx.fillRect(
    ix * fieldSize + leftOffset,
    iy * fieldSize,
    fieldSize,
    fieldSize
  );
};

const drawPieces = (iy, ix) => {
  const { fieldSize, verticalFieldsOffset, leftOffset } = config;

  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  const piece = board[iy][ix];
  ctx.fillText(
    piece?.actualSymbol || "",
    ix * fieldSize + fieldSize / 2 - verticalFieldsOffset + leftOffset,
    iy * fieldSize + fieldSize / 2 + verticalFieldsOffset
  );
};

const drawNumbers = () => {
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";

  for (let i = 0; i < 8; i++) {
    ctx.fillText(
      8 - i,
      config.leftOffset / 3,
      i * fieldSize + fieldSize / 2 + config.verticalFieldsOffset
    );
  }
};

const drawLetters = () => {
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";

  for (let i = 0; i < 8; i++) {
    ctx.fillText(
      getLetter(i).toUpperCase(),
      i * fieldSize + fieldSize / 2 + 20,
      config.boardSize + 30
    );
  }
};

const strokeClickedField = (x, y, fieldsCount) => {
  ctx.lineWidth = 3;
  ctx.strokeStyle = "lime";

  ctx.strokeRect(
    x * fieldSize + config.leftOffset,
    (fieldsCount - y - 1) * fieldSize,
    fieldSize,
    fieldSize
  );
};

const init = () => {
  board.forEach((_, ix) => {
    board.forEach((_, iy) => {
      drawBoard(ix, iy);
      drawPieces(iy, ix);
      drawNumbers();
      drawLetters();
    });
  });
};

init();

canvas.addEventListener("click", (e) => {
  const { x, y } = getFieldCoordinate(e);
  const { fieldsCount } = config;

  if (x < 0 || y < 0 || x >= fieldsCount || y >= fieldsCount) {
    return;
  }

  const piece = board[getYCoordinate(y)][x];

  if (piece?.actualSymbol && Game.countOfCorrectClicks === 0) {
    strokeClickedField(x, y, fieldsCount);
    Game.setChoosenField({ x, y });
    Game.incrementNumberOfCorrectClicks();
  } else if (Game.countOfCorrectClicks === 1) {
    const piece = getBoardItem(Game.choosenField.x, Game.choosenField.y);

    board[getYCoordinate(Game.choosenField.y)][Game.choosenField.x] = null;
    board[getYCoordinate(y)][x] = piece;
    redrawBoard();
    Game.resetNumberOfCorrectClicks();
  }
});

const redrawBoard = () => {
  ctx.clearRect(0, 0, config.ctxWidth, config.ctxHeight);
  init();
};
