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
    trend: function(type) {
        type = type || 'gain';
        if (this.get('name') == 'trend') {
            var trend = this.get(type);
            if (trend) {
                var sign = trend.sign;
                switch (sign) {
                    case -1: return 'down';
                    case 0: return 'same';
                    case 1: return 'up';
                    default: return 'undefined';
                }
            }
        }
    },
    input: function(options) {
        options = this.optionDefaults(options);
        var value = this.get('input')[options.year];
        if (!options.format) {
            return value;
        }
        return this.format(value);
    },
    rank: function(options) {
        options = this.optionDefaults(options);
        var value = this.get('rank') ? this.get('rank')[options.year] : undefined;
        if (!options.format) {
            return value;
        }
        if (_.isUndefined(value)) {
            return "<div class='rank-number undefined'>&nbsp;</div>";
        }

        var totalRanks = value.asc + value.desc;

        // red - ff7c80
        // blue - 68b5df
        // yellow - f6cd47
        // green - 68bb37

        // Log the vulnerability and readiness value 

        if (this.meta('index') == 'vulnerability' || this.get('name') == 'vulnerability_delta') {
            var color = gradientRgb(['#7cbee3', '#a99cb5', '#fd9496'], totalRanks, value.asc);
            var rank = value.asc;
        } else {
            var color = gradientRgb(['#7cbee3', '#a99cb5', '#fd9496'], totalRanks, value.desc);
            var rank = value.desc;
        }

        return "<div class='rank-number' style='background-color: #" + color + ";'>" + rank + '</div>';
    },
    meta: function(key) {
        // TODO: Why do some indicators not have an id? Should we always use 'name'?
        return model.meta[this.id || this.get('name')][key] || '';
    },
    format: function(value, format) {
        // TODO: Why do some indicators not have an id? Should we always use 'name'?
        format = format || (this.id || this.get('name'));
        return model.format(value, format);
    },
    // Determines whether this indicator has a GDP corrected version
    // -------------------------------------------------------------
    hasCorrection: function() {
        return !_.isUndefined(model.meta[(this.id || this.get('name')) + '_delta']);
    },
    // Determines whether this indicator is adjusted for GDP
    // ------------------------------------------------------
    isCorrection: function() {
        return (this.id || this.get('name')).slice(-6) == '_delta';
    },
    // Retrieves the corrected/uncorrected name for this indicator
    // -----------------------------------------------------------
    // Only for indicators where isCorrection() || hasCorrection() == true
    toggleCorrection: function() {
        if (this.isCorrection()) {
            return (this.id || this.get('name')).slice(0, -6);
        } else {
            return (this.id || this.get('name')) + '_delta';
        }
    },
    // Retrieves the uncorrected version for this indicator
    // ----------------------------------------------------
    // Only for indicators where isCorrection() || hasCorrection() == true
    uncorrected: function() {
        if (this.hasCorrection()) return (this.id || this.get('name'));
        return this.toggleCorrection();
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
    // Number with or without decimals, signed or unsigned
    // ---------------------------------------------------
    // From StackOverflow http://is.gd/sR4ygY
    number: function(n, meta) {
        var c = isNaN(meta.decimals) ? 0 : Math.abs(meta.decimals),
            d = '.',
            t = ',',
            sign = (n < 0) ? '-' : '',
            i = parseInt(n = Math.abs(n).toFixed(c), 10) + '',
            j = ((j = i.length) > 3) ? j % 3 : 0;

        var val = (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');

        return (parseFloat(val) == 0 ? 0 : sign + val);
    },
    // A real number between -1 and 1, will be converted to a percentage
    // -----------------------------------------------------------------
    percent: function(n, meta) {
        if (_.isNumber(n)) {
            return this.number(n * 100.0, meta);
        }
        return '-';
    }
};

model.meta = {
    // resources/gain
    // --------------------------------
    "gain_delta": {
        "id": "gain_delta",
        "name": "GAIN Index, adjusted for GDP",
        "description": "GDP adjusted GAIN Index scores represent how much better or worse the actual GAIN Index score is from its expected value, based on its GDP. A positive value means a country has a better GAIN Index score than other countries of a similar GDP. A negative value means a country has a worse score.",
        "map_caption": "Countries of the world by GAIN Index, adjusted for GDP. Higher scores are better.",
        "ranking_caption": "World wide ranking by GAIN Index, adjusted for GDP. Higher scores are better.",
        "format": "number",
        "decimals": "2",
        "unit": null,
        "index": "gain",
        "sector": null,
        "component": null
    },
    "gain": {
        "id": "gain",
        "name": "GAIN Index",
        "description": "The GAIN Index captures a country's Vulnerability to climate change and other global challenges, and its Readiness to improve resilience.",
        "map_caption": "Countries of the world by GAIN Index, higher scores are better.",
        "ranking_caption": "World wide ranking by GAIN Index, higher scores are better.",
        "format": "number",
        "decimals": "1",
        "unit": null,
        "index": "gain",
        "sector": null,
        "component": null
    },
    // resources/indicators
    // --------------------------------
    "business": {
        "id": "business",
        "name": "Business freedom",
        "description": "Individual’s right to create, operate, and close an enterprise without interference from the state.",
        "format": "number",
        "decimals": "0",
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
        "description": "Percent of land less than 10 meters above sea-level.",
        "format": "number",
        "decimals": "2",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "infrastructure",
        "component": "exposure",
        "source": [{
            "name": "CIESIN",
            "link": "http://sedac.ciesin.columbia.edu/gpw/lecz.jsp "
        }]
    },
    "coast_popn": {
        "id": "coast_popn",
        "name": "Coastal population",
        "description": "Percent of population living less than 10 meters above sea-level.",
        "format": "percent",
        "decimals": "2",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "infrastructure",
        "component": "sensitivity",
        "source": [{
           "name": "CIESIN",
           "link": "http://sedac.ciesin.columbia.edu/gpw/lecz.jsp "
        }]
    },
    "corruption": {
        "id": "corruption",
        "name": "Control of corruption",
        "description": "Perceptions of public power exercised for private gain, including both petty and grand forms of corruption, as well as 'capture' of the state by elites and private interests.",
        "format": "number",
        "decimals": "2",
        "unit": null,
        "index": "readiness",
        "sector": null,
        "component": "governance",
        "source": [{
            "name": "Worldwide Governance Indicators",
            "link": "http://info.worldbank.org/governance/wgi/sc_country.asp"
        }]
    },
    "d-ppt": {
        "id": "d-ppt",
        "name": "Precipitation change",
        "description": "Projected change in precipitation by late 21st century, i.e. 2070-99 compared to  1961-90.",
        "format": "percent",
        "decimals": "1",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "water",
        "component": "exposure",
        "source": [{
            "name": "Climatic Research Unit, University of East Anglia. Dataset TYN CY 3.0",
            "link": "http://www.cru.uea.ac.uk/cru/data/hrg/"
        }]
    },
    "d-temp": {
        "id": "d-Temp",
        "name": "Temperature change",
        "description": "Projected change in temperature by late 21st century, i.e. 2070-99 compared to  1961-90.",
        "format": "number",
        "decimals": "1",
        "unit": "%s °C",
        "index": "vulnerability",
        "sector": "water",
        "component": "exposure",
        "source": [{
            "name": "Climatic Research Unit, University of East Anglia. Dataset TYN CY 3.0",
            "link": "http://www.cru.uea.ac.uk/cru/data/hrg/"
        }]
    },
    "daly": {
        "id": "daly",
        "name": "Disability adjusted life years",
        "description": "Projected percent increase in DALY due to climate change in the late 21st century.",
        "format": "percent",
        "decimals": "2",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "health",
        "component": "exposure",
        "source": [{
            "name": "Adaptation costs for climate change-related cases of diarrhoeal disease, malnutrition, and malaria in 2030, by Kristie L Ebi",
            "link": "http://www.globalizationandhealth.com/content/4/1/9"
        }]
    },
    "dependency_natural": {
       "id": "dependency_natural",
       "name": "Dependency on natural capital",
       "description": "Use of natural capital in national accounting. Specifically natural capital related to ecosystem services: crop, pasture, forest (timber), forest (non-timber) and protected areas. Sub-surface capital such as oil, gas and mineral reserves are not included in this measure for GAIN.",
       "format": "number",
       "decimals": "2",
       "unit": "%s %",
       "index": "vulnerability",
       "sector": "ecosystems",
       "component": "exposure",
       "source": [{
           "name": "The Changing Wealth of Nations : Measuring Sustainable Development in the New Millennium. World Bank 2011",
           "link": "http://data.worldbank.org/sites/default/files/total_and_per_capita_wealth_of_nations.xls"
       }]
    },
    "ecological_footprint": {
       "id": "ecological_footprint",
       "name": "Ecological footprint",
       "description": "Measures the number of hectares of land and water, both within and outside the country, to supply the average demand on the ecosystems services by the lifestyles of the population of each country. This is compared with the estimated capacity of a country’s ecosystems to regenerate and maintain ecosystem services for either internal use or export. This measure uses the surplus or deficit of capacity to supply over the demand within each country.",
       "format": "number",
       "decimals": "2",
       "unit": "null",
       "index": "vulnerability",
       "sector": "ecosystems",
       "component": "sensitivity",
       "source": [{
           "name": "National Footprint Accounts 2011 edition",
           "link": "http://www.footprintnetwork.org"
       }]
    },
    "electrical_outages": {
       "id": "electrical_outages",
       "name": "Value lost due to electrical outages",
       "description": "Percentage of sale lost due to electrical outages (% of sales).",
       "format": "number",
       "decimals": "2",
       "unit": "%s %",
       "index": "vulnerability",
       "sector": "habitat",
       "component": "capacity",
       "source": [{
           "name": "World Development Indicators - Value lost due to electrical outages",
           "link": "http://data.worldbank.org/indicator/IC.FRM.OUTG.ZS"
       }]
    },
    "energy_access": {
        "id": "energy_access",
        "name": "Energy access",
        "description": "Percent population with access to electricity.",
        "format": "number",
        "decimals": "1",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "infrastructure",
        "component": "exposure",
        "source": [{
            "name": "WHO & UNPD",
            "link": "http://content.undp.org/go/cms-service/stream/asset/?asset_id=2205620 "
        }]
    },
    "energy_sensit": {
        "id": "energy_sensit",
        "name": "Energy sensitivity",
        "description": "Percent of energy derived from hydroelectricity and imported power.",
        "format": "percent",
        "decimals": "1",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "infrastructure",
        "component": "sensitivity",
        "source": [
        {
            "name": "World Development Indicators - Energy Imports",
            "link": "http://data.worldbank.org/indicator/EG.IMP.CONS.ZS"
        },
        {
            "name": "World Development Indicators - Hydroelectric Power",
            "link": "http://data.worldbank.org/indicator/EG.ELC.HYRO.ZS"
        }
        ]
    },
    "enrollment": {
        "id": "enrollment",
        "name": "Tertiary education",
        "description": "The ratio of total enrollment, regardless of age, to the population in age range for tertiary education.",
        "format": "number",
        "decimals": "2",
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
        "name": "External health dependence",
        "description": "Percent of total expendature devoted to health funds or services in kind that are provided by entities external to the country.",
        "format": "number",
        "decimals": "1",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "health",
        "component": "sensitivity",
        "source": [{
            "name": "World Development Indicators",
            "link": "http://data.worldbank.org/indicator/SH.XPD.EXTR.ZS"
        }]
    },
	"exx": {
	       "id": "biome_threat",
	       "name": "Projected Biome Threat",
	       "description": "The proportion of the land of a country on which the existing biome is no longer matched to the projected climate of the late 21st century.",
	       "format": "number",
	       "decimals": "2",
	       "unit": "null",
	       "index": "vulnerability",
	       "sector": "ecosystems",
	       "component": "exposure",
	       "source": [{
	           "name": "Gonzalez, et al. (2010), Global patterns in the vulnerability of ecosystems to vegetation shifts due to climate change. Global Ecology and Biogeography, 19: 755–768. doi: 10.1111/j.1466-8238.2010.00558.x Annex S3",
	           "link": "http://pgonzalez.home.igc.org/Gonzalez_et_al_2010_GEB_SI.pdf",
	           "name": "J. Hansen, et al., Global warming in the twenty-first century: An alternative scenario. Proc. Natl. Acad. Sci. 97, 9875-9880, doi:10.1073/pnas.170278997 (2000).",
	           "link": "http://pubs.giss.nasa.gov/docs/2000/2000_Hansen_etal_2.pdf"
	       }]
    },
    "finan": {
        "id": "finan",
        "name": "Financial freedom",
        "description": "Banking efficiency, independence from government control and interference in the financial sector.",
        "format": "number",
        "decimals": "0",
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
        "description": "Tax burden imposed by government.",
        "format": "number",
        "decimals": "1",
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
        "description": "Measure of agricultural technological capacity as the average of the 2 best scores from the use of fertilizers, the level of mechanization and the use of irrigation in agriculture.",
        "format": "number",
        "decimals": "2",
        "unit": null,
        "index": "vulnerability",
        "sector": "food",
        "component": "capacity",
        "source": [
        {
            "name": "World Development Indicators - Fertilizer Consumption (kilograms per hectare of arable land)",
            "link": "http://data.worldbank.org/indicator/AG.CON.FERT.ZS"
        },
        {
            "name": "World Development Indicators - Agricultural Machinery (tractors per 100 sq. km of arable land)",
            "link": "http://data.worldbank.org/indicator/AG.LND.TRAC.ZS"
        },
        {
            "name": "World Development Indicators - Agricultural Irrigated Land (percent of total agricultural land)",
            "link": "http://data.worldbank.org/indicator/AG.LND.IRIG.AG.ZS"
        }
        ]
    },
    "gdp": {
        "id": "gdp",
        "name": "GDP (PPP) per capita",
        "description": "Gross domestic product per capita based on purchasing power parity, in units of constant 2005 international dollar.",
        "format": "number",
        "decimals": "2",
        "unit": "%s USD",
        "index": null,
        "sector": null,
        "component": null
    },
    "gov_spend": {
        "id": "gov_spend",
        "name": "Government spending",
        "description": "Level of government expenditures as a percentage of GDP.",
        "format": "number",
        "decimals": "1",
        "unit": null,
        "index": "readiness",
        "sector": null,
        "component": "economic",
        "source": [{
            "name": "Index of Economic Freedom",
            "link": "http://www.heritage.org/index/explore"
        }]
    },
    "health_disease": {
        "id": "health_disease",
        "name": "Disease mortality",
        "description": "Percentage mortality due to infectious diseases.",
        "format": "percent",
        "decimals": "1",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "health",
        "component": "exposure",
        "source": [{
            "name": "World Health Organization",
            "link": "http://apps.who.int/ghodata/?vid=99001#"
        }]
    },
    "imports": {
        "id": "imports",
        "name": "Food import dependency",
        "description": "Proportion of cereal consumption obtained from entities not part of the country in question.",
        "format": "percent",
        "decimals": "0",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "food",
        "component": "sensitivity",
        "source": [{
            "name": "FAO",
            "link": "http://FAOStat.fao.org"
        }]
    },
    "international_treaties": {
       "id": "international_treaties",
       "name": "Engagement in International Environmental Conventions",
       "description": "The country’s participation in international forums, which is taken as an indicator its capacity to engage in multilateral negotiations and to reach agreement on appropriate actions internally.",
       "format": "number",
       "decimals": "null",
       "unit": "null",
       "index": "vulnerability",
       "sector": "ecosystems",
       "component": "capacity",
       "source": [{
           "name": "Environmental Treaties and Resource Indicators",
           "link": "http://sedac.ciesin.columbia.edu/entri/index.jsp"
       }]
    },
    "invest": {
        "id": "invest",
        "name": "Investment freedom",
        "description": "Constraints on the flow of investment capital. Includes rules for foreign and domestic investment; restrictions on payments, transfers, and capital transactions; labor regulations, corruption, red tape, weak infrastructure, and political and security conditions.",
        "format": "number",
        "decimals": "0",
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
        "description": "Legal and regulatory framework of a country’s labor market.",
        "format": "number",
        "decimals": "1",
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
        "description": "The number of years a newborn infant would live if prevailing patterns of mortality at the time of its birth were to stay the same throughout its life.",
        "format": "number",
        "decimals": "1",
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
        "description": "Percent of under 5 year-olds with low weight for their height.",
        "format": "number",
        "decimals": "1",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "food",
        "component": "capacity",
        "source": [{
            "name": "World Development Indicators",
            "link": "http://data.worldbank.org/indicator/SH.STA.WAST.ZS"
        }]
    },
    "matern": {
        "id": "matern",
        "name": "Maternal mortality",
        "description": "Life time risk of maternal death is the probability that a 15-year-old female will die eventually from a maternal cause assuming that current levels of fertility and mortality (including maternal mortality) do not change in the future, taking into account competing causes of death.",
        "format": "number",
        "decimals": "0",
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
        "description": "Mobile telephone subscriptions per 100 people to a public mobile telephone service using cellular technology, which provide access to the public switched telephone network (post-paid and prepaid subscriptions are included).",
        "format": "number",
        "decimals": "2",
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
        "description": "Price stability with an assessment of price controls.",
        "format": "number",
        "decimals": "1",
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
        "description": "Perceptions of the likelihood that the government will be destabilized or overthrown by unconstitutional or violent means, including domestic violence and terrorism.",
        "format": "number",
        "decimals": "2",
        "unit": null,
        "index": "readiness",
        "sector": null,
        "component": "governance",
        "source": [{
            "name": "Worldwide Governance Indicators",
            "link": "http://info.worldbank.org/governance/wgi/index.asp"
        }]
    },
    "nurses_mw": {
        "id": "nurses_mw",
        "name": "Nurses",
        "description": "Nurses Description",
        "format": "number",
        "decimals": "0",
        "unit": null,
        "index": "vulnerability",
        "sector": "health",
        "component": "capacity"
    },
    "physicians": {
        "id": "physicians",
        "name": "Physicians",
        "description": "Number of physicians",
        "format": "number",
        "decimals": "0",
        "unit": null,
        "index": "vulnerability",
        "sector": "health",
        "component": "capacity"
    },
    "pop": {
        "id": "pop",
        "name": "Population",
        "description": "Total population.",
        "format": "number",
        "decimals": "0",
        "unit": null,
        "index": null,
        "sector": null,
        "component": null
    },
    "protected_biomes": {
       "id": "protected_biomes",
       "name": "Protected biomes",
       "description": "The weighted percentage of biomes under protected status, where the weight is determined by the size of biomes within a country. Countries are not rewarded for protecting beyond 17% of any given biome (i.e., scores are capped at 17% per biome) so that higher levels of protection of some biomes cannot be used to offset lower levels of protection of other biomes.",
       "format": "number",
       "decimals": "2",
       "unit": "null",
       "index": "vulnerability",
       "sector": "ecosystems",
       "component": "capacity",
       "source": [{
           "name": "Emerson, J.W. et al. 2012: 2012 Environmental Performance Index and Pilot Trend Environmental Performance Index.",
           "link": "http://epi.yale.edu/downloads"
       }]
    },
    "road_floods": {
        "id": "road_floods",
        "name": "Road flooding",
        "description": "Frequency of floods calculated as flood disasters per decade per 100,000 km2 of land area.",
        "format": "number",
        "decimals": "2",
        "unit": null,
        "index": "vulnerability",
        "sector": "infrastructure",
        "component": "exposure",
        "source": [
        {
            "name": "World Development Indicators - Land area (sq. km)",
            "link": "http://data.worldbank.org/indicator/AG.LND.TOTL.K2"
        },
        {
            "name": "EM-DAT: The OFDA/CRED International Disaster Database - Floods.",
            "link": "http://www.emdat.be/"
        }
        ]
    },
    "road_paved": {
        "id": "road_paved",
        "name": "Paved roads",
        "description": "Roads surfaced with crushed stone (macadam) and hydrocarbon binder or bituminized agents, with concrete, or with cobblestones, as a percentage of all the country's roads, measured in length.",
        "format": "number",
        "decimals": "2",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "infrastructure",
        "component": "sensitivity",
        "source": [
        {
            "name": "World Development Indicators",
            "link": "http://data.worldbank.org/indicator/IS.ROD.PAVE.ZS"
        }]
    },
    "rule_of_law": {
        "id": "rule_of_law",
        "name": "Rule of law",
        "description": "Confidence in and abide by the rules of society, and in particular the quality of contract enforcement, property rights, the police, and the courts, as well as the likelihood of crime and violence.",
        "format": "number",
        "decimals": "2",
        "unit": null,
        "index": "readiness",
        "sector": null,
        "component": "social",
        "source": [{
            "name": "Worldwide Governance Indicators",
            "link": "http://info.worldbank.org/governance/wgi/sc_country.asp"
        }]
    },
    "rural_popn": {
        "id": "rural_popn",
        "name": "Rural population",
        "description": "Total rural population as a percent of the total population.",
        "format": "number",
        "decimals": "1",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "food",
        "component": "sensitivity",
        "source": [{
            "name": "World Development Indicators - Rural Population",
            "link": "http://data.worldbank.org/indicator/SP.RUR.TOTL"
        },
        {
            "name": "World Development Indicators - Total Population",
            "link": "http://data.worldbank.org/indicator/SP.POP.TOTL"
        }
        ]
    },
    "sanit": {
        "id": "sanit",
        "name": "Improved sanitation facilities",
        "description": "The percentage of the population with at least adequate access to excreta disposal facilities that can effectively prevent human, animal, and insect contact with excreta.",
        "format": "number",
        "decimals": "1",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "water",
        "component": "capacity",
        "source": [{
            "name": "World Development Indicators",
            "link": "http://data.worldbank.org/indicator/SH.STA.ACSN"
        }]
    },
   "slums": {
       "id": "slums",
       "name": "Slums",
       "description": "Urban Population Living in Slums.",
       "format": "number",
       "decimals": "2",
       "unit": "%s %",
       "index": "vulnerability",
       "sector": "habitat",
       "component": "sensitivity",
       "source": [{
           "name": "United Nations Indicators - Millenium Development Goals",
           "link": "http://mdgs.un.org/unsd/mdg/SeriesDetail.aspx?srid=710"
       }]
   },
    "staff": {
        "id": "staff",
        "name": "Health workers per capita",
        "description": "Number of medical workers per 1000 people, based on (2 x Physicians) + (Nurses and Midwives).",
        "format": "number",
        "decimals": "2",
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
    "threatened_species": {
       "id": "threatened_species",
       "name": "Threatened species",
       "description": "Composite measure made up of (1) the percentage of mammal species recorded as threatened; (2) the percentage of plant species threatened; and (3) the number of bird species threatened.",
       "format": "number",
       "decimals": "2",
       "unit": "%s %",
       "index": "vulnerability",
       "sector": "habitat",
       "component": "sensitivity",
       "source": [{
           "name": "IUCN Red Book",
           "link": "http://www.iucnredlist.org/"
       }]
    },
    "trade": {
        "id": "trade",
        "name": "Trade freedom",
        "description": "Absence of tariff and non-tariff barriers that affect imports and exports of goods and services.",
        "format": "number",
        "decimals": "1",
        "unit": null,
        "index": "readiness",
        "sector": null,
        "component": "economic",
        "source": [{
            "name": "Index of Economic Freedom",
            "link": "http://www.heritage.org/index/explore"
        }]
    },
    "trade_transport": {
       "id": "trade_transport",
       "name": "Quality of trade and transport-related infrastructure",
       "description": "Logistics professionals' perception of country's quality of trade and transport related infrastructure (e.g. ports, railroads, roads, information technology), on a rating ranging from 1 (very low) to 5 (very high). Scores are averaged across all respondents.",
       "format": "number",
       "decimals": "null",
       "unit": "null",
       "index": "vulnerability",
       "sector": "habitat",
       "component": "capacity",
       "source": [{
           "name": "World Development Indicators -  Logistics Performance Index",
           "link": "http://data.worldbank.org/indicator/LP.LPI.INFR.XQ"
       }]
    },
    "urban_concentration": {
       "id": "urban_concentration",
       "name": "Urban concentration",
       "description": "Percentage of the country population living in the largest city.",
       "format": "number",
       "decimals": "2",
       "unit": "%s %",
       "index": "vulnerability",
       "sector": "habitat",
       "component": "exposure",
       "source": [{
           "name": "World Development Indicators - Population in largest city",
           "link": "http://data.worldbank.org/indicator/EN.URB.LCTY.UR.ZS"
       }]
    },
    "urban_excess_growth": {
       "id": "urban_excess_growth",
       "name": "Urban excess growth",
       "description": "Excess rate of population growth in urban centres compared with the population growth rate in the whole country (annual %).",
       "format": "number",
       "decimals": "2",
       "unit": "%s %",
       "index": "vulnerability",
       "sector": "habitat",
       "component": "sensitivity",
       "source": [{
           "name": "World Development Indicators - Urban population growth",
           "link": "http://data.worldbank.org/indicator/SP.URB.GROW",
           "name": "World Development Indicators - Urban population",
           "link": "http://data.worldbank.org/indicator/SP.URB.TOTL",
           "name": "World Development Indicators - Population growth",
           "link": "http://data.worldbank.org/indicator/SP.POP.GROW"
       }]
    },
    "urban_risk": {
       "id": "urban_risk",
       "name": "Urban risk",
       "description": "A natural disaster risk index for populations living in large cities (i.e. >0.75M people).",
       "format": "number",
       "decimals": "2",
       "unit": "null",
       "index": "vulnerability",
       "sector": "habitat",
       "component": "exposure",
       "source": [{
           "name": "UN Dept Economic & Social Affairs;",
           "link": "http://esa.un.org/unup/CD-ROM/Urban-Agglomerations.htm"
       }]
    },
    "voice_accountability": {
        "id": "voice_accountability",
        "name": "Voice & accountability",
        "description": "Participation in selecting the government, as well as freedom of expression, freedom of association, and a free media.",
        "format": "number",
        "decimals": "2",
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
        "description": "The percentage of the population with reasonable access to an adequate amount of water from an improved source, such as a household connection, public standpipe, borehole, protected well or spring, and rainwater collection.",
        "format": "number",
        "decimals": "1",
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
        "description": "Water, sanitation & hygiene related deaths per 100,000  children under 5 years old.",
        "format": "number",
        "decimals": "0",
        "unit": null,
        "index": "vulnerability",
        "sector": "water",
        "component": "sensitivity",
        "source": [{
            "name": "WHO",
            "link": "http://apps.who.int/ghodata/?vid=99001#"
        }]
    },
    "water_use": {
        "id": "water_use",
        "name": "Water use",
        "description": "Percent of total internal and external water withdrawn for all uses.",
        "format": "number",
        "decimals": "1",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "water",
        "component": "sensitivity",
        "source": [{
            "name": "UN Food and Agriculture Organization",
            "link": "http://www.fao.org/nr/water/aquastat/data/query/index.html?lang=en"
        }]
    },
    "yield_cv": {
        "id": "yield_cv",
        "name": "Variation of cereal yield",
        "description": "Coefficient of variation  (Stdev / mean) of cereal yield per hectare of harvested land, including wheat, rice, maize, barley, oats, rye, millet, sorghum, buckwheat, and mixed grains.",
        "format": "number",
        "decimals": "2",
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
        "description": "Projected percentage impact of climate change on agricultural yields.",
        "format": "number",
        "decimals": "2",
        "unit": "%s %",
        "index": "vulnerability",
        "sector": "food",
        "component": "exposure",
        "source": [{
            "name": "Center for Global Development",
            "link": "http://www.cgdev.org/content/publications/detail/1424986"
        }]
    },
    // resources/readiness
    // --------------------------------
    "economic": {
        "id": "economic",
        "name": "Economic",
        "description": "Corresponds to 40% of Readiness and equally weights 7 measures related to goverment regulations, taxes and business enabling environment.",
        "format": "number",
        "decimals": "2",
        "unit": null,
        "index": "readiness",
        "sector": null,
        "component": null
    },
    "governance": {
        "id": "governance",
        "name": "Governance",
        "description": "Corresponds to 30% of Readiness, equally weighting 'Voice and Accountability', government 'Stability' and 'Control of corruption'.",
        "format": "number",
        "decimals": "2",
        "unit": null,
        "index": "readiness",
        "sector": null,
        "component": null
    },
    "readiness_delta": {
        "id": "readiness_delta",
        "name": "Readiness, adjusted for GDP",
        "description": "GDP adjusted Readiness scores represent how far the actual Readiness score is from its expected value based on its GDP. A positive value means a country has a higher Readiness score than other countries of a similar GDP. A negative value means a country has a worse score.",
        "map_caption": "Countries of the world by Readiness, adjusted for GDP. Higher scores are better.",
        "ranking_caption": "World wide ranking by Readiness, adjusted for GDP. Higher scores are better.",
        "format": "number",
        "decimals": "2",
        "unit": null,
        "index": "readiness_delta",
        "sector": null,
        "component": null
    },
    "readiness": {
        "id": "readiness",
        "name": "Readiness",
        "description": "A country's GAIN Index score is composed of a Vulnerability score and a Readiness score. Readiness targets those portions of the economy, governance and society that affect the speed and efficiency of absorption and implementation of Adaptation projects.",
        "map_caption": "Countries of the world by Readiness, higher scores are better.",
        "ranking_caption": "World wide ranking by Readiness, higher scores are better.",
        "format": "number",
        "decimals": "2",
        "unit": null,
        "index": "readiness",
        "sector": null,
        "component": null
    },
    "social": {
        "id": "social",
        "name": "Social readiness",
        "description": "Corresponds to 30% of Readiness. It measures human capital, access to information, communications and working environment.",
        "format": "number",
        "decimals": "2",
        "unit": null,
        "index": "readiness",
        "sector": null,
        "component": null
    },
    // resources/vulnerability
    // --------------------------------
    "capacity": {
        "id": "capacity",
        "name": "Capacity",
        "description": "The availability of economic, social, and institutional resources to cope with and adapt to the impacts of climate change in specific sectors. Though related, this differs from readiness indicators in that it seeks to measure the current ability to increase resilience (or reduce vulnerability) in specific sectors, whereas Readiness measures a country’s ability to facilitate further increases in resilience.",
        "format": "number",
        "decimals": "2",
        "unit": null,
        "index": "vulnerability",
        "sector": null,
        "component": null
    },
    "ecosystems": {
        "id": "ecosystems",
        "name": "Ecosystems",
        "description": "",
        "format": "number",
        "decimals": "2",
        "unit": null,
        "index": "vulnerability",
        "sector": null,
        "component": null
    },
    "exposure": {
        "id": "exposure",
        "name": "Exposure",
        "description": "The nature and degree to which a system is exposed to significant climatic variations.",
        "format": "number",
        "decimals": "2",
        "unit": null,
        "index": "vulnerability",
        "sector": null,
        "component": null
    },
    "food": {
        "id": "food",
        "name": "Food",
        "description": "The Food score summarizes a country's food production, nutrition and rural population.",
        "format": "number",
        "decimals": "2",
        "unit": null,
        "index": "vulnerability",
        "sector": null,
        "component": null
    },
    "habitat": {
        "id": "habitat",
        "name": "Habitat",
        "description": "",
        "format": "number",
        "decimals": "2",
        "unit": null,
        "index": "vulnerability",
        "sector": null,
        "component": null
    },
    "health": {
        "id": "health",
        "name": "Health",
        "description": "The Health score summarizes a country's ability to provide health services.",
        "format": "number",
        "decimals": "2",
        "unit": null,
        "index": "vulnerability",
        "sector": null,
        "component": null
    },
    "infrastructure": {
        "id": "infrastructure",
        "name": "Infrastructure",
        "description": "The Infrastructure score summarizes three factors impacting human well-being: coasts, energy and transportation.",
        "format": "number",
        "decimals": "2",
        "unit": null,
        "index": "vulnerability",
        "sector": null,
        "component": null
    },
    "sensitivity": {
        "id": "sensitivity",
        "name": "Sensitivity",
        "description": "The degree to which a system is affected, either adversely or beneficially, by climate variability or change.",
        "format": "number",
        "decimals": "2",
        "unit": null,
        "index": "vulnerability",
        "sector": null,
        "component": null
    },
    "vulnerability_delta": {
        "id": "vulnerability_delta",
        "name": "Vulnerability, adjusted for GDP",
        "description": "GDP adjusted Vulnerability scores represent how far the actual Vulnerability score of a country is from its expected Vulnerability score based on its GDP.  A positive value means a country has a higher Vulnerability score than other countries of a similar GDP. A negative value means a country has a worse score.",
        "map_caption": "Countries of the world by Vulnerability, adjusted for GDP. Lower scores (blue) are better.",
        "ranking_caption": "World wide ranking by Vulnerability, adjusted for GDP. Lower scores are better.",
        "format": "number",
        "decimals": "2",
        "unit": null,
        "index": "vulnerability_delta",
        "sector": null,
        "component": null
    },
    "vulnerability": {
        "id": "vulnerability",
        "name": "Vulnerability",
        "description": "A country's GAIN Index score is composed of a Vulnerability score and a Readiness score. Vulnerability measures a country's exposure, sensitivity and ability to cope with climate related hazards, as well as accounting for the overall status of food, water, health and infrastructure within the nation.",
        "map_caption": "Countries of the world by Vulnerability, lower scores (blue) are better.",
        "ranking_caption": "World wide ranking by Vulnerability, lower scores are better.",
        "format": "number",
        "decimals": "2",
        "unit": null,
        "index": "vulnerability",
        "sector": null,
        "component": null
    },
    "water": {
        "id": "water",
        "name": "Water",
        "description": "The Water score summarizes a country's current and future ability to provide clean water.",
        "format": "number",
        "decimals": "2",
        "unit": null,
        "index": "vulnerability",
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
    _.each(_.keys(from), function(k) {
        result[k] = _gradientComponent(from[k], to[k], max, pos);
    });
    return hslToHex(result);
}

function _gradientRgb(from, to, max, pos) {
    from = hexToRgb(from);
    to = hexToRgb(to);
    var result = {};
    _.each(_.keys(from), function(k) {
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
        return (h.charAt(0)=="#") ? h.substring(1,7):h;
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
    };
    return toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
}

function hexToHsl(hex) {
    return rgbToHsl(hexToRgb(hex));
}

function hslToHex(hsl) {
    return rgbToHex(hslToRgb(hsl));
}
