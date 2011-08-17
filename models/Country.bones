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
    },
    meta: function(key) {
        return Backbone.Model.escapeHTML(model.meta[this.id][key] || '');
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
        "oecd_income": "Low"
    },
    "ALB": {
        "ISO3": "ALB",
        "name": "Albania",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "DZA": {
        "ISO3": "DZA",
        "name": "Algeria",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
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
        "oecd_income": "Lower middle"
    },
    "ATG": {
        "ISO3": "ATG",
        "name": "Antigua and Barbuda",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "ARG": {
        "ISO3": "ARG",
        "name": "Argentina",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "ARM": {
        "ISO3": "ARM",
        "name": "Armenia",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "AUS": {
        "ISO3": "AUS",
        "name": "Australia",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "AUT": {
        "ISO3": "AUT",
        "name": "Austria",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "AZE": {
        "ISO3": "AZE",
        "name": "Azerbaijan",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "BHS": {
        "ISO3": "BHS",
        "name": "Bahamas",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "BHR": {
        "ISO3": "BHR",
        "name": "Bahrain",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "BGD": {
        "ISO3": "BGD",
        "name": "Bangladesh",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "BRB": {
        "ISO3": "BRB",
        "name": "Barbados",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "BLR": {
        "ISO3": "BLR",
        "name": "Belarus",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "BEL": {
        "ISO3": "BEL",
        "name": "Belgium",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "BLZ": {
        "ISO3": "BLZ",
        "name": "Belize",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "BEN": {
        "ISO3": "BEN",
        "name": "Benin",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "BTN": {
        "ISO3": "BTN",
        "name": "Bhutan",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "BOL": {
        "ISO3": "BOL",
        "name": "Bolivia",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "BIH": {
        "ISO3": "BIH",
        "name": "Bosnia & Herzegovina",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "BWA": {
        "ISO3": "BWA",
        "name": "Botswana",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "BRA": {
        "ISO3": "BRA",
        "name": "Brazil",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "BRN": {
        "ISO3": "BRN",
        "name": "Brunei Darussalam",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "BGR": {
        "ISO3": "BGR",
        "name": "Bulgaria",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "BFA": {
        "ISO3": "BFA",
        "name": "Burkina Faso",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "BDI": {
        "ISO3": "BDI",
        "name": "Burundi",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "KHM": {
        "ISO3": "KHM",
        "name": "Cambodia",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "CMR": {
        "ISO3": "CMR",
        "name": "Cameroon",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "CAN": {
        "ISO3": "CAN",
        "name": "Canada",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "CPV": {
        "ISO3": "CPV",
        "name": "Cape Verde",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "CAF": {
        "ISO3": "CAF",
        "name": "The Central African Republic",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "TCD": {
        "ISO3": "TCD",
        "name": "Chad",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "CHL": {
        "ISO3": "CHL",
        "name": "Chile",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "CHN": {
        "ISO3": "CHN",
        "name": "China",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "COL": {
        "ISO3": "COL",
        "name": "Colombia",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "COM": {
        "ISO3": "COM",
        "name": "Comoros",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "COG": {
        "ISO3": "COG",
        "name": "Congo",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "COD": {
        "ISO3": "COD",
        "name": "The Democratic Republic of the Congo",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "CRI": {
        "ISO3": "CRI",
        "name": "Costa Rica",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "CIV": {
        "ISO3": "CIV",
        "name": "Côte d'Ivoire",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "HRV": {
        "ISO3": "HRV",
        "name": "Croatia",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "CUB": {
        "ISO3": "CUB",
        "name": "Cuba",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "CYP": {
        "ISO3": "CYP",
        "name": "Cyprus",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "CZE": {
        "ISO3": "CZE",
        "name": "The Czech Republic",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "DNK": {
        "ISO3": "DNK",
        "name": "Denmark",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "DJI": {
        "ISO3": "DJI",
        "name": "Djibouti",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "DMA": {
        "ISO3": "DMA",
        "name": "Dominica",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "DOM": {
        "ISO3": "DOM",
        "name": "The Dominican Republic",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "ECU": {
        "ISO3": "ECU",
        "name": "Ecuador",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "EGY": {
        "ISO3": "EGY",
        "name": "Egypt",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "SLV": {
        "ISO3": "SLV",
        "name": "El Salvador",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "GNQ": {
        "ISO3": "GNQ",
        "name": "Equatorial Guinea",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "ERI": {
        "ISO3": "ERI",
        "name": "Eritrea",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "EST": {
        "ISO3": "EST",
        "name": "Estonia",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "ETH": {
        "ISO3": "ETH",
        "name": "Ethiopia",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "FJI": {
        "ISO3": "FJI",
        "name": "Fiji",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "FIN": {
        "ISO3": "FIN",
        "name": "Finland",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "FRA": {
        "ISO3": "FRA",
        "name": "France",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "GAB": {
        "ISO3": "GAB",
        "name": "Gabon",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "GMB": {
        "ISO3": "GMB",
        "name": "Gambia",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "GEO": {
        "ISO3": "GEO",
        "name": "Georgia",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "DEU": {
        "ISO3": "DEU",
        "name": "Germany",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "GHA": {
        "ISO3": "GHA",
        "name": "Ghana",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "GRC": {
        "ISO3": "GRC",
        "name": "Greece",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "GRD": {
        "ISO3": "GRD",
        "name": "Grenada",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "GTM": {
        "ISO3": "GTM",
        "name": "Guatemala",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "GIN": {
        "ISO3": "GIN",
        "name": "Guinea",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "GNB": {
        "ISO3": "GNB",
        "name": "Guinea-Bissau",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "GUY": {
        "ISO3": "GUY",
        "name": "Guyana",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "HTI": {
        "ISO3": "HTI",
        "name": "Haiti",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "HND": {
        "ISO3": "HND",
        "name": "Honduras",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "HUN": {
        "ISO3": "HUN",
        "name": "Hungary",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "ISL": {
        "ISO3": "ISL",
        "name": "Iceland",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "IND": {
        "ISO3": "IND",
        "name": "India",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "IDN": {
        "ISO3": "IDN",
        "name": "Indonesia",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "IRN": {
        "ISO3": "IRN",
        "name": "Iran",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "IRQ": {
        "ISO3": "IRQ",
        "name": "Iraq",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "IRL": {
        "ISO3": "IRL",
        "name": "Ireland",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "ISR": {
        "ISO3": "ISR",
        "name": "Israel",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "ITA": {
        "ISO3": "ITA",
        "name": "Italy",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "JAM": {
        "ISO3": "JAM",
        "name": "Jamaica",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "JPN": {
        "ISO3": "JPN",
        "name": "Japan",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "JOR": {
        "ISO3": "JOR",
        "name": "Jordan",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "KAZ": {
        "ISO3": "KAZ",
        "name": "Kazakhstan",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "KEN": {
        "ISO3": "KEN",
        "name": "Kenya",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "KIR": {
        "ISO3": "KIR",
        "name": "Kiribati",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "PRK": {
        "ISO3": "PRK",
        "name": "The Democratic People's Republic of Korea",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "KOR": {
        "ISO3": "KOR",
        "name": "The Republic of Korea",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "KWT": {
        "ISO3": "KWT",
        "name": "Kuwait",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "KGZ": {
        "ISO3": "KGZ",
        "name": "Kyrgyzstan",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "LAO": {
        "ISO3": "LAO",
        "name": "Laos",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "LVA": {
        "ISO3": "LVA",
        "name": "Latvia",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "LBN": {
        "ISO3": "LBN",
        "name": "Lebanon",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "LSO": {
        "ISO3": "LSO",
        "name": "Lesotho",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "LBR": {
        "ISO3": "LBR",
        "name": "Liberia",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "LBY": {
        "ISO3": "LBY",
        "name": "Libya",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "LIE": {
        "ISO3": "LIE",
        "name": "Liechtenstein",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "LTU": {
        "ISO3": "LTU",
        "name": "Lithuania",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "LUX": {
        "ISO3": "LUX",
        "name": "Luxembourg",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "MDG": {
        "ISO3": "MDG",
        "name": "Madagascar",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "MWI": {
        "ISO3": "MWI",
        "name": "Malawi",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "MYS": {
        "ISO3": "MYS",
        "name": "Malaysia",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "MDV": {
        "ISO3": "MDV",
        "name": "Maldives",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "MLI": {
        "ISO3": "MLI",
        "name": "Mali",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "MLT": {
        "ISO3": "MLT",
        "name": "Malta",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "MHL": {
        "ISO3": "MHL",
        "name": "The Marshall Islands",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "MRT": {
        "ISO3": "MRT",
        "name": "Mauritania",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "MUS": {
        "ISO3": "MUS",
        "name": "Mauritius",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "MEX": {
        "ISO3": "MEX",
        "name": "Mexico",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "FSM": {
        "ISO3": "FSM",
        "name": "The Federated States of Micronesia",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "MDA": {
        "ISO3": "MDA",
        "name": "Moldova",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "MCO": {
        "ISO3": "MCO",
        "name": "Monaco",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "MKD": {
        "ISO3": "MKD",
        "name": "Macedonia",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "MNG": {
        "ISO3": "MNG",
        "name": "Mongolia",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "MNE": {
        "ISO3": "MNE",
        "name": "Montenegro",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "MAR": {
        "ISO3": "MAR",
        "name": "Morocco",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "MOZ": {
        "ISO3": "MOZ",
        "name": "Mozambique",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "MMR": {
        "ISO3": "MMR",
        "name": "Myanmar",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "NAM": {
        "ISO3": "NAM",
        "name": "Namibia",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
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
        "oecd_income": "Low"
    },
    "NLD": {
        "ISO3": "NLD",
        "name": "The Netherlands",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "NZL": {
        "ISO3": "NZL",
        "name": "New Zealand",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "NIC": {
        "ISO3": "NIC",
        "name": "Nicaragua",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "NER": {
        "ISO3": "NER",
        "name": "Niger",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "NGA": {
        "ISO3": "NGA",
        "name": "Nigeria",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "NOR": {
        "ISO3": "NOR",
        "name": "Norway",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "OMN": {
        "ISO3": "OMN",
        "name": "Oman",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "PAK": {
        "ISO3": "PAK",
        "name": "Pakistan",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "PLW": {
        "ISO3": "PLW",
        "name": "Palau",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "PAN": {
        "ISO3": "PAN",
        "name": "Panama",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "PNG": {
        "ISO3": "PNG",
        "name": "Papua New Guinea",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "PRY": {
        "ISO3": "PRY",
        "name": "Paraguay",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "PER": {
        "ISO3": "PER",
        "name": "Peru",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "PHL": {
        "ISO3": "PHL",
        "name": "Philippines",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "POL": {
        "ISO3": "POL",
        "name": "Poland",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "PRT": {
        "ISO3": "PRT",
        "name": "Portugal",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "QAT": {
        "ISO3": "QAT",
        "name": "Qatar",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "ROU": {
        "ISO3": "ROU",
        "name": "Romania",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "RUS": {
        "ISO3": "RUS",
        "name": "The Russian Federation",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "RWA": {
        "ISO3": "RWA",
        "name": "Rwanda",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "KNA": {
        "ISO3": "KNA",
        "name": "Saint Kitts and Nevis",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "LCA": {
        "ISO3": "LCA",
        "name": "Saint Lucia",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "VCT": {
        "ISO3": "VCT",
        "name": "St Vincent & Grenadines",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "WSM": {
        "ISO3": "WSM",
        "name": "Samoa",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "SMR": {
        "ISO3": "SMR",
        "name": "San Marino",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "STP": {
        "ISO3": "STP",
        "name": "Sao Tome & Principe",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "SAU": {
        "ISO3": "SAU",
        "name": "Saudi Arabia",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "SEN": {
        "ISO3": "SEN",
        "name": "Senegal",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "SRB": {
        "ISO3": "SRB",
        "name": "Serbia",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "SYC": {
        "ISO3": "SYC",
        "name": "Seychelles",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "SLE": {
        "ISO3": "SLE",
        "name": "Sierra Leone",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "SGP": {
        "ISO3": "SGP",
        "name": "Singapore",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "SVK": {
        "ISO3": "SVK",
        "name": "Slovakia",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "SVN": {
        "ISO3": "SVN",
        "name": "Slovenia",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "SLB": {
        "ISO3": "SLB",
        "name": "Solomon Islands",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "SOM": {
        "ISO3": "SOM",
        "name": "Somalia",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "ZAF": {
        "ISO3": "ZAF",
        "name": "South Africa",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "ESP": {
        "ISO3": "ESP",
        "name": "Spain",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "LKA": {
        "ISO3": "LKA",
        "name": "Sri Lanka",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "SDN": {
        "ISO3": "SDN",
        "name": "Sudan",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "SUR": {
        "ISO3": "SUR",
        "name": "Suriname",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "SWZ": {
        "ISO3": "SWZ",
        "name": "Swaziland",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "SWE": {
        "ISO3": "SWE",
        "name": "Sweden",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "CHE": {
        "ISO3": "CHE",
        "name": "Switzerland",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "SYR": {
        "ISO3": "SYR",
        "name": "Syria",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "TJK": {
        "ISO3": "TJK",
        "name": "Tajikistan",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "TZA": {
        "ISO3": "TZA",
        "name": "Tanzania",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "THA": {
        "ISO3": "THA",
        "name": "Thailand",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
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
        "oecd_income": "Low"
    },
    "TON": {
        "ISO3": "TON",
        "name": "Tonga",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "TTO": {
        "ISO3": "TTO",
        "name": "Trinidad & Tobago",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "TUN": {
        "ISO3": "TUN",
        "name": "Tunisia",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "TUR": {
        "ISO3": "TUR",
        "name": "Turkey",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "TKM": {
        "ISO3": "TKM",
        "name": "Turkmenistan",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
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
        "oecd_income": "Low"
    },
    "UKR": {
        "ISO3": "UKR",
        "name": "Ukraine",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "ARE": {
        "ISO3": "ARE",
        "name": "United Arab Emirates",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "GBR": {
        "ISO3": "GBR",
        "name": "The United Kingdom",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "USA": {
        "ISO3": "USA",
        "name": "The United States",
        "oecd_value": "4",
        "oecd_income": "Upper"
    },
    "URY": {
        "ISO3": "URY",
        "name": "Uruguay",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "UZB": {
        "ISO3": "UZB",
        "name": "Uzbekistan",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "VUT": {
        "ISO3": "VUT",
        "name": "Vanuatu",
        "oecd_value": "2",
        "oecd_income": "Lower middle"
    },
    "VEN": {
        "ISO3": "VEN",
        "name": "Venezuela",
        "oecd_value": "3",
        "oecd_income": "Upper middle"
    },
    "VNM": {
        "ISO3": "VNM",
        "name": "Viet Nam",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "YEM": {
        "ISO3": "YEM",
        "name": "Yemen",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "ZMB": {
        "ISO3": "ZMB",
        "name": "Zambia",
        "oecd_value": "1",
        "oecd_income": "Low"
    },
    "ZWE": {
        "ISO3": "ZWE",
        "name": "Zimbabwe",
        "oecd_value": "1",
        "oecd_income": "Low"
    }
};
