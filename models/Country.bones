model = Backbone.Model.extend({
    url: function() {
        return '/api/Country/' + encodeURIComponent(this.get('id'));
    },
    parse: function(resp) {
        resp.indicators = new models.Indicators(resp.indicators);
        return resp;
    },
    initialize: function(attributes, options) {
        var indicators = new models.Indicators(attributes.indicators);
        this.set({indicators: indicators}, {silent : true});
        model.meta[this.id] && this.set(model.meta[this.id], {silent: true});
    },
    meta: function(key) {
        return model.meta[this.id][key] || '';
    }
});

// From backbone.js
Backbone.Model.escapeHTML = function(string) {
    return string.replace(/&(?!\w+;|#\d+;|#x[\da-f]+;)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27').replace(/\//g,'&#x2F;');
};

model.meta = {
    "AFG": {
        "ISO3": "AFG",
        "name": "Afghanistan",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            60.4867744445801,
            29.386604309082,
            74.8923110961914,
            38.4736747741699
        ]
    },
    "ALB": {
        "ISO3": "ALB",
        "name": "Albania",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            19.2720317840576,
            39.6370124816895,
            21.0366802215576,
            42.6548156738281
        ]
    },
    "DZA": {
        "ISO3": "DZA",
        "name": "Algeria",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -8.68238544464111,
            18.9755611419678,
            11.968861579895,
            37.0937614440918
        ]
    },
    "AND": {
        "ISO3": "AND",
        "name": "Andorra",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            1.40645623207092,
            42.4286766052246,
            1.76509082317352,
            42.6493644714355
        ]
    },
    "AGO": {
        "ISO3": "AGO",
        "name": "Angola",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            11.6636590957642,
            -18.0314064025879,
            24.0617160797119,
            -4.3912034034729
        ]
    },
    "ATG": {
        "ISO3": "ATG",
        "name": "Antigua and Barbuda",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            -61.8934020996094,
            16.9890918731689,
            -61.6668510437012,
            17.7274990081787
        ]
    },
    "ARG": {
        "ISO3": "ARG",
        "name": "Argentina",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -73.5880432128906,
            -55.0520935058594,
            -53.661548614502,
            -21.786937713623
        ]
    },
    "ARM": {
        "ISO3": "ARM",
        "name": "Armenia",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            43.4362907409668,
            38.8637008666992,
            46.6026153564453,
            41.290454864502
        ]
    },
    "AUS": {
        "ISO3": "AUS",
        "name": "Australia",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            112.907241821289,
            -54.7504043579102,
            159.106658935547,
            -9.2401065826416
        ]
    },
    "AUT": {
        "ISO3": "AUT",
        "name": "Austria",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            9.52115440368652,
            46.3786430358887,
            17.1483383178711,
            49.0097770690918
        ]
    },
    "AZE": {
        "ISO3": "AZE",
        "name": "Azerbaijan",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            44.7745552062988,
            38.3926429748535,
            50.626091003418,
            41.8904418945312
        ]
    },
    "BHS": {
        "ISO3": "BHS",
        "name": "Bahamas",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            -79.5943374633789,
            20.9175338745117,
            -72.7453994750977,
            26.9282817840576
        ]
    },
    "BHR": {
        "ISO3": "BHR",
        "name": "Bahrain",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            50.4492988586426,
            25.7892780303955,
            50.6210250854492,
            26.2423801422119
        ]
    },
    "BGD": {
        "ISO3": "BGD",
        "name": "Bangladesh",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            88.0217895507812,
            20.7384757995605,
            92.6428527832031,
            26.6235446929932
        ]
    },
    "BRB": {
        "ISO3": "BRB",
        "name": "Barbados",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            -59.6534881591797,
            13.0509357452393,
            -59.4261856079102,
            13.3443813323975
        ]
    },
    "BLR": {
        "ISO3": "BLR",
        "name": "Belarus",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            23.1656436920166,
            51.235164642334,
            32.7195358276367,
            56.1568069458008
        ]
    },
    "BEL": {
        "ISO3": "BEL",
        "name": "Belgium",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            2.52216100692749,
            49.4951019287109,
            6.37448406219482,
            51.4964294433594
        ]
    },
    "BLZ": {
        "ISO3": "BLZ",
        "name": "Belize",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -89.2365188598633,
            15.8796510696411,
            -87.7822570800781,
            18.490758895874
        ]
    },
    "BEN": {
        "ISO3": "BEN",
        "name": "Benin",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            0.759880781173706,
            6.21362686157227,
            3.83741927146912,
            12.3992443084717
        ]
    },
    "BTN": {
        "ISO3": "BTN",
        "name": "Bhutan",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            88.7300643920898,
            26.6961479187012,
            92.0887832641602,
            28.3206253051758
        ]
    },
    "BOL": {
        "ISO3": "BOL",
        "name": "Bolivia",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -69.6664962768555,
            -22.8972587585449,
            -57.4656600952148,
            -9.6798210144043
        ]
    },
    "BIH": {
        "ISO3": "BIH",
        "name": "Bosnia & Herzegovina",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            15.715877532959,
            42.5593223571777,
            19.6189994812012,
            45.2845344543457
        ]
    },
    "BWA": {
        "ISO3": "BWA",
        "name": "Botswana",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            19.9783458709717,
            -26.8917942047119,
            29.3500747680664,
            -17.7818069458008
        ]
    },
    "BRA": {
        "ISO3": "BRA",
        "name": "Brazil",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -74.0184783935547,
            -33.7422828674316,
            -28.8763446807861,
            5.26722526550293
        ]
    },
    "BRN": {
        "ISO3": "BRN",
        "name": "Brunei Darussalam",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            113.999168395996,
            4.01668071746826,
            115.360748291016,
            5.05705690383911
        ]
    },
    "BGR": {
        "ISO3": "BGR",
        "name": "Bulgaria",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            22.3450222015381,
            41.2381019592285,
            28.6040210723877,
            44.2284126281738
        ]
    },
    "BFA": {
        "ISO3": "BFA",
        "name": "Burkina Faso",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            -5.52257823944092,
            9.39188194274902,
            2.39016890525818,
            15.0799083709717
        ]
    },
    "BDI": {
        "ISO3": "BDI",
        "name": "Burundi",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            28.9868907928467,
            -4.46334409713745,
            30.833963394165,
            -2.30306220054626
        ]
    },
    "KHM": {
        "ISO3": "KHM",
        "name": "Cambodia",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            102.313423156738,
            10.4157733917236,
            107.61051940918,
            14.7045822143555
        ]
    },
    "CMR": {
        "ISO3": "CMR",
        "name": "Cameroon",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            8.5056095123291,
            1.6545512676239,
            16.2077236175537,
            13.0811414718628
        ]
    },
    "CAN": {
        "ISO3": "CAN",
        "name": "Canada",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            -141.005554199219,
            41.6690826416016,
            -52.6159286499023,
            83.1161193847656
        ]
    },
    "CPV": {
        "ISO3": "CPV",
        "name": "Cape Verde",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -25.3597145080566,
            14.8037738800049,
            -22.6658458709717,
            17.1963691711426
        ]
    },
    "CAF": {
        "ISO3": "CAF",
        "name": "The Central African Republic",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            14.3872652053833,
            2.23645353317261,
            27.4413013458252,
            11.000828742981
        ]
    },
    "TCD": {
        "ISO3": "TCD",
        "name": "Chad",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            13.4491834640503,
            7.45556640625,
            23.9844074249268,
            23.4447212219238
        ]
    },
    "CHL": {
        "ISO3": "CHL",
        "name": "Chile",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -109.452934265137,
            -55.9148826599121,
            -66.4200973510742,
            -17.5065784454346
        ]
    },
    "CHN": {
        "ISO3": "CHN",
        "name": "China",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            73.6022491455078,
            18.1691493988037,
            134.772583007812,
            53.5694465637207
        ]
    },
    "COL": {
        "ISO3": "COL",
        "name": "Colombia",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -81.7228927612305,
            -4.23648452758789,
            -66.8750534057617,
            13.3737592697144
        ]
    },
    "COM": {
        "ISO3": "COM",
        "name": "Comoros",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            43.2137718200684,
            -12.3805360794067,
            44.5295639038086,
            -11.3613719940186
        ]
    },
    "COG": {
        "ISO3": "COG",
        "name": "Congo",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            11.1275682449341,
            -5.01343965530396,
            18.6424083709717,
            3.70827627182007
        ]
    },
    "COD": {
        "ISO3": "COD",
        "name": "The Democratic Republic of the Congo",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            12.2109127044678,
            -13.4583511352539,
            31.2804470062256,
            5.37528038024902
        ]
    },
    "CRI": {
        "ISO3": "CRI",
        "name": "Costa Rica",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -87.1168518066406,
            5.51488399505615,
            -82.5628356933594,
            11.2099370956421
        ]
    },
    "CIV": {
        "ISO3": "CIV",
        "name": "Côte d'Ivoire",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            -8.61872005462646,
            4.34392166137695,
            -2.50632786750793,
            10.7264785766602
        ]
    },
    "HRV": {
        "ISO3": "HRV",
        "name": "Croatia",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            13.5018930435181,
            42.4160423278809,
            19.4078388214111,
            46.5469818115234
        ]
    },
    "CUB": {
        "ISO3": "CUB",
        "name": "Cuba",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -84.948844909668,
            19.8276271820068,
            -74.1321334838867,
            23.2655582427979
        ]
    },
    "CYP": {
        "ISO3": "CYP",
        "name": "Cyprus",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            32.2723236083984,
            34.6250190734863,
            34.099552154541,
            35.1868476867676
        ]
    },
    "CZE": {
        "ISO3": "CZE",
        "name": "The Czech Republic",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            12.0761404037476,
            48.5579147338867,
            18.8374347686768,
            51.0400123596191
        ]
    },
    "DNK": {
        "ISO3": "DNK",
        "name": "Denmark",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            8.09457492828369,
            54.5682945251465,
            15.1518707275391,
            57.7508964538574
        ]
    },
    "DJI": {
        "ISO3": "DJI",
        "name": "Djibouti",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            41.7491073608398,
            10.9298248291016,
            43.4192428588867,
            12.7077531814575
        ]
    },
    "DMA": {
        "ISO3": "DMA",
        "name": "Dominica",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -61.4882583618164,
            15.2016563415527,
            -61.2485542297363,
            15.6336727142334
        ]
    },
    "DOM": {
        "ISO3": "DOM",
        "name": "The Dominican Republic",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -72.0098419189453,
            17.545337677002,
            -68.3278884887695,
            19.9374923706055
        ]
    },
    "ECU": {
        "ISO3": "ECU",
        "name": "Ecuador",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -92.0116195678711,
            -5.0113730430603,
            -75.2272567749023,
            1.66436982154846
        ]
    },
    "EGY": {
        "ISO3": "EGY",
        "name": "Egypt",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            24.6883411407471,
            21.9943675994873,
            36.8995895385742,
            31.6563129425049
        ]
    },
    "SLV": {
        "ISO3": "SLV",
        "name": "El Salvador",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -90.1147842407227,
            13.1584482192993,
            -87.7036056518555,
            14.4453735351562
        ]
    },
    "GNQ": {
        "ISO3": "GNQ",
        "name": "Equatorial Guinea",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            5.61250448226929,
            -1.47582614421844,
            11.3363418579102,
            3.77227735519409
        ]
    },
    "ERI": {
        "ISO3": "ERI",
        "name": "Eritrea",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            36.4236450195312,
            12.3600215911865,
            43.124324798584,
            18.0046920776367
        ]
    },
    "EST": {
        "ISO3": "EST",
        "name": "Estonia",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            21.8329086303711,
            57.5158157348633,
            28.1864757537842,
            59.6706237792969
        ]
    },
    "ETH": {
        "ISO3": "ETH",
        "name": "Ethiopia",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            32.9897994995117,
            3.40333342552185,
            47.9791717529297,
            14.8795328140259
        ]
    },
    "FJI": {
        "ISO3": "FJI",
        "name": "Fiji",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            164.6848602294924,
            -13.869523300672846,
            179.62626647949236,
            -20.580830436326266
        ]
    },
    "FIN": {
        "ISO3": "FIN",
        "name": "Finland",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            20.6231632232666,
            59.8109741210938,
            31.5695266723633,
            70.0753173828125
        ]
    },
    "FRA": {
        "ISO3": "FRA",
        "name": "France",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            -10.705402374267624,
            51.38093373479068,
            19.17741012573238,
            41.749469749321136
        ]
    },
    "GAB": {
        "ISO3": "GAB",
        "name": "Gabon",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            8.69608879089355,
            -3.91340351104736,
            14.4989910125732,
            2.32249522209167
        ]
    },
    "GMB": {
        "ISO3": "GMB",
        "name": "Gambia",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            -16.8290729522705,
            13.0648365020752,
            -13.8187122344971,
            13.8199844360352
        ]
    },
    "GEO": {
        "ISO3": "GEO",
        "name": "Georgia",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            39.9859085083008,
            41.0441093444824,
            46.6948051452637,
            43.5758438110352
        ]
    },
    "DEU": {
        "ISO3": "DEU",
        "name": "Germany",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            5.85248947143555,
            47.2711181640625,
            15.0220594406128,
            55.0650672912598
        ]
    },
    "GHA": {
        "ISO3": "GHA",
        "name": "Ghana",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            -3.2625093460083,
            4.73692083358765,
            1.18796849250793,
            11.162938117981
        ]
    },
    "GRC": {
        "ISO3": "GRC",
        "name": "Greece",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            19.6269454956055,
            34.8147201538086,
            28.2403240203857,
            41.7504768371582
        ]
    },
    "GRD": {
        "ISO3": "GRD",
        "name": "Grenada",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -61.7897415161133,
            12.0026273727417,
            -61.4208946228027,
            12.5296239852905
        ]
    },
    "GTM": {
        "ISO3": "GTM",
        "name": "Guatemala",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -92.2454528808594,
            13.7492389678955,
            -88.2207336425781,
            17.8160209655762
        ]
    },
    "GIN": {
        "ISO3": "GIN",
        "name": "Guinea",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            -15.0804443359375,
            7.19020795822144,
            -7.66244745254517,
            12.6733884811401
        ]
    },
    "GNB": {
        "ISO3": "GNB",
        "name": "Guinea-Bissau",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            -16.7277870178223,
            10.9274473190308,
            -13.6607112884521,
            12.6794347763062
        ]
    },
    "GUY": {
        "ISO3": "GUY",
        "name": "Guyana",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -61.3967132568359,
            1.18582010269165,
            -56.4818153381348,
            8.55779933929443
        ]
    },
    "HTI": {
        "ISO3": "HTI",
        "name": "Haiti",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            -74.4884262084961,
            18.0257740020752,
            -71.6391067504883,
            20.0895767211914
        ]
    },
    "HND": {
        "ISO3": "HND",
        "name": "Honduras",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -89.3637924194336,
            12.9797763824463,
            -83.1295928955078,
            17.4184226989746
        ]
    },
    "HUN": {
        "ISO3": "HUN",
        "name": "Hungary",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            16.0940341949463,
            45.741340637207,
            22.8776016235352,
            48.5692329406738
        ]
    },
    "ISL": {
        "ISO3": "ISL",
        "name": "Iceland",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            -24.5392475128174,
            63.3964385986328,
            -13.5023231506348,
            66.5637969970703
        ]
    },
    "IND": {
        "ISO3": "IND",
        "name": "India",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            68.1438293457031,
            6.74540328979492,
            97.3622589111328,
            35.4953079223633
        ]
    },
    "IDN": {
        "ISO3": "IDN",
        "name": "Indonesia",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            95.0129318237305,
            -10.9227437973022,
            140.977630615234,
            5.90995073318481
        ]
    },
    "IRN": {
        "ISO3": "IRN",
        "name": "Iran",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            44.0148620605469,
            25.0767631530762,
            63.3196296691895,
            39.7715301513672
        ]
    },
    "IRQ": {
        "ISO3": "IRQ",
        "name": "Iraq",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            38.7745094299316,
            29.0631351470947,
            48.5597038269043,
            37.3754997253418
        ]
    },
    "IRL": {
        "ISO3": "IRL",
        "name": "Ireland",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            -10.4775733947754,
            51.4454116821289,
            -5.99288511276245,
            55.3860778808594
        ]
    },
    "ISR": {
        "ISO3": "ISR",
        "name": "Israel",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            34.2482757568359,
            29.4894409179688,
            35.8880729675293,
            33.4067230224609
        ]
    },
    "ITA": {
        "ISO3": "ITA",
        "name": "Italy",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            6.60272789001465,
            35.4892539978027,
            18.5179710388184,
            47.0852165222168
        ]
    },
    "JAM": {
        "ISO3": "JAM",
        "name": "Jamaica",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -78.3739242553711,
            17.7030029296875,
            -76.187255859375,
            18.5249176025391
        ]
    },
    "JPN": {
        "ISO3": "JPN",
        "name": "Japan",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            122.938415527344,
            24.2120876312256,
            153.985626220703,
            45.5201187133789
        ]
    },
    "JOR": {
        "ISO3": "JOR",
        "name": "Jordan",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            34.9498329162598,
            29.1899490356445,
            39.2919998168945,
            33.3716888427734
        ]
    },
    "KAZ": {
        "ISO3": "KAZ",
        "name": "Kazakhstan",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            46.4782752990723,
            40.5846519470215,
            87.3237991333008,
            55.4345512390137
        ]
    },
    "KEN": {
        "ISO3": "KEN",
        "name": "Kenya",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            33.8904647827148,
            -4.67780160903931,
            41.8850212097168,
            5.49173355102539
        ]
    },
    "KIR": {
        "ISO3": "KIR",
        "name": "Kiribati",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            186.17839813232447,
            9.558083490031526,
            216.06121063232447,
            -4.455277103043589
        ]
    },
    "PRK": {
        "ISO3": "PRK",
        "name": "The Democratic People's Republic of Korea",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            124.322105407715,
            37.6754264831543,
            130.700485229492,
            43.0102729797363
        ]
    },
    "KOR": {
        "ISO3": "KOR",
        "name": "The Republic of Korea",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            124.613967895508,
            33.1972999572754,
            130.920928955078,
            38.5783462524414
        ]
    },
    "KWT": {
        "ISO3": "KWT",
        "name": "Kuwait",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            46.5324325561523,
            28.533504486084,
            48.4329948425293,
            30.098217010498
        ]
    },
    "KGZ": {
        "ISO3": "KGZ",
        "name": "Kyrgyzstan",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            69.2262954711914,
            39.1892356872559,
            80.2575607299805,
            43.2617034912109
        ]
    },
    "LAO": {
        "ISO3": "LAO",
        "name": "Laos",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            100.097068786621,
            13.9154558181763,
            107.664367675781,
            22.4960441589355
        ]
    },
    "LVA": {
        "ISO3": "LVA",
        "name": "Latvia",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            20.9691886901855,
            55.6669883728027,
            28.2172756195068,
            58.0751419067383
        ]
    },
    "LBN": {
        "ISO3": "LBN",
        "name": "Lebanon",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            35.1001091003418,
            33.0555801391602,
            36.6041030883789,
            34.6875495910645
        ]
    },
    "LSO": {
        "ISO3": "LSO",
        "name": "Lesotho",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            27.0021533966064,
            -30.6588001251221,
            29.4359092712402,
            -28.5707607269287
        ]
    },
    "LBR": {
        "ISO3": "LBR",
        "name": "Liberia",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            -11.4755487442017,
            4.34707403182983,
            -7.38411808013916,
            8.56539630889893
        ]
    },
    "LBY": {
        "ISO3": "LBY",
        "name": "Libya",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            9.28654289245605,
            19.4961223602295,
            25.1568412780762,
            33.181079864502
        ]
    },
    "LIE": {
        "ISO3": "LIE",
        "name": "Liechtenstein",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            9.47588539123535,
            47.0523986816406,
            9.61572360992432,
            47.2628021240234
        ]
    },
    "LTU": {
        "ISO3": "LTU",
        "name": "Lithuania",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            20.9253673553467,
            53.8868408203125,
            26.8007221221924,
            56.4426040649414
        ]
    },
    "LUX": {
        "ISO3": "LUX",
        "name": "Luxembourg",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            5.71492719650269,
            49.4413223266602,
            6.50257968902588,
            50.174976348877
        ]
    },
    "MDG": {
        "ISO3": "MDG",
        "name": "Madagascar",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            43.2232818603516,
            -25.5985412597656,
            50.5042877197266,
            -11.9437656402588
        ]
    },
    "MWI": {
        "ISO3": "MWI",
        "name": "Malawi",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            32.6633071899414,
            -17.1353359222412,
            35.9043006896973,
            -9.38123416900635
        ]
    },
    "MYS": {
        "ISO3": "MYS",
        "name": "Malaysia",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            99.6454162597656,
            0.851370334625244,
            119.278388977051,
            7.35562467575073
        ]
    },
    "MDV": {
        "ISO3": "MDV",
        "name": "Maldives",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            72.6852035522461,
            -0.688690721988678,
            73.7535705566406,
            7.10706090927124
        ]
    },
    "MLI": {
        "ISO3": "MLI",
        "name": "Mali",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            -12.2641305923462,
            10.1400537490845,
            4.23563766479492,
            24.9950656890869
        ]
    },
    "MLT": {
        "ISO3": "MLT",
        "name": "Malta",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            14.183970451355,
            35.8010177612305,
            14.567720413208,
            36.0753211975098
        ]
    },
    "MHL": {
        "ISO3": "MHL",
        "name": "The Marshall Islands",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            165.282440185547,
            4.57359790802002,
            172.02995300293,
            14.6102209091187
        ]
    },
    "MRT": {
        "ISO3": "MRT",
        "name": "Mauritania",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            -17.0811767578125,
            14.7343988418579,
            -4.82161283493042,
            27.2854175567627
        ]
    },
    "MUS": {
        "ISO3": "MUS",
        "name": "Mauritius",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            56.510066986084,
            -20.5175590515137,
            63.4942970275879,
            -10.3166809082031
        ]
    },
    "MEX": {
        "ISO3": "MEX",
        "name": "Mexico",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -118.406364440918,
            14.5460634231567,
            -86.6998443603516,
            32.7128372192383
        ]
    },
    "FSM": {
        "ISO3": "FSM",
        "name": "The Federated States of Micronesia",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            138.064056396484,
            5.26970529556274,
            163.046783447266,
            9.5886926651001
        ]
    },
    "MDA": {
        "ISO3": "MDA",
        "name": "Moldova",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            26.6178874969482,
            45.4617729187012,
            30.1315765380859,
            48.4860343933105
        ]
    },
    "MCO": {
        "ISO3": "MCO",
        "name": "Monaco",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            7.37007141113281,
            43.7306098937988,
            7.42949962615967,
            43.7635078430176
        ]
    },
    "MKD": {
        "ISO3": "MKD",
        "name": "Macedonia",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            20.4441566467285,
            40.8493919372559,
            23.0095825195312,
            42.3703384399414
        ]
    },
    "MNG": {
        "ISO3": "MNG",
        "name": "Mongolia",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            87.7357025146484,
            41.5861434936523,
            119.907028198242,
            52.1295852661133
        ]
    },
    "MNE": {
        "ISO3": "MNE",
        "name": "Montenegro",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            18.4335289001465,
            41.8520698547363,
            20.3551712036133,
            43.5478858947754
        ]
    },
    "MAR": {
        "ISO3": "MAR",
        "name": "Morocco",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -17.0130920410156,
            21.4200630187988,
            -1.03199946880341,
            35.9241676330566
        ]
    },
    "MOZ": {
        "ISO3": "MOZ",
        "name": "Mozambique",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            30.2138442993164,
            -26.8602733612061,
            40.8485984802246,
            -10.4692296981812
        ]
    },
    "MMR": {
        "ISO3": "MMR",
        "name": "Myanmar",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            92.1749725341797,
            9.79053974151611,
            101.173858642578,
            28.5384674072266
        ]
    },
    "NAM": {
        "ISO3": "NAM",
        "name": "Namibia",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            11.7182292938232,
            -28.9593696594238,
            25.2597808837891,
            -16.9510555267334
        ]
    },
    "NRU": {
        "ISO3": "NRU",
        "name": "Nauru",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            166.907150268555,
            -0.552058219909668,
            166.958526611328,
            -0.490563243627548
        ]
    },
    "NPL": {
        "ISO3": "NPL",
        "name": "Nepal",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            80.0302810668945,
            26.3437671661377,
            88.169075012207,
            30.4169044494629
        ]
    },
    "NLD": {
        "ISO3": "NLD",
        "name": "The Netherlands",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            -1.8688254356383949,
            54.31993614360549,
            13.072580814361578,
            50.011499339843866
        ]
    },
    "NZL": {
        "ISO3": "NZL",
        "name": "New Zealand",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            144.14471435546852,
            -29.89150189051426,
            203.91033935546844,
            -50.99535270744034
        ]
    },
    "NIC": {
        "ISO3": "NIC",
        "name": "Nicaragua",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -87.6850357055664,
            10.7134809494019,
            -82.7249145507812,
            15.0309705734253
        ]
    },
    "NER": {
        "ISO3": "NER",
        "name": "Niger",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            0.152941107749939,
            11.6957721710205,
            15.9703226089478,
            23.5173530578613
        ]
    },
    "NGA": {
        "ISO3": "NGA",
        "name": "Nigeria",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            2.67108178138733,
            4.27193641662598,
            14.6699361801147,
            13.8802909851074
        ]
    },
    "NOR": {
        "ISO3": "NOR",
        "name": "Norway",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            -9.11682987213135,
            -54.4623603820801,
            33.6410293579102,
            80.7697525024414
        ]
    },
    "OMN": {
        "ISO3": "OMN",
        "name": "Oman",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            51.9786148071289,
            16.642032623291,
            59.8450622558594,
            26.3857822418213
        ]
    },
    "PAK": {
        "ISO3": "PAK",
        "name": "Pakistan",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            60.8443756103516,
            23.6943168640137,
            77.0489730834961,
            37.0544853210449
        ]
    },
    "PLW": {
        "ISO3": "PLW",
        "name": "Palau",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            131.131134033203,
            2.94901990890503,
            134.663543701172,
            7.73389625549316
        ]
    },
    "PAN": {
        "ISO3": "PAN",
        "name": "Panama",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -83.0532531738281,
            7.20555591583252,
            -77.1632690429688,
            9.62416839599609
        ]
    },
    "PNG": {
        "ISO3": "PNG",
        "name": "Papua New Guinea",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            140.849197387695,
            -11.6363954544067,
            155.967880249023,
            -1.34653162956238
        ]
    },
    "PRY": {
        "ISO3": "PRY",
        "name": "Paraguay",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -62.6503601074219,
            -27.5868434906006,
            -54.245288848877,
            -19.2867279052734
        ]
    },
    "PER": {
        "ISO3": "PER",
        "name": "Peru",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -81.3544387817383,
            -18.3445644378662,
            -68.6842498779297,
            -0.0290927104651928
        ]
    },
    "PHL": {
        "ISO3": "PHL",
        "name": "Philippines",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            116.955368041992,
            4.65555667877197,
            126.618095397949,
            21.1223812103271
        ]
    },
    "POL": {
        "ISO3": "POL",
        "name": "Poland",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            14.1239223480225,
            48.994010925293,
            24.1431579589844,
            54.8381042480469
        ]
    },
    "PRT": {
        "ISO3": "PRT",
        "name": "Portugal",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            -31.2842884063721,
            30.0292263031006,
            -6.20594692230225,
            42.1536331176758
        ]
    },
    "QAT": {
        "ISO3": "QAT",
        "name": "Qatar",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            50.7513999938965,
            24.5598697662354,
            51.6170883178711,
            26.1598529815674
        ]
    },
    "ROU": {
        "ISO3": "ROU",
        "name": "Romania",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            20.2428245544434,
            43.6500473022461,
            29.7001819610596,
            48.2748336791992
        ]
    },
    "RUS": {
        "ISO3": "RUS",
        "name": "The Russian Federation",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            225.70361328125,
            38.20309773621,
            -13.358886718754,
            82.20220529964
        ]
    },
    "RWA": {
        "ISO3": "RWA",
        "name": "Rwanda",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            28.857234954834,
            -2.82685494422913,
            30.887809753418,
            -1.05869388580322
        ]
    },
    "KNA": {
        "ISO3": "KNA",
        "name": "Saint Kitts and Nevis",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -62.8603210449219,
            17.1002998352051,
            -62.5360984802246,
            17.4156322479248
        ]
    },
    "LCA": {
        "ISO3": "LCA",
        "name": "Saint Lucia",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -61.0778465270996,
            13.7144603729248,
            -60.8822479248047,
            14.1116981506348
        ]
    },
    "VCT": {
        "ISO3": "VCT",
        "name": "St Vincent & Grenadines",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -61.4598121643066,
            12.5851755142212,
            -61.1232147216797,
            13.3805284500122
        ]
    },
    "WSM": {
        "ISO3": "WSM",
        "name": "Samoa",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -172.781600952148,
            -14.0528364181519,
            -171.436660766602,
            -13.4628973007202
        ]
    },
    "SMR": {
        "ISO3": "SMR",
        "name": "San Marino",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            12.3855514526367,
            43.8923606872559,
            12.4923162460327,
            43.9828758239746
        ]
    },
    "STP": {
        "ISO3": "STP",
        "name": "Sao Tome & Principe",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            6.46227169036865,
            0.0239273067563772,
            7.4633994102478,
            1.69963908195496
        ]
    },
    "SAU": {
        "ISO3": "SAU",
        "name": "Saudi Arabia",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            34.4899139404297,
            16.3712482452393,
            55.637565612793,
            32.1213493347168
        ]
    },
    "SEN": {
        "ISO3": "SEN",
        "name": "Senegal",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            -17.5353851318359,
            12.3056058883667,
            -11.3777761459351,
            16.6913871765137
        ]
    },
    "SRB": {
        "ISO3": "SRB",
        "name": "Serbia",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            18.8448333740234,
            42.2349510192871,
            22.9844779968262,
            46.1740684509277
        ]
    },
    "SYC": {
        "ISO3": "SYC",
        "name": "Seychelles",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            46.2079048156738,
            -9.75568294525146,
            56.2879676818848,
            -3.79113698005676
        ]
    },
    "SLE": {
        "ISO3": "SLE",
        "name": "Sierra Leone",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            -13.3004245758057,
            6.91926860809326,
            -10.2822351455688,
            9.99600601196289
        ]
    },
    "SGP": {
        "ISO3": "SGP",
        "name": "Singapore",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            103.640777587891,
            1.26416158676147,
            104.003868103027,
            1.44846570491791
        ]
    },
    "SVK": {
        "ISO3": "SVK",
        "name": "Slovakia",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            16.8444786071777,
            47.7500038146973,
            22.5396385192871,
            49.6017799377441
        ]
    },
    "SVN": {
        "ISO3": "SVN",
        "name": "Slovenia",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            13.3652610778809,
            45.4236335754395,
            16.5153026580811,
            46.8639640808105
        ]
    },
    "SLB": {
        "ISO3": "SLB",
        "name": "Solomon Islands",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            155.508255004883,
            -12.2905673980713,
            168.825805664062,
            -6.6001124382019
        ]
    },
    "SOM": {
        "ISO3": "SOM",
        "name": "Somalia",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            40.9653816223145,
            -1.69700133800507,
            51.4167900085449,
            11.9887790679932
        ]
    },
    "ZAF": {
        "ISO3": "ZAF",
        "name": "South Africa",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            16.4705486297607,
            -46.9658164978027,
            37.9782829284668,
            -22.1264514923096
        ]
    },
    "ESP": {
        "ISO3": "ESP",
        "name": "Spain",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            -18.1666126251221,
            27.6419830322266,
            4.35190963745117,
            43.8051834106445
        ]
    },
    "LKA": {
        "ISO3": "LKA",
        "name": "Sri Lanka",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            79.6561431884766,
            5.9235668182373,
            81.8906936645508,
            9.82942771911621
        ]
    },
    "SDN": {
        "ISO3": "SDN",
        "name": "Sudan",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            21.8094482421875,
            3.49020147323608,
            38.6156616210938,
            22.2269649505615
        ]
    },
    "SUR": {
        "ISO3": "SUR",
        "name": "Suriname",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -58.0676918029785,
            1.83350670337677,
            -53.9888153076172,
            6.00601720809937
        ]
    },
    "SWZ": {
        "ISO3": "SWZ",
        "name": "Swaziland",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            30.7829055786133,
            -27.3162651062012,
            32.1174011230469,
            -25.7359981536865
        ]
    },
    "SWE": {
        "ISO3": "SWE",
        "name": "Sweden",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            11.1087579727173,
            55.3424110412598,
            24.163724899292,
            69.0363616943359
        ]
    },
    "CHE": {
        "ISO3": "CHE",
        "name": "Switzerland",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            5.95480918884277,
            45.8207168579102,
            10.4666271209717,
            47.8011665344238
        ]
    },
    "SYR": {
        "ISO3": "SYR",
        "name": "Syria",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            35.7239456176758,
            32.3130416870117,
            42.3771858215332,
            37.3249092102051
        ]
    },
    "TJK": {
        "ISO3": "TJK",
        "name": "Tajikistan",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            67.3426895141602,
            36.678638458252,
            75.1641311645508,
            41.0399780273438
        ]
    },
    "TZA": {
        "ISO3": "TZA",
        "name": "Tanzania",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            29.3210296630859,
            -11.7312726974487,
            40.4497604370117,
            -0.985830128192902
        ]
    },
    "THA": {
        "ISO3": "THA",
        "name": "Thailand",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            97.3513946533203,
            5.62988996505737,
            105.651000976562,
            20.4450073242188
        ]
    },
    "TLS": {
        "ISO3": "TLS",
        "name": "Timor-Leste",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            124.030235290527,
            -9.50122833251953,
            127.313552856445,
            -8.13531589508057
        ]
    },
    "TGO": {
        "ISO3": "TGO",
        "name": "Togo",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            -0.166109174489975,
            6.10014533996582,
            1.78235077857971,
            11.1349811553955
        ]
    },
    "TON": {
        "ISO3": "TON",
        "name": "Tonga",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -176.219299316406,
            -22.3388423919678,
            -173.714263916016,
            -15.5596170425415
        ]
    },
    "TTO": {
        "ISO3": "TTO",
        "name": "Trinidad & Tobago",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            -61.9279747009277,
            10.0418682098389,
            -60.5213394165039,
            11.3509368896484
        ]
    },
    "TUN": {
        "ISO3": "TUN",
        "name": "Tunisia",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            7.4798321723938,
            30.2289047241211,
            11.5641317367554,
            37.3449592590332
        ]
    },
    "TUR": {
        "ISO3": "TUR",
        "name": "Turkey",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            25.6638374328613,
            35.8197784423828,
            44.8068580627441,
            42.0984916687012
        ]
    },
    "TKM": {
        "ISO3": "TKM",
        "name": "Turkmenistan",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            52.438117980957,
            35.1406440734863,
            66.6457824707031,
            42.7911911010742
        ]
    },
    "TUV": {
        "ISO3": "TUV",
        "name": "Tuvalu",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            176.125442504883,
            -9.42071628570557,
            179.906677246094,
            -5.67768812179565
        ]
    },
    "UGA": {
        "ISO3": "UGA",
        "name": "Uganda",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            29.5484580993652,
            -1.4752060174942,
            35.0064735412598,
            4.21969223022461
        ]
    },
    "UKR": {
        "ISO3": "UKR",
        "name": "Ukraine",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            22.1328392028809,
            44.3807525634766,
            40.1595458984375,
            52.3689498901367
        ]
    },
    "ARE": {
        "ISO3": "ARE",
        "name": "United Arab Emirates",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            51.5695419311523,
            22.6209449768066,
            56.3840827941895,
            26.0747928619385
        ]
    },
    "GBR": {
        "ISO3": "GBR",
        "name": "The United Kingdom",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            -13.6913566589355,
            49.9096145629883,
            1.77170538902283,
            60.8475532531738
        ]
    },
    "USA": {
        "ISO3": "USA",
        "name": "The United States",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            -216.94628906249,
            74.10854563412,
            22.116210937500,
            0.3241593883002
        ]
    },
    "URY": {
        "ISO3": "URY",
        "name": "Uruguay",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -58.4386787414551,
            -34.9734230041504,
            -53.1108360290527,
            -30.0968685150146
        ]
    },
    "UZB": {
        "ISO3": "UZB",
        "name": "Uzbekistan",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            55.9758377075195,
            37.1851463317871,
            73.1486434936523,
            45.5587196350098
        ]
    },
    "VUT": {
        "ISO3": "VUT",
        "name": "Vanuatu",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            166.520706176758,
            -20.2532863616943,
            169.899230957031,
            -13.0650405883789
        ]
    },
    "VEN": {
        "ISO3": "VEN",
        "name": "Venezuela",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -73.3911514282227,
            0.649315476417542,
            -59.8155937194824,
            12.1987400054932
        ]
    },
    "VNM": {
        "ISO3": "VNM",
        "name": "Viet Nam",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            102.11865234375,
            8.56539535522461,
            109.472831726074,
            23.3662757873535
        ]
    },
    "YEM": {
        "ISO3": "YEM",
        "name": "Yemen",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            42.5457534790039,
            12.1111993789673,
            54.5406837463379,
            18.9956378936768
        ]
    },
    "ZMB": {
        "ISO3": "ZMB",
        "name": "Zambia",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            21.9798774719238,
            -18.0692329406738,
            33.6742057800293,
            -8.19412326812744
        ]
    },
    "ZWE": {
        "ISO3": "ZWE",
        "name": "Zimbabwe",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            25.219367980957,
            -22.3973407745361,
            33.0427703857422,
            -15.6148071289062
        ]
    }
};
