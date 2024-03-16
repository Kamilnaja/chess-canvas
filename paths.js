import { Coordinate } from "./Coordinate.js";
import { Path } from "./Path.js";
import { getYField } from "./utils/getYField.js";

export const paths = {
  paths: [],
  addToPath(path) {
    this.paths.push(path);
  },
  resetPaths() {
    this.paths = [];
  },
  logPath() {
    for (let i = 0; i < this.paths.length; i++) {
      console.log(this.paths[i]);
    }
  },
  getAllPathPoints() {
    return this.paths.reduce((res, path) => {
      if (path.start.x === path.end.x) {
        if (path.start.y < path.end.y) {
          for (let i = path.start.y; i <= path.end.y; i++) {
            res.add(new Coordinate(path.start.x, i));
          }
        } else {
          for (let i = path.end.y; i <= path.start.y; i++) {
            res.add(new Coordinate(path.start.x, i));
          }
        }
      } else {
        if (path.start.x < path.end.x) {
          for (let i = path.start.x; i <= path.end.x; i++) {
            res.add(new Coordinate(i, path.start.y));
          }
        } else {
          for (let i = path.end.x; i <= path.start.x; i++) {
            res.add(new Coordinate(i, path.start.y));
          }
        }
      }
      return res;
    }, new Set());
  },
  drawPath(ctx, config) {
    const { leftOffset, pathWidth, fieldSize } = config;
    ctx.fillStyle = "magenta";
    this.getAllPathPoints().forEach((item) => {
      ctx.fillRect(
        leftOffset + fieldSize * item.x + fieldSize / 2,
        getYField(item.y) * fieldSize + fieldSize / 2,
        pathWidth,
        pathWidth
      );
    });
  },

  setPathsForRook(x, y, fieldsCount) {
    // const otherPieces = initialPieces.filter((item) => {
    //   return item.coordinate.x !== x && item.coordinate.y !== y;
    // });

    // console.log(otherPieces);

    paths.addToPath(
      new Path(new Coordinate(x, y), new Coordinate(fieldsCount - 1, y))
    );
    paths.addToPath(
      new Path(new Coordinate(x, y), new Coordinate(x, fieldsCount - 1))
    );
    paths.addToPath(new Path(new Coordinate(x, y), new Coordinate(0, y)));
    paths.addToPath(new Path(new Coordinate(x, y), new Coordinate(x, 0)));
  },
};
