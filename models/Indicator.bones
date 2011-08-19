model = Backbone.Model.extend({
    url: '',
    defaults: {
        currentYear: 2010,
        input: {},
        values: {}
    },
    optionDefaults: function(opt) {
        opt = opt || {};
        opt.format = opt.format == undefined ? true : opt.format;
        opt.year = opt.year || this.get('currentYear');
        return opt;
    },
    score: function(options) {
        options = this.optionDefaults(options);
        var value = this.get('values')[options.year];
        if (!options.format) {
            return value;
        }
        if (value > 1.0) {
            return this.format(value, {format: 'number', decimals: 1});
        }
        return this.format(value, {format: 'number', decimals: 3});
    },
    input: function(options) {
        options = this.optionDefaults(options);
        var value = this.get('input')[options.year];
        if (!options.format) {
            return value;
        }
        return this.format(value);
    },
    // TODO: assumes a maximum rank of 142, determine actual maximum.
    rank: function(options) {
        options = this.optionDefaults(options);
        var value = this.get('rank')[options.year];
        if (!options.format || _.isUndefined(value)) {
            return value;
        }
        var color = gradientRgb(['#67b6e0', '#fc7b7e'], 142, value.desc);
        return "<div class='rank-number' style='background-color: #" + color + ";'>" + value.desc + '</div>';
    },
    meta: function(key) {
        // TODO: Why do some indicators not have an id? Should we always use 'name'?
        return model.meta[this.id || this.get('name')][key] || '';
    },
    format: function(value, format) {
        // TODO: Why do some indicators not have an id? Should we always use 'name'?
        format = format || (this.id || this.get('name'));
        return model.format(value, format);
    }
});

// Formats a value
// ---------------
// value - value to format
// format - a format object describing the format or an id identifying an indicator.
model.format = function(value, format) {
    var meta = _.isObject(format) ? format : model.meta[format];
    if (_.isUndefined(meta)) return value;
    if (_.isUndefined(value)) return '-';
    if (model.formats[meta.format]) {
        value = model.formats[meta.format](value, meta);
    }
    if (meta.unit) {
        return meta.unit.replace('%s', value);
    }
    return value;
};

model.formats = {
    // From StackOverflow http://is.gd/sR4ygY
    number: function(n, meta) {
        var c = isNaN(meta.decimals) ? 0 : Math.abs(meta.decimals),
            d = '.',
            t = ',',
            sign = (n < 0) ? '-' : '',
            i = parseInt(n = Math.abs(n).toFixed(c)) + '',
            j = ((j = i.length) > 3) ? j % 3 : 0;
            return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ''); 
    }
};

model.meta = {
    "business": {
        "id": "business",
        "name": "Business freedom",
        "description": "Index of economic freedom: business freedom subcomponent",
        "format": "number",
        "decimals": "1",
        "percent_convert": null,
        "unit": null,
        "index": "readiness",
        "sector": null,
        "component": "economic",
        "source": [{
            "name": "Index of Economic Freedom",
            "link": "http://www.heritage.org/index/explore"
        }]
    },
    "coast_area": {
        "id": "coast_area",
        "name": "Coastal area",
        "description": "Land less than 5 meters above sea-level",
        "format": "number",
        "decimals": "2",
        "percent_convert": "n",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "infrastructure",
        "component": "exposure",
        "source": [{
            "name": "cait.wri.org",
            "link": "http://cait.wri.org/cait-va.php?page=valand5m&mode=view"
        }]
    },
    "coast_popn": {
        "id": "coast_popn",
        "name": "Coastal population",
        "description": "Population living less than 5 meters above sea-level",
        "format": "number",
        "decimals": "2",
        "percent_convert": "y",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "infrastructure",
        "component": "sensitivity",
        "source": [{
            "name": "cait.wri.org",
            "link": "http://cait.wri.org/cait-va.php?page=vapop5m&mode=view"
        }]
    },
    "corruption": {
        "id": "corruption",
        "name": "Control of corruption",
        "description": "World governance indicator: control of corruption component",
        "format": "number",
        "decimals": "2",
        "percent_convert": null,
        "unit": null,
        "index": "readiness",
        "sector": null,
        "component": "governance",
        "source": [{
            "name": "Worldwide Governance Indicators",
            "link": "http://info.worldbank.org/governance/wgi/sc_country.asp"
        }]
    },
    "d-Ppt": {
        "id": "d-Ppt",
        "name": "Precipitation change",
        "description": "Projected change in precipitation by the end of the 21st century",
        "format": "number",
        "decimals": "2",
        "percent_convert": "y",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "water",
        "component": "exposure",
        "source": [{
            "name": "www.cru.uea.ac.uk",
            "link": "http://www.cru.uea.ac.uk/cru/data/precip/"
        }]
    },
    "d-Temp": {
        "id": "d-Temp",
        "name": "Temperature change",
        "description": "Projected change in temperature by the end of the 21st century",
        "format": "number",
        "decimals": "1",
        "percent_convert": null,
        "unit": "°C",
        "index": "vulnerability",
        "sector": "water",
        "component": "exposure",
        "source": [{
            "name": "www.cru.uea.ac.uk",
            "link": "http://www.cru.uea.ac.uk/cru/data/temperature/"
        }]
    },
    "daly": {
        "id": "daly",
        "name": "Disability adjusted life years",
        "description": "Percent increase in DALY due to climate change in the late 21st century",
        "format": "number",
        "decimals": "2",
        "percent_convert": "y",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "health",
        "component": "exposure",
        "source": [{
            "name": "www.globalizationandhealth.com",
            "link": "http://www.globalizationandhealth.com/content/4/1/9"
        }]
    },
    "energy_access": {
        "id": "energy_access",
        "name": "Energy access",
        "description": "Percent population with access to electricity",
        "format": "number",
        "decimals": "1",
        "percent_convert": "n",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "infrastructure",
        "component": "exposure",
        "source": [{
            "name": "cait.wri.org",
            "link": "http://cait.wri.org/cait-va.php?page=vaelectricity&mode=view"
        }]
    },
    "energy_sensit": {
        "id": "energy_sensit",
        "name": "Energy sensitivity",
        "description": "Percent of energy derived from hydroelectric and imported power",
        "format": "number",
        "decimals": "0",
        "percent_convert": "y",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "infrastructure",
        "component": "sensitivity",
        "source": [
        {
            "name": "World Development Indicators",
            "link": "http://data.worldbank.org/indicator/EG.IMP.CONS.ZS"
        },
        {
            "name": "World Development Indicators",
            "link": "http://data.worldbank.org/indicator/EG.ELC.HYRO.ZS"
        }
        ]
    },
    "enrollment": {
        "id": "enrollment",
        "name": "Tertiary education",
        "description": "Percent enrollment tertiary education",
        "format": "number",
        "decimals": "2",
        "percent_convert": "n",
        "unit": "%s %",
        "index": "readiness",
        "sector": null,
        "component": "social",
        "source": [{
            "name": "World Development Indicators",
            "link": "http://data.worldbank.org/indicator/SE.TER.ENRR"
        }]
    },
    "external": {
        "id": "external",
        "name": "External dependence",
        "description": "Total expendature on external resources for health",
        "format": "number",
        "decimals": "2",
        "percent_convert": "n",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "health",
        "component": "sensitivity",
        "source": [{
            "name": "World Development Indicators",
            "link": "http://data.worldbank.org/indicator/SH.XPD.EXTR.ZS"
        }]
    },
    "finan": {
        "id": "finan",
        "name": "Financial freedom",
        "description": "Index of economic freedom: fiancial freedom subcomponent",
        "format": "number",
        "decimals": "1",
        "percent_convert": null,
        "unit": null,
        "index": "readiness",
        "sector": null,
        "component": "economic",
        "source": [{
            "name": "Index of Economic Freedom",
            "link": "http://www.heritage.org/index/explore"
        }]
    },
    "fiscal": {
        "id": "fiscal",
        "name": "Fiscal freedom",
        "description": "Index of economic freedom: fiscal freedom subcomponent",
        "format": "number",
        "decimals": "1",
        "percent_convert": null,
        "unit": null,
        "index": "readiness",
        "sector": null,
        "component": "economic",
        "source": [{
            "name": "Index of Economic Freedom",
            "link": "http://www.heritage.org/index/explore"
        }]
    },
    "food_capacity": {
        "id": "food_capacity",
        "name": "Food capacity",
        "description": "Average of 2 best scores between use of fertilizers, mechanization and irrigation",
        "format": "number",
        "decimals": "2",
        "percent_convert": null,
        "unit": null,
        "index": "vulnerability",
        "sector": "food",
        "component": "capacity",
        "source": [
        {
            "name": "World Development Indicators",
            "link": "http://data.worldbank.org/indicator/AG.CON.FERT.ZS"
        },
        {
            "name": "World Development Indicators",
            "link": "http://data.worldbank.org/indicator/AG.LND.TRAC.ZS"
        },
        {
            "name": "World Development Indicators",
            "link": "http://data.worldbank.org/indicator/AG.LND.IRIG.AG.ZS"
        }
        ]
    },
    "gdp": {
        "id": "gdp",
        "name": "GDP per capita",
        "description": "Gross domestic product per capita",
        "format": "number",
        "decimals": "2",
        "percent_convert": null,
        "unit": "%s [PPP]",
        "index": null,
        "sector": null,
        "component": null
    },
    "gov_spend": {
        "id": "gov_spend",
        "name": "Government spending",
        "description": "Index of economic freedom: goverment spending subcomponent",
        "format": "number",
        "decimals": "1",
        "percent_convert": null,
        "unit": null,
        "index": "readiness",
        "sector": null,
        "component": "economic",
        "source": [{
            "name": "World Development Indicators",
            "link": "http://data.worldbank.org/indicator/AG.CON.FERT.ZS"
        }]
    },
    "health_disease": {
        "id": "health_disease",
        "name": "Disease mortality",
        "description": "Percentage mortality due to infectious diseases",
        "format": "number",
        "decimals": "2",
        "percent_convert": "y",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "health",
        "component": "exposure",
        "source": [{
            "name": "apps.who.int",
            "link": "http://apps.who.int/ghodata/?vid=99001#"
        }]
    },
    "imports": {
        "id": "imports",
        "name": "Food import dependency",
        "description": "Proportion of cereal consumption derived from external sources",
        "format": "number",
        "decimals": "0",
        "percent_convert": "y",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "food",
        "component": "sensitivity",
        "source": ["FAO"]
    },
    "invest": {
        "id": "invest",
        "name": "Investment freedom",
        "description": "Index of economic freedom: investment freedom subcomponent",
        "format": "number",
        "decimals": "1",
        "percent_convert": null,
        "unit": null,
        "index": "readiness",
        "sector": null,
        "component": "economic",
        "source": [{
            "name": "Index of Economic Freedom",
            "link": "http://www.heritage.org/index/explore"
        }]
    },
    "labor": {
        "id": "labor",
        "name": "Labor freedom",
        "description": "Index of economic freedom: labor freedom subcomponent",
        "format": "number",
        "decimals": "1",
        "percent_convert": null,
        "unit": null,
        "index": "readiness",
        "sector": null,
        "component": "social",
        "source": [{
            "name": "Index of Economic Freedom",
            "link": "http://www.heritage.org/index/explore"
        }]
    },
    "life": {
        "id": "life",
        "name": "Life expectancy",
        "description": "Life expectancy at birth",
        "format": "number",
        "decimals": "1",
        "percent_convert": null,
        "unit": null,
        "index": "vulnerability",
        "sector": "health",
        "component": "capacity",
        "source": [{
            "name": "World Development Indicators",
            "link": "http://data.worldbank.org/indicator/SP.DYN.LE00.IN"
        }]
    },
    "malnutr": {
        "id": "malnutr",
        "name": "Malnutrition",
        "description": "Percent of under 5 year-olds with low weight for their height",
        "format": "number",
        "decimals": "1",
        "percent_convert": "n",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "food",
        "component": "capacity",
        "source": ["WHO"]
    },
    "matern": {
        "id": "matern",
        "name": "Maternal mortality",
        "description": "Lifetime risk of maternal death",
        "format": "number",
        "decimals": "2",
        "percent_convert": "n",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "health",
        "component": "capacity",
        "source": [{
            "name": "World Development Indicators",
            "link": "http://data.worldbank.org/indicator/SH.MMR.RISK.ZS"
        }]
    },
    "mobiles": {
        "id": "mobiles",
        "name": "Mobile penetration",
        "description": "Mobile cellular subscriptions (per 100 people)",
        "format": "number",
        "decimals": "2",
        "percent_convert": null,
        "unit": null,
        "index": "readiness",
        "sector": null,
        "component": "social",
        "source": [{
            "name": "World Development Indicators",
            "link": "http://data.worldbank.org/indicator/IT.CEL.SETS.P2"
        }]
    },
    "monetary": {
        "id": "monetary",
        "name": "Monetary freedom",
        "description": "Index of economic freedom: monetary freedom subcomponent",
        "format": "number",
        "decimals": "1",
        "percent_convert": null,
        "unit": null,
        "index": "readiness",
        "sector": null,
        "component": "economic",
        "source": [{
            "name": "Index of Economic Freedom",
            "link": "http://www.heritage.org/index/explore"
        }]
    },
    "non_violence": {
        "id": "non_violence",
        "name": "Political stability & non-violence",
        "description": "World governance indicator: political stability and non-violence component",
        "format": "number",
        "decimals": "2",
        "percent_convert": null,
        "unit": null,
        "index": "readiness",
        "sector": null,
        "component": "governance",
        "source": [{
            "name": "Worldwide Governance Indicators",
            "link": "http://info.worldbank.org/governance/wgi/index.asp"
        }]
    },
    "pop": {
        "id": "pop",
        "name": "Population",
        "description": "Total population",
        "format": "number",
        "decimals": "0",
        "percent_convert": null,
        "unit": null,
        "index": null,
        "sector": null,
        "component": null
    },
    "road_floods": {
        "id": "road_floods",
        "name": "Road flooding",
        "description": "Frequency of floods divided by land area",
        "format": "number",
        "decimals": "2",
        "percent_convert": null,
        "unit": null,
        "index": "vulnerability",
        "sector": "infrastructure",
        "component": "exposure",
        "source": ["CRED & WB Stats for area"]
    },
    "road_paved": {
        "id": "road_paved",
        "name": "Paved roads",
        "description": "Percentage of paved roads",
        "format": "number",
        "decimals": "2",
        "percent_convert": "n",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "infrastructure",
        "component": "sensitivity",
        "source": [
        {
            "name": "World Development Indicators",
            "link": "http://data.worldbank.org/indicator/IS.ROD.PAVE.ZS"
        },
        {
            "name": "World Development Indicators",
            "link": "http://data.worldbank.org/indicator/SP.RUR.TOTL"
        }
        ]
    },
    "rural_popn": {
        "id": "rural_popn",
        "name": "Rural population",
        "description": "Percent of population in rural livelihoods",
        "format": "number",
        "decimals": "2",
        "percent_convert": "n",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "food",
        "component": "sensitivity",
        "source": [{
            "name": "World Development Indicators",
            "link": "http://data.worldbank.org/indicator/SP.POP.TOTL"
        }]
    },
    "rule_of_law": {
        "id": "rule_of_law",
        "name": "Rule of law",
        "description": "World governance indicator: rule of law component",
        "format": "number",
        "decimals": "2",
        "percent_convert": null,
        "unit": null,
        "index": "readiness",
        "sector": null,
        "component": "social",
        "source": [{
            "name": "Worldwide Governance Indicators",
            "link": "http://info.worldbank.org/governance/wgi/sc_country.asp"
        }]
    },
    "sanit": {
        "id": "sanit",
        "name": "Sanitary water",
        "description": "Percent population with access to improved sanitation",
        "format": "number",
        "decimals": "1",
        "percent_convert": "n",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "water",
        "component": "capacity",
        "source": [{
            "name": "World Development Indicators",
            "link": "http://data.worldbank.org/indicator/SH.STA.ACSN"
        }]
    },
    "staff": {
        "id": "staff",
        "name": "Health workers per capita",
        "description": "Number of medical workers per 1000 people",
        "format": "number",
        "decimals": "2",
        "percent_convert": null,
        "unit": null,
        "index": "vulnerability",
        "sector": "health",
        "component": "sensitivity",
        "source": [
        {
            "name": "World Development Indicators - Physicians (per 1,000 people)",
            "link": "http://data.worldbank.org/indicator/SH.MED.PHYS.ZS"
        },
        {
            "name": "World Development Indicators - Nurses and midwives (per 1,000 people)",
            "link": "http://data.worldbank.org/indicator/SH.MED.NUMW.P3"
        }
        ]
    },
    "trade": {
        "id": "trade",
        "name": "Trade freedom",
        "description": "Index of economic freedom: trade freedom subcomponent",
        "format": "number",
        "decimals": "1",
        "percent_convert": null,
        "unit": null,
        "index": "readiness",
        "sector": null,
        "component": "economic",
        "source": [{
            "name": "Index of Economic Freedom",
            "link": "http://www.heritage.org/index/explore"
        }]
    },
    "voice_accountability": {
        "id": "voice_accountability",
        "name": "Voice & accountability",
        "description": "World governance indicator: voice and accountability component",
        "format": "number",
        "decimals": "2",
        "percent_convert": null,
        "unit": null,
        "index": "readiness",
        "sector": null,
        "component": "governance",
        "source": [{
            "name": "Worldwide Governance Indicators",
            "link": "http://info.worldbank.org/governance/wgi/sc_country.asp"
        }]
    },
    "water_access": {
        "id": "water_access",
        "name": "Water access",
        "description": "Percent population with access to improved water supply",
        "format": "number",
        "decimals": "1",
        "percent_convert": "n",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "water",
        "component": "capacity",
        "source": [{
            "name": "World Development Indicators",
            "link": "http://data.worldbank.org/indicator/SH.H2O.SAFE.ZS"
        }]
    },
    "water_disease": {
        "id": "water_disease",
        "name": "Water disease",
        "description": "Deaths due to water borne diseases in under 5 year-olds",
        "format": "number",
        "decimals": "0",
        "percent_convert": null,
        "unit": null,
        "index": "vulnerability",
        "sector": "water",
        "component": "sensitivity",
        "source": ["WHO"]
    },
    "water_use": {
        "id": "water_use",
        "name": "Water use",
        "description": "Percent of total internal and external water withdrawn for all uses ",
        "format": "number",
        "decimals": "2",
        "percent_convert": "n",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "water",
        "component": "sensitivity",
        "source": [{
            "name": "www.fao.org",
            "link": "http://www.fao.org/nr/water/aquastat/data/query/index.html?lang=en"
        }]
    },
    "yield_cv": {
        "id": "yield_cv",
        "name": "Variation of cereal yield",
        "description": "Coefficient of variation of annual cereal yield ",
        "format": "number",
        "decimals": "2",
        "percent_convert": null,
        "unit": null,
        "index": "vulnerability",
        "sector": "food",
        "component": "exposure",
        "source": [{
            "name": "World Development Indicators",
            "link": "http://data.worldbank.org/indicator/AG.YLD.CREL.KG"
        }]
    },
    "yld_proj": {
        "id": "yld_proj",
        "name": "Yield change",
        "description": "Projected impact of climate change on agricultural yields",
        "format": "number",
        "decimals": "2",
        "percent_convert": "n",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "food",
        "component": "exposure",
        "source": [{
            "name": "www.cgdev.org",
            "link": "http://www.cgdev.org/content/publications/detail/1424986"
        }]
    },
    "governance": {
        "id": "governance",
        "name": "Governance",
        "description": "Component measuring national stability, governmental responsiveness and corruption ",
        "format": "number",
        "decimals": "3",
        "percent_convert": null,
        "unit": null,
        "index": "readiness",
        "sector": null,
        "component": "governance"
    },
    "economic": {
        "id": "economic",
        "name": "Economic readiness",
        "description": "Component measuring economic stability, growth and governmental regulation",
        "format": "number",
        "decimals": "3",
        "percent_convert": null,
        "unit": null,
        "index": "readiness",
        "sector": null,
        "component": "economic"
    },
    "social": {
        "id": "social",
        "name": "Social readiness",
        "description": "Component measuring the society's awareness and understanding of climate risks and their belief that changes will increase adaptation capacity",
        "format": "number",
        "decimals": "3",
        "percent_convert": null,
        "unit": null,
        "index": "readiness",
        "sector": null,
        "component": "social"
    },
    "exposure": {
        "id": "exposure",
        "name": "Exposure",
        "description": "Component analyzing the probability of climate related hazards",
        "format": "number",
        "decimals": "3",
        "percent_convert": null,
        "unit": null,
        "index": "vulnerability",
        "sector": null,
        "component": "exposure"
    },
    "sensitivity": {
        "id": "sensitivity",
        "name": "Sensitivity",
        "description": "Component measuring the potential severity of the impacts of climate-related threats",
        "format": "number",
        "decimals": "3",
        "percent_convert": null,
        "unit": null,
        "index": "vulnerability",
        "sector": null,
        "component": "sensitivity"
    },
    "capacity": {
        "id": "capacity",
        "name": "Capacity",
        "description": "Component measuring the availability of economic, social and institutional resources to cope with and adapt to the impacts of climate change",
        "format": "number",
        "decimals": "3",
        "percent_convert": null,
        "unit": null,
        "index": "vulnerability",
        "sector": null,
        "component": "capacity"
    },
    "water": {
        "id": "water",
        "name": "Water",
        "description": "Sector measuring a nation's current and future ability to provide clean water",
        "format": "number",
        "decimals": "3",
        "percent_convert": null,
        "unit": null,
        "index": "vulnerability",
        "sector": "water",
        "component": null
    },
    "food": {
        "id": "food",
        "name": "Food",
        "description": "Sector measuring the nation's food production, nutrition and rural population",
        "format": "number",
        "decimals": "3",
        "percent_convert": null,
        "unit": null,
        "index": "vulnerability",
        "sector": "food",
        "component": null
    },
    "health": {
        "id": "health",
        "name": "Health",
        "description": "Sector measuring a nation's ability to provide health services against several mortality statistics",
        "format": "number",
        "decimals": "3",
        "percent_convert": null,
        "unit": null,
        "index": "vulnerability",
        "sector": "health",
        "component": null
    },
    "infrastructure": {
        "id": "infrastructure",
        "name": "Infrastructure",
        "description": "Sector analyzing three direct factors impacting human well-being in the face of climate change: coasts, energy and transportation",
        "format": "number",
        "decimals": "3",
        "percent_convert": null,
        "unit": null,
        "index": "vulnerability",
        "sector": "infrastructure",
        "component": null
    },
    "vulnerability": {
        "id": "vulnerability",
        "name": "Vulnerability",
        "description": "Vulnerability meausres a country's exposure, sensitivity and ability to cope with climate related hazards, as well as accounting for the overall status of food, water, health and infrastructure within the nation",
        "format": "number",
        "decimals": "3",
        "percent_convert": null,
        "unit": null,
        "index": "vulnerability",
        "sector": null,
        "component": null
    },
    "readiness": {
        "id": "readiness",
        "name": "Readiness",
        "description": "Readiness measures the ability of a country's private and public sectors to leverage resources effectively towards increasing resiliency to climate change",
        "format": "number",
        "decimals": "3",
        "percent_convert": null,
        "unit": null,
        "index": "readiness",
        "sector": null,
        "component": null
    },
    "gain": {
        "id": "gain",
        "name": "GaIn™",
        "description": "The Global Adaptation Index™ (GaIn™) exposes countries' vulnerabilities to climate change and opportunities to improve resilience. It aims to help businesses and the public sector to better prioritize investments for a more efficient response to the immediate global challenges ahead.",
        "format": "number",
        "decimals": "1",
        "percent_convert": null,
        "unit": null,
        "index": "gain",
        "sector": null,
        "component": null
    }
};

// Color utilities
// ---------------
// Could be broken out into its own module if we need to use it elsewhere, too.

// Generate an RGB (= flat) gradient between given colors
// ------------------------------------------------------
// colors - an array of colors to run the gradient through.
// max - the maximum range
// pos - the position between 0 and max to generate a gradient color for
function gradientRgb(colors, max, pos) {
    return _gradient(_gradientRgb, colors, max, pos);
}

// Generate an HSL (= colorful) gradient between given colors
// ----------------------------------------------------------
// colors - an array of colors to run the gradient through.
// max - the maximum range
// pos - the position between 0 and max to generate a gradient color for
function gradientHsl(colors, max, pos) {
    return _gradient(_gradientHsl, colors, max, pos);
}

function _gradient(func, colors, max, pos) {
    var sub = max / (colors.length - 1);
    var i = Math.floor(pos / sub);
    i = i < colors.length - 1 ? i : colors.length - 2;
    return func(colors[i], colors[i + 1], sub, pos - sub * i);
}

function _gradientComponent(a, b, max, pos) {
    return a + pos * (b - a) / max;
};

function _gradientHsl(from, to, max, pos) {
    from = hexToHsl(from);
    to = hexToHsl(to);
    var result = {};
    _.each(Object.keys(from), function(k) {
        result[k] = _gradientComponent(from[k], to[k], max, pos);
    });
    return hslToHex(result);
}

function _gradientRgb(from, to, max, pos) {
    from = hexToRgb(from);
    to = hexToRgb(to);
    var result = {};
    _.each(Object.keys(from), function(k) {
        result[k] = _gradientComponent(from[k], to[k], max, pos);
    });
    return rgbToHex(result);
}

// http://is.gd/CKCkga
function hslToRgb(hsl) {
    var h = hsl.h,
        s = hsl.s,
        l = hsl.l,
        r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return {r: r * 255, g: g * 255, b: b * 255};
}

// http://is.gd/CKCkga
function rgbToHsl(rgb){
    var r = rgb.r / 255,
        g = rgb.g / 255,
        b = rgb.b / 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return {h: h, s: s, l: l};
}

// http://www.javascripter.net/faq/hextorgb.htm
function hexToRgb(h) {
    var cutHex = function(h) {
        return (h.charAt(0)=="#") ? h.substring(1,7):h
    };
    return {
        r: parseInt((cutHex(h)).substring(0,2),16),
        g: parseInt((cutHex(h)).substring(2,4),16),
        b: parseInt((cutHex(h)).substring(4,6),16)
    };
}

// http://www.javascripter.net/faq/rgbtohex.htm
function rgbToHex(rgb) {
    var toHex = function(n) {
        n = parseInt(n,10);
        if (isNaN(n)) return "00";
        n = Math.max(0,Math.min(n,255));
        return "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);
    }
    return toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
}

function hexToHsl(hex) {
    return rgbToHsl(hexToRgb(hex));
}

function hslToHex(hsl) {
    return rgbToHex(hslToRgb(hsl));
}
