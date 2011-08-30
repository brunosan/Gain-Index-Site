Map {
  background-color: #fff;
}

#gain {
  [factor>0][factor<22]{ polygon-fill: #FC7B7E; }
  [factor>=22][factor<30]{ polygon-fill: #E6838C; }
  [factor>=30][factor<39]{ polygon-fill: #D18B9A; }
  [factor>=39][factor<48]{ polygon-fill: #BC94A8; }
  [factor>=48][factor<57]{ polygon-fill: #A69CB6; }
  [factor>=57][factor<65]{ polygon-fill: #91A5C4; }
  [factor>=65][factor<74]{ polygon-fill: #7CADD2; }
  [factor>=74]{ polygon-fill: #67B6E0; }
  [factor=0]{ polygon-fill: #C6C6C6; }
  [factor=null] { 
    polygon-pattern-file: url(images/diagonal_8.png);
    polygon-pattern-alignment: global;
  }
}
