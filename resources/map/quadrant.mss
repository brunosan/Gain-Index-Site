Map {
  background-color: #fff;
}

#scores {
  [vulnerability > .3] {
    [readiness <= .56] {
      polygon-fill: #F77C80; // Red quadrant
    }
    [readiness > .56] {
      polygon-fill: #68B5DF; // Blue quadrant
    }
  }
  [vulnerability <= .3] {
    [readiness <= .56] {
      polygon-fill: #F6CD47; // Yellow quadrant
    }
    [readiness > .56] {
      polygon-fill: #68BB37; // Green quadrant
    }
  }
}
