Map {
  background-color: #fff;
  background-image: url(images/dots.png);
}

#scores {
  [factor>0][factor<22]{ polygon-fill: #f85f5f; }
  [factor>=22][factor<30]{ polygon-fill: #f5734e; }
  [factor>=30][factor<39]{ polygon-fill: #eb944e; }
  [factor>=39][factor<48]{ polygon-fill: #E2B343; }
  [factor>=48][factor<57]{ polygon-fill: #ded943; }
  [factor>=57][factor<65]{ polygon-fill: #B3CE44; }
  [factor>=65][factor<74]{ polygon-fill: #94c250; }
  [factor>=74]{ polygon-fill: #79ba51; }
  [factor=0]{ polygon-fill: #dedede; }
  [factor=null] { 
    polygon-pattern-file: url(images/diagonal_8.png);
    polygon-pattern-alignment: global;
  }
}
