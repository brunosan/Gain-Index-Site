Map {
  background-color: #fff;
}

#gain {
  [factor>0][factor<22]{ polygon-fill: #f64644; }
  [factor>=22][factor<30]{ polygon-fill: #ed6471; }
  [factor>=30][factor<39]{ polygon-fill: #e2748b; }
  [factor>=39][factor<48]{ polygon-fill: #BC94A8; }
  [factor>=48][factor<57]{ polygon-fill: #A69CB6; }
  [factor>=57][factor<65]{ polygon-fill: #88a7cb; }
  [factor>=65][factor<74]{ polygon-fill: #70a9d4; }
  [factor>=74]{ polygon-fill: #50aad7; }
  [factor=0]{ polygon-fill: #C6C6C6; }
  [factor=null] { 
    polygon-pattern-file: url(images/diagonal_8.png);
    polygon-pattern-alignment: global;
  }
}
