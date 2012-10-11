Map {
  background-color: #fff;
  background-image: url(images/dots.png);
}

#scores {
  [vulnerability > .33] {
    [readiness <= .56] {
      polygon-fill: #F77C80; // Red quadrant
    }
    [readiness > .56] {
      polygon-fill: #68B5DF; // Blue quadrant
    }
  }
  [vulnerability <= .33] {
    [readiness <= .56] {
      polygon-fill: #F6CD47; // Yellow quadrant
    }
    [readiness > .56] {
      polygon-fill: #68BB37; // Green quadrant
    }
  }
  [factor_raw=null] {
    polygon-pattern-file: url(images/diagonal_8.png);
    polygon-pattern-alignment: global;
  }
}
