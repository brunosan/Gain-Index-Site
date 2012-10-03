Map {
  background-color: #fff;
}

#gain {
  [factor>0][factor<22]{ polygon-fill: #FF7F6D; }
  [factor>=22][factor<30]{ polygon-fill: #F59564; }
  [factor>=30][factor<39]{ polygon-fill: #EBAB5B; }
  [factor>=39][factor<48]{ polygon-fill: #E1C053; }
  [factor>=48][factor<57]{ polygon-fill: #D8D54B; }
  [factor>=57][factor<65]{ polygon-fill: #B3CE44; }
  [factor>=65][factor<74]{ polygon-fill: #8CC43D; }
  [factor>=74]{ polygon-fill: #67BB36; }
  [factor=0]{ polygon-fill: #C6C6C6; }
  [factor=null] { 
    polygon-pattern-file: url(images/diagonal_8.png);
    polygon-pattern-alignment: global;
  }
}
