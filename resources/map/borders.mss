@font: "Arial Regular";
@font_bold: "Arial Bold";
@font_italic: "Arial Italic";
@font_light: "Arial Narrow Regular";
@font_bold_italic: "Arial Bold Italic";

/* ---- Admin Level 0 Lines -------------------------------- */

country [BDY_STYLE!="Undisputed International Border - Coastal"] { 
  line-color: #fff;
  line-opacity: 0.75;
  [zoom>0] {line-width: 0.2; }
  [zoom=3] { line-width: 0.6; }
  [zoom=4] { line-width: 1; }
  [zoom=5] { line-width: 1.4; }
  [zoom=6] { line-width: 1.8; }
  [zoom=7] { line-width: 2.2; }
}

/* ---- Admin Level 0 Labels -------------------------------- */

label_lines[zoom=3][Z_MIN<=3][Z_MAX>=3],
label_lines[zoom=4][Z_MIN<=4][Z_MAX>=4],
label_lines[zoom=5][Z_MIN<=5][Z_MAX>=5],
label_lines[zoom=6][Z_MIN<=6][Z_MAX>=6],
label_lines[zoom=7][Z_MIN<=7][Z_MAX>=7] {
  line-color: #434343;
  line-opacity: 0.8;
  line-width: 0.8;
  line-dasharray: 5,2;
}

@adm0-txt: 9;

names[zoom>=3] {
  text-name: "''";
  text-allow-overlap: false;
  text-face-name: @font;
  text-fill: #434343;
  text-placement: point;
  [zoom=3][Z_MIN<=3][Z_MAX>=3] {
    text-name: "[WB_NAMES]";
    text-size: @adm0-txt+1;
    text-halo-fill: rgb(180,180,180,0.5);
    text-halo-radius: 0.2;
    text-wrap-width: 40;
    [ITALIC="TRUE"] { 
      text-face-name: @font_italic;
      text-size: @adm0-txt;
    }
  }
  [zoom=4][Z_MIN<=4][Z_MAX>=4] {
    text-name: "[WB_NAMES]";
    text-character-spacing: 2;
    text-line-spacing: 1;
    text-size: @adm0-txt+1;
    text-halo-fill: rgb(180,180,180,0.5);
    text-halo-radius: 0.3;
    text-wrap-width: 50;
    [ITALIC="TRUE"] { 
      text-face-name: @font_italic;
      text-size: @adm0-txt;
    }
    [WB_NAMES="Sierra Leone"] { text-dx: -1; }
  }
  [zoom=5][Z_MIN<=5][Z_MAX>=5] {
    text-name: "[WB_NAMES]";
    text-character-spacing: 3;
    text-line-spacing: 2;
    text-size: @adm0-txt+2;
    text-halo-fill: rgb(180,180,180,0.5);
    text-halo-radius: 0.4;
    text-wrap-width: 55;
    [ITALIC="TRUE"] { 
      text-face-name: @font_italic;
      text-size: @adm0-txt+1;
    }
    [WB_NAMES="Jordan"] { text-dy: 1; }
    [WB_NAMES="Montenegro"] { text-dy: 1; }
    [WB_NAMES="FYR Macedonia"] { text-dy: -1; }
  }
  [zoom=6][Z_MIN<=6][Z_MAX>=6] {
    text-name: "[WB_NAMES]";
    text-character-spacing: 4;
    text-line-spacing: 3;
    text-size: @adm0-txt+4;
    text-halo-fill: rgb(180,180,180,0.5);
    text-halo-radius: 0.5;
    text-wrap-width: 70;
    [ITALIC="TRUE"] { 
      text-face-name: @font_italic;
      text-size: @adm0-txt+2;
    }
    [WB_NAMES="Barbados"] { 
      text-dy: -1;
      text-dx: 1;
    }
    [WB_NAMES="St. Lucia"] { text-dy: -1; }
    [WB_NAMES="Antigua and Barbuda"] {
      text-dy: -1;
      text-dx: 1;
    }
  }
  [zoom>=7][Z_MAX>=7] {
    text-name: "[WB_NAMES]";
    text-character-spacing: 5;
    text-line-spacing: 3;
    text-size: @adm0-txt+6;
    text-halo-fill: rgb(180,180,180,0.5);
    text-halo-radius: 0.5;
    text-wrap-width: 80;
    text-face-name: @font_bold;
    [ITALIC="TRUE"] { 
      text-face-name: @font_bold_italic;
      text-size: @adm0-txt+4;
    }
    [WB_NAMES="Antigua and Barbuda"] {
      text-dy: -1;
      text-dx: 1;
    }
  }
}
