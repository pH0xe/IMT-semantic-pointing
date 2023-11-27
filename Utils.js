export class Utils {
  static random(min, max) {
    return Math.random() * (max - min) + min;
  }

  // To test parameters
  // https://www.geogebra.org/calculator/znz4mzve
  static minSpeed = 0.1;
  static curveFlateness = 2.7;
  static gapShape = 1;
  static gapWidth = 1;
  static getSpeed(distances) {
    const minDistance = Math.min(...distances);
    return (
      Utils.minSpeed +
      Math.log(1 + minDistance ** (2 * Utils.gapShape) / Utils.gapWidth) /
        Math.log(10 ** Utils.curveFlateness)
    );
  }
}
