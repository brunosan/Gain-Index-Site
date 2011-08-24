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
            66.026471,
            33.838806
        ]
    },
    "ALB": {
        "ISO3": "ALB",
        "name": "Albania",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            20.156691,
            40.64109
        ]
    },
    "DZA": {
        "ISO3": "DZA",
        "name": "Algeria",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            2.632388,
            28.16324
        ]
    },
    "AND": {
        "ISO3": "AND",
        "name": "Andorra",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "AGO": {
        "ISO3": "AGO",
        "name": "Angola",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            17.912292,
            -12.099395
        ]
    },
    "ATG": {
        "ISO3": "ATG",
        "name": "Antigua and Barbuda",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            -61.791238,
            17.279816
        ]
    },
    "ARG": {
        "ISO3": "ARG",
        "name": "Argentina",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -63.998128,
            -35.376184
        ]
    },
    "ARM": {
        "ISO3": "ARM",
        "name": "Armenia",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            44.660395,
            40.605656
        ]
    },
    "AUS": {
        "ISO3": "AUS",
        "name": "Australia",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            134.489563,
            -25.734968
        ]
    },
    "AUT": {
        "ISO3": "AUT",
        "name": "Austria",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            14.300144,
            47.607798
        ]
    },
    "AZE": {
        "ISO3": "AZE",
        "name": "Azerbaijan",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            47.720341,
            40.41826
        ]
    },
    "BHS": {
        "ISO3": "BHS",
        "name": "Bahamas",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            -76.546624,
            25.243455
        ]
    },
    "BHR": {
        "ISO3": "BHR",
        "name": "Bahrain",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            50.559644,
            26.022407
        ]
    },
    "BGD": {
        "ISO3": "BGD",
        "name": "Bangladesh",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            90.268498,
            23.843233
        ]
    },
    "BRB": {
        "ISO3": "BRB",
        "name": "Barbados",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            -59.561955,
            13.178715
        ]
    },
    "BLR": {
        "ISO3": "BLR",
        "name": "Belarus",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            28.046788,
            53.539998
        ]
    },
    "BEL": {
        "ISO3": "BEL",
        "name": "Belgium",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            4.663989,
            50.642851
        ]
    },
    "BLZ": {
        "ISO3": "BLZ",
        "name": "Belize",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -88.686007,
            17.216854
        ]
    },
    "BEN": {
        "ISO3": "BEN",
        "name": "Benin",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            2.426674,
            10.338383
        ]
    },
    "BTN": {
        "ISO3": "BTN",
        "name": "Bhutan",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            90.429434,
            27.415415
        ]
    },
    "BOL": {
        "ISO3": "BOL",
        "name": "Bolivia",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -64.269605,
            -16.970662
        ]
    },
    "BIH": {
        "ISO3": "BIH",
        "name": "Bosnia & Herzegovina",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            17.786531,
            44.168115
        ]
    },
    "BWA": {
        "ISO3": "BWA",
        "name": "Botswana",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            24.316265,
            -22.212943
        ]
    },
    "BRA": {
        "ISO3": "BRA",
        "name": "Brazil",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -51.619789,
            -9.588903
        ]
    },
    "BRN": {
        "ISO3": "BRN",
        "name": "Brunei Darussalam",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            114.562411,
            4.565467
        ]
    },
    "BGR": {
        "ISO3": "BGR",
        "name": "Bulgaria",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            25.231507,
            42.761377
        ]
    },
    "BFA": {
        "ISO3": "BFA",
        "name": "Burkina Faso",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            -1.573062,
            12.27793
        ]
    },
    "BDI": {
        "ISO3": "BDI",
        "name": "Burundi",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            29.887146,
            -3.532454
        ]
    },
    "KHM": {
        "ISO3": "KHM",
        "name": "Cambodia",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            104.923981,
            12.457633
        ]
    },
    "CMR": {
        "ISO3": "CMR",
        "name": "Cameroon",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            12.213754,
            4.806512
        ]
    },
    "CAN": {
        "ISO3": "CAN",
        "name": "Canada",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            -105.750596,
            55.585901
        ]
    },
    "CPV": {
        "ISO3": "CPV",
        "name": "Cape Verde",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -23.967787,
            15.978966
        ]
    },
    "CAF": {
        "ISO3": "CAF",
        "name": "The Central African Republic",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            20.482826,
            6.571341
        ]
    },
    "TCD": {
        "ISO3": "TCD",
        "name": "Chad",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            18.664479,
            15.361167
        ]
    },
    "CHL": {
        "ISO3": "CHL",
        "name": "Chile",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -72.209377,
            -37.721037
        ]
    },
    "CHN": {
        "ISO3": "CHN",
        "name": "China",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            101.901875,
            35.486703
        ]
    },
    "COL": {
        "ISO3": "COL",
        "name": "Colombia",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -73.073215,
            3.900749
        ]
    },
    "COM": {
        "ISO3": "COM",
        "name": "Comoros",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            43.675917,
            -11.892755
        ]
    },
    "COG": {
        "ISO3": "COG",
        "name": "Congo",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            15.992858,
            -0.305605
        ]
    },
    "COD": {
        "ISO3": "COD",
        "name": "The Democratic Republic of the Congo",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            21.756270,
            -4.034790
        ]
    },
    "CRI": {
        "ISO3": "CRI",
        "name": "Costa Rica",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -84.188213,
            9.970197
        ]
    },
    "CIV": {
        "ISO3": "CIV",
        "name": "Côte d'Ivoire",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            -5.379007,
            7.806563
        ]
    },
    "HRV": {
        "ISO3": "HRV",
        "name": "Croatia",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            16.679107,
            45.664952
        ]
    },
    "CUB": {
        "ISO3": "CUB",
        "name": "Cuba",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -79.236672,
            21.946872
        ]
    },
    "CYP": {
        "ISO3": "CYP",
        "name": "Cyprus",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            33.221762,
            35.045882
        ]
    },
    "CZE": {
        "ISO3": "CZE",
        "name": "The Czech Republic",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            15.338412,
            49.742859
        ]
    },
    "DNK": {
        "ISO3": "DNK",
        "name": "Denmark",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            10.046297,
            55.963398
        ]
    },
    "DJI": {
        "ISO3": "DJI",
        "name": "Djibouti",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            42.577765,
            11.749677
        ]
    },
    "DMA": {
        "ISO3": "DMA",
        "name": "Dominica",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -61.355527,
            15.436552
        ]
    },
    "DOM": {
        "ISO3": "DOM",
        "name": "The Dominican Republic",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -70.109933,
            18.852633
        ]
    },
    "ECU": {
        "ISO3": "ECU",
        "name": "Ecuador",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -78.432915,
            -1.160171
        ]
    },
    "EGY": {
        "ISO3": "EGY",
        "name": "Egypt",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            29.871903,
            26.494184
        ]
    },
    "SLV": {
        "ISO3": "SLV",
        "name": "El Salvador",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -88.866511,
            13.736897
        ]
    },
    "GNQ": {
        "ISO3": "GNQ",
        "name": "Equatorial Guinea",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            10.525771,
            1.61213
        ]
    },
    "ERI": {
        "ISO3": "ERI",
        "name": "Eritrea",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            38.584156,
            15.680513
        ]
    },
    "EST": {
        "ISO3": "EST",
        "name": "Estonia",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            25.761527,
            58.778397
        ]
    },
    "ETH": {
        "ISO3": "ETH",
        "name": "Ethiopia",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            39.616032,
            8.62622
        ]
    },
    "FJI": {
        "ISO3": "FJI",
        "name": "Fiji",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            171.968499,
            -17.452033
        ]
    },
    "FIN": {
        "ISO3": "FIN",
        "name": "Finland",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            26.199539,
            62.777754
        ]
    },
    "FRA": {
        "ISO3": "FRA",
        "name": "France",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            2.618787,
            47.824905
        ]
    },
    "GAB": {
        "ISO3": "GAB",
        "name": "Gabon",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            11.797237,
            -0.590945
        ]
    },
    "GMB": {
        "ISO3": "GMB",
        "name": "Gambia",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            -15.912854,
            13.444526
        ]
    },
    "GEO": {
        "ISO3": "GEO",
        "name": "Georgia",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            43.517448,
            42.176311
        ]
    },
    "DEU": {
        "ISO3": "DEU",
        "name": "Germany",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            10.018343,
            51.133481
        ]
    },
    "GHA": {
        "ISO3": "GHA",
        "name": "Ghana",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            -1.190581,
            7.280948
        ]
    },
    "GRC": {
        "ISO3": "GRC",
        "name": "Greece",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            23.828554,
            38.589021
        ]
    },
    "GRD": {
        "ISO3": "GRD",
        "name": "Grenada",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -61.679377,
            12.112926
        ]
    },
    "GTM": {
        "ISO3": "GTM",
        "name": "Guatemala",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -90.390002,
            15.605589
        ]
    },
    "GIN": {
        "ISO3": "GIN",
        "name": "Guinea",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            -11.029862,
            10.785546
        ]
    },
    "GNB": {
        "ISO3": "GNB",
        "name": "Guinea-Bissau",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            -14.963483,
            12.031701
        ]
    },
    "GUY": {
        "ISO3": "GUY",
        "name": "Guyana",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -58.974781,
            5.623823
        ]
    },
    "HTI": {
        "ISO3": "HTI",
        "name": "Haiti",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            -72.434515,
            19.182436
        ]
    },
    "HND": {
        "ISO3": "HND",
        "name": "Honduras",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -86.619163,
            14.819007
        ]
    },
    "HUN": {
        "ISO3": "HUN",
        "name": "Hungary",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            19.499349,
            47.060267
        ]
    },
    "ISL": {
        "ISO3": "ISL",
        "name": "Iceland",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            -18.605467,
            64.997588
        ]
    },
    "IND": {
        "ISO3": "IND",
        "name": "India",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            79.280398,
            22.759652
        ]
    },
    "IDN": {
        "ISO3": "IDN",
        "name": "Indonesia",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            117.369878,
            -2.279866
        ]
    },
    "IRN": {
        "ISO3": "IRN",
        "name": "Iran",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            54.301374,
            32.565838
        ]
    },
    "IRQ": {
        "ISO3": "IRQ",
        "name": "Iraq",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            43.404716,
            33.048056
        ]
    },
    "IRL": {
        "ISO3": "IRL",
        "name": "Ireland",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            -7.737649,
            53.305494
        ]
    },
    "ISR": {
        "ISO3": "ISR",
        "name": "Israel",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            34.865459,
            31.086887
        ]
    },
    "ITA": {
        "ISO3": "ITA",
        "name": "Italy",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            12.646361,
            42.504154
        ]
    },
    "JAM": {
        "ISO3": "JAM",
        "name": "Jamaica",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -77.319222,
            18.151295
        ]
    },
    "JPN": {
        "ISO3": "JPN",
        "name": "Japan",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            138.59223,
            36.386493
        ]
    },
    "JOR": {
        "ISO3": "JOR",
        "name": "Jordan",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            36.435863,
            31.010192
        ]
    },
    "KAZ": {
        "ISO3": "KAZ",
        "name": "Kazakhstan",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            67.301774,
            48.160088
        ]
    },
    "KEN": {
        "ISO3": "KEN",
        "name": "Kenya",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            37.857882,
            0.529862
        ]
    },
    "KIR": {
        "ISO3": "KIR",
        "name": "Kiribati",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -157.371021,
            1.838936
        ]
    },
    "PRK": {
        "ISO3": "PRK",
        "name": "The Democratic People's Republic of Korea",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            126.847799,
            40.347099
        ]
    },
    "KOR": {
        "ISO3": "KOR",
        "name": "The Republic of Korea",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            128.168944,
            36.536236
        ]
    },
    "KWT": {
        "ISO3": "KWT",
        "name": "Kuwait",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            47.590604,
            29.341212
        ]
    },
    "KGZ": {
        "ISO3": "KGZ",
        "name": "Kyrgyzstan",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            74.555596,
            41.465054
        ]
    },
    "LAO": {
        "ISO3": "LAO",
        "name": "Laos",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            102.593737,
            19.922589
        ]
    },
    "LVA": {
        "ISO3": "LVA",
        "name": "Latvia",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            24.862593,
            56.959065
        ]
    },
    "LBN": {
        "ISO3": "LBN",
        "name": "Lebanon",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            35.888026,
            33.920265
        ]
    },
    "LSO": {
        "ISO3": "LSO",
        "name": "Lesotho",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            28.243011,
            -29.581
        ]
    },
    "LBR": {
        "ISO3": "LBR",
        "name": "Liberia",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            -9.307914,
            6.448092
        ]
    },
    "LBY": {
        "ISO3": "LBY",
        "name": "Libya",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            18.02328,
            27.043961
        ]
    },
    "LIE": {
        "ISO3": "LIE",
        "name": "Liechtenstein",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            9.554269,
            47.151848
        ]
    },
    "LTU": {
        "ISO3": "LTU",
        "name": "Lithuania",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            23.931538,
            55.487413
        ]
    },
    "LUX": {
        "ISO3": "LUX",
        "name": "Luxembourg",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            6.087814,
            49.770628
        ]
    },
    "MDG": {
        "ISO3": "MDG",
        "name": "Madagascar",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            46.705984,
            -19.373534
        ]
    },
    "MWI": {
        "ISO3": "MWI",
        "name": "Malawi",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            33.739164,
            -13.215804
        ]
    },
    "MYS": {
        "ISO3": "MYS",
        "name": "Malaysia",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            108.713972,
            3.198685
        ]
    },
    "MDV": {
        "ISO3": "MDV",
        "name": "Maldives",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            73.25222,
            3.21647
        ]
    },
    "MLI": {
        "ISO3": "MLI",
        "name": "Mali",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            -1.252145,
            17.350335
        ]
    },
    "MLT": {
        "ISO3": "MLT",
        "name": "Malta",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            14.441921,
            35.890522
        ]
    },
    "MHL": {
        "ISO3": "MHL",
        "name": "The Marshall Islands",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            168.549305,
            8.434459
        ]
    },
    "MRT": {
        "ISO3": "MRT",
        "name": "Mauritania",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            -10.532793,
            19.757472
        ]
    },
    "MUS": {
        "ISO3": "MUS",
        "name": "Mauritius",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            57.870755,
            -20.251868
        ]
    },
    "MEX": {
        "ISO3": "MEX",
        "name": "Mexico",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -102.532867,
            23.950464
        ]
    },
    "FSM": {
        "ISO3": "FSM",
        "name": "The Federated States of Micronesia",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            160.397697,
            6.075438
        ]
    },
    "MDA": {
        "ISO3": "MDA",
        "name": "Moldova",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            28.574178,
            47.193871
        ]
    },
    "MCO": {
        "ISO3": "MCO",
        "name": "Monaco",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            7.412821,
            43.747981
        ]
    },
    "MKD": {
        "ISO3": "MKD",
        "name": "Macedonia",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            21.697476,
            41.599683
        ]
    },
    "MNG": {
        "ISO3": "MNG",
        "name": "Mongolia",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            103.083218,
            46.835291
        ]
    },
    "MNE": {
        "ISO3": "MNE",
        "name": "Montenegro",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            19.250734,
            42.790443
        ]
    },
    "MAR": {
        "ISO3": "MAR",
        "name": "Morocco",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -6.017073,
            32.350751
        ]
    },
    "MOZ": {
        "ISO3": "MOZ",
        "name": "Mozambique",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            34.750197,
            -18.087466
        ]
    },
    "MMR": {
        "ISO3": "MMR",
        "name": "Myanmar",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            96.506921,
            21.154319
        ]
    },
    "NAM": {
        "ISO3": "NAM",
        "name": "Namibia",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            17.288762,
            -21.20101
        ]
    },
    "NRU": {
        "ISO3": "NRU",
        "name": "Nauru",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "NPL": {
        "ISO3": "NPL",
        "name": "Nepal",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            83.938548,
            28.253007
        ]
    },
    "NLD": {
        "ISO3": "NLD",
        "name": "The Netherlands",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            5.580444,
            52.274688
        ]
    },
    "NZL": {
        "ISO3": "NZL",
        "name": "New Zealand",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            171.7799,
            -41.838875
        ]
    },
    "NIC": {
        "ISO3": "NIC",
        "name": "Nicaragua",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -85.034783,
            12.839905
        ]
    },
    "NER": {
        "ISO3": "NER",
        "name": "Niger",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            9.397648,
            17.426149
        ]
    },
    "NGA": {
        "ISO3": "NGA",
        "name": "Nigeria",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            8.105306,
            9.59396
        ]
    },
    "NOR": {
        "ISO3": "NOR",
        "name": "Norway",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            8.804821,
            61.248333
        ]
    },
    "OMN": {
        "ISO3": "OMN",
        "name": "Oman",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            57.086424,
            21.383637
        ]
    },
    "PAK": {
        "ISO3": "PAK",
        "name": "Pakistan",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            69.385966,
            29.967022
        ]
    },
    "PLW": {
        "ISO3": "PLW",
        "name": "Palau",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            134.575242,
            7.515075
        ]
    },
    "PAN": {
        "ISO3": "PAN",
        "name": "Panama",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -80.268175,
            8.704735
        ]
    },
    "PNG": {
        "ISO3": "PNG",
        "name": "Papua New Guinea",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            145.241749,
            -6.478378
        ]
    },
    "PRY": {
        "ISO3": "PRY",
        "name": "Paraguay",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -58.391024,
            -23.236211
        ]
    },
    "PER": {
        "ISO3": "PER",
        "name": "Peru",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -75.311132,
            -10.151093
        ]
    },
    "PHL": {
        "ISO3": "PHL",
        "name": "Philippines",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            122.878708,
            11.741834
        ]
    },
    "POL": {
        "ISO3": "POL",
        "name": "Poland",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            19.300636,
            52.12461
        ]
    },
    "PRT": {
        "ISO3": "PRT",
        "name": "Portugal",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            -8.562731,
            39.600995
        ]
    },
    "QAT": {
        "ISO3": "QAT",
        "name": "Qatar",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            51.191201,
            25.315079
        ]
    },
    "ROU": {
        "ISO3": "ROU",
        "name": "Romania",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            24.960938,
            45.874712
        ]
    },
    "RUS": {
        "ISO3": "RUS",
        "name": "The Russian Federation",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            96.669705,
            61.994573
        ]
    },
    "RWA": {
        "ISO3": "RWA",
        "name": "Rwanda",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            29.917652,
            -1.865506
        ]
    },
    "KNA": {
        "ISO3": "KNA",
        "name": "Saint Kitts and Nevis",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -62.753518,
            17.326189
        ]
    },
    "LCA": {
        "ISO3": "LCA",
        "name": "Saint Lucia",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -60.968712,
            13.897869
        ]
    },
    "VCT": {
        "ISO3": "VCT",
        "name": "St Vincent & Grenadines",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -61.193765,
            13.254808
        ]
    },
    "WSM": {
        "ISO3": "WSM",
        "name": "Samoa",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -172.159463,
            -13.758365
        ]
    },
    "SMR": {
        "ISO3": "SMR",
        "name": "San Marino",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            12.460977,
            43.942943
        ]
    },
    "STP": {
        "ISO3": "STP",
        "name": "Sao Tome & Principe",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            6.736588,
            0.456984
        ]
    },
    "SAU": {
        "ISO3": "SAU",
        "name": "Saudi Arabia",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            44.548171,
            24.131342
        ]
    },
    "SEN": {
        "ISO3": "SEN",
        "name": "Senegal",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            -14.82088,
            15.221447
        ]
    },
    "SRB": {
        "ISO3": "SRB",
        "name": "Serbia",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            20.7953,
            44.226737
        ]
    },
    "SYC": {
        "ISO3": "SYC",
        "name": "Seychelles",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            52.229874,
            -6.354384
        ]
    },
    "SLE": {
        "ISO3": "SLE",
        "name": "Sierra Leone",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            -11.791922,
            8.560284
        ]
    },
    "SGP": {
        "ISO3": "SGP",
        "name": "Singapore",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            103.808053,
            1.351616
        ]
    },
    "SVK": {
        "ISO3": "SVK",
        "name": "Slovakia",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            19.491651,
            48.707531
        ]
    },
    "SVN": {
        "ISO3": "SVN",
        "name": "Slovenia",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            14.694076,
            46.169458
        ]
    },
    "SLB": {
        "ISO3": "SLB",
        "name": "Solomon Islands",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            159.634315,
            -8.918216
        ]
    },
    "SOM": {
        "ISO3": "SOM",
        "name": "Somalia",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            47.325853,
            5.786396
        ]
    },
    "ZAF": {
        "ISO3": "ZAF",
        "name": "South Africa",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            23.913711,
            -28.378272
        ]
    },
    "ESP": {
        "ISO3": "ESP",
        "name": "Spain",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            -3.280887,
            40.304531
        ]
    },
    "LKA": {
        "ISO3": "LKA",
        "name": "Sri Lanka",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            80.704727,
            7.608085
        ]
    },
    "SDN": {
        "ISO3": "SDN",
        "name": "Sudan",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            30.049948,
            13.831539
        ]
    },
    "SUR": {
        "ISO3": "SUR",
        "name": "Suriname",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -55.911826,
            3.692967
        ]
    },
    "SWZ": {
        "ISO3": "SWZ",
        "name": "Swaziland",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            31.497529,
            -26.562642
        ]
    },
    "SWE": {
        "ISO3": "SWE",
        "name": "Sweden",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            17.675409,
            64.964875
        ]
    },
    "CHE": {
        "ISO3": "CHE",
        "name": "Switzerland",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            8.234392,
            46.802496
        ]
    },
    "SYR": {
        "ISO3": "SYR",
        "name": "Syria",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            38.505592,
            35.013048
        ]
    },
    "TJK": {
        "ISO3": "TJK",
        "name": "Tajikistan",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            71.042004,
            38.838508
        ]
    },
    "TZA": {
        "ISO3": "TZA",
        "name": "Tanzania",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            34.823454,
            -6.270353
        ]
    },
    "THA": {
        "ISO3": "THA",
        "name": "Thailand",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            101.017438,
            15.127333
        ]
    },
    "TLS": {
        "ISO3": "TLS",
        "name": "Timor-Leste",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "TGO": {
        "ISO3": "TGO",
        "name": "Togo",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            1.042553,
            8.766221
        ]
    },
    "TON": {
        "ISO3": "TON",
        "name": "Tonga",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            -174.831293,
            -20.393369
        ]
    },
    "TTO": {
        "ISO3": "TTO",
        "name": "Trinidad & Tobago",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            -61.253176,
            10.468643
        ]
    },
    "TUN": {
        "ISO3": "TUN",
        "name": "Tunisia",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            9.561168,
            34.110704
        ]
    },
    "TUR": {
        "ISO3": "TUR",
        "name": "Turkey",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            35.179593,
            39.060481
        ]
    },
    "TKM": {
        "ISO3": "TKM",
        "name": "Turkmenistan",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            59.384377,
            39.122285
        ]
    },
    "TUV": {
        "ISO3": "TUV",
        "name": "Tuvalu",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "UGA": {
        "ISO3": "UGA",
        "name": "Uganda",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            32.386218,
            1.279964
        ]
    },
    "UKR": {
        "ISO3": "UKR",
        "name": "Ukraine",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            31.320283,
            49.322794
        ]
    },
    "ARE": {
        "ISO3": "ARE",
        "name": "United Arab Emirates",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            54.256172,
            23.85206
        ]
    },
    "GBR": {
        "ISO3": "GBR",
        "name": "The United Kingdom",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            -1.428851,
            52.576441
        ]
    },
    "USA": {
        "ISO3": "USA",
        "name": "The United States",
        "oecd_value": "4",
        "oecd_income": "Upper",
        "coords": [
            -97.922211,
            39.381266
        ]
    },
    "URY": {
        "ISO3": "URY",
        "name": "Uruguay",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -56.012396,
            -32.799646
        ]
    },
    "UZB": {
        "ISO3": "UZB",
        "name": "Uzbekistan",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            63.169372,
            41.750437
        ]
    },
    "VUT": {
        "ISO3": "VUT",
        "name": "Vanuatu",
        "oecd_value": "2",
        "oecd_income": "Lower middle",
        "coords": [
            167.718149,
            -16.255052
        ]
    },
    "VEN": {
        "ISO3": "VEN",
        "name": "Venezuela",
        "oecd_value": "3",
        "oecd_income": "Upper middle",
        "coords": [
            -65.801997,
            7.61957
        ]
    },
    "VNM": {
        "ISO3": "VNM",
        "name": "Viet Nam",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            108.339537,
            14.315424
        ]
    },
    "YEM": {
        "ISO3": "YEM",
        "name": "Yemen",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            47.621931,
            15.937835
        ]
    },
    "ZMB": {
        "ISO3": "ZMB",
        "name": "Zambia",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            27.430675,
            -14.004908
        ]
    },
    "ZWE": {
        "ISO3": "ZWE",
        "name": "Zimbabwe",
        "oecd_value": "1",
        "oecd_income": "Low",
        "coords": [
            29.938669,
            -19.189459
        ]
    }
};
