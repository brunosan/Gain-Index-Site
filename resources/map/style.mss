Map {
  background-color: #fff;
}

#gain {
  [DATA>0][DATA<40]{ polygon-fill: #FF7178; }
  [DATA>=40][DATA<47]{ polygon-fill: #FF9CA1; }
  [DATA>=47][DATA<54]{ polygon-fill: #FFCBCD; }
  [DATA>=54][DATA<62]{ polygon-fill: #C6C6C6; }
  [DATA>=62][DATA<69]{ polygon-fill: #BEDEEF; }
  [DATA>=69][DATA<76]{ polygon-fill: #9FD6F1; }
  [DATA>=76]{ polygon-fill: #45B5E3; }
  [DATA=0]{ 
    polygon-pattern-file: url(/home/mapbox/tilemill/files/data/gain/diagonal_8.png);
    polygon-pattern-alignment: global;
  }
}