Map {
  background-color: #fff;
}

#gain {
  ::outline {
    line-color: #eaeaea;
    line-width: 2;
    line-join: round;
  }

  [factor>0][factor<40]{ polygon-fill: #FF7178; }
  [factor>=40][factor<47]{ polygon-fill: #FF9CA1; }
  [factor>=47][factor<54]{ polygon-fill: #FFCBCD; }
  [factor>=54][factor<62]{ polygon-fill: #C6C6C6; }
  [factor>=62][factor<69]{ polygon-fill: #BEDEEF; }
  [factor>=69][factor<76]{ polygon-fill: #9FD6F1; }
  [factor>=76]{ polygon-fill: #45B5E3; }
  [factor=0]{ 
    polygon-pattern-file: url(images/diagonal_8.png);
    polygon-pattern-alignment: global;
  }
}
