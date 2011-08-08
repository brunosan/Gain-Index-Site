model = Backbone.Model.extend({
    url: '',
    defaults: {
        currentYear: 2010,
        input: {},
        values: {}
    },
    currentValue: function() {
        var series = 'values'
        if (arguments.length && arguments[0] == 'input') {
           series = 'input'; 
        }
        return this.get(series)[this.currentYear];
    },
    meta: {
        "business": {
            "id": "business",
            "name": "Business Freedom",
            "explanation": "Index of Economic Freedom. Business Freedom subcomponent",
            "index": "readiness",
            "sector": "n/a",
            "component": "economic",
            "source1": "http://www.heritage.org/index/explore",
            "source2": null,
            "source3": null
        },
        "agric_capacity": {
            "id": "agric_capacity",
            "name": "Agricultural Capacity",
            "explanation": "Synthetic index combining average of 2 best scores among use of fertilizers, mechanization and irrigation in agriculture",
            "index": "vulnerability",
            "sector": "agriculture",
            "component": "capacity",
            "source1": "http://data.worldbank.org/indicator/AG.CON.FERT.ZS",
            "source2": "http://data.worldbank.org/indicator/AG.LND.TRAC.ZS",
            "source3": "http://data.worldbank.org/indicator/AG.LND.IRIG.AG.ZS"
        },
        "coast_area": {
            "id": "coast_area",
            "name": "Coastal Area",
            "explanation": "Land less than 5 m above sea-level (%)",
            "index": "vulnerability",
            "sector": "infrastructure",
            "component": "exposure",
            "source1": "WB DEC",
            "source2": null,
            "source3": null
        },
        "coast_popn": {
            "id": "coast_popn",
            "name": "Coastal Population",
            "explanation": "Population living less than 5 m above sea-level (%)",
            "index": "vulnerability",
            "sector": "infrastructure",
            "component": "sensitivity",
            "source1": "WB DEC??",
            "source2": null,
            "source3": null
        },
        "corruption": {
            "id": "corruption",
            "name": "Control of Corruption",
            "explanation": "World Governance Indicator. Control of Corruption Component",
            "index": "readiness",
            "sector": "n/a",
            "component": "governance",
            "source1": "http://info.worldbank.org/governance/wgi/sc_country.asp",
            "source2": null,
            "source3": null
        },
        "D-Ppt": {
            "id": "D-Ppt",
            "name": "Precipitation Change",
            "explanation": "Projected change in precipitation - A2 scenario by the end of the 21st Century.",
            "index": "vulnerability",
            "sector": "water",
            "component": "exposure",
            "source1": "CRU data sets",
            "source2": null,
            "source3": null
        },
        "D-Temp": {
            "id": "D-Temp",
            "name": "Temperature Change",
            "explanation": "Projected change in temperature - by the end of the 21st Century.",
            "index": "vulnerability",
            "sector": "water",
            "component": "exposure",
            "source1": "CRU data sets",
            "source2": null,
            "source3": null
        },
        "daly": {
            "id": "daly",
            "name": "Disability Adjusted Life Years",
            "explanation": "Increase in Disability Adjusted Life Years due to climate change in the late 21st Century",
            "index": "vulnerability",
            "sector": "health",
            "component": "exposure",
            "source1": "Ebi 2008",
            "source2": null,
            "source3": null
        },
        "energy_access": {
            "id": "energy_access",
            "name": "Energy Access",
            "explanation": "% pop with access to electricity.",
            "index": "vulnerability",
            "sector": "infrastructure",
            "component": "exposure",
            "source1": "UNPD WHO analysis",
            "source2": null,
            "source3": null
        },
        "energy_sensit": {
            "id": "energy_sensit",
            "name": "Energy Senstitivity",
            "explanation": "Energy at risk - percent energy derived from hydro & imports",
            "index": "vulnerability",
            "sector": "infrastructure",
            "component": "sensitivity",
            "source1": "http://data.worldbank.org/indicator/EG.IMP.CONS.ZS",
            "source2": "http://data.worldbank.org/indicator/EG.ELC.HYRO.ZS",
            "source3": null
        },
        "enrollment": {
            "id": "enrollment",
            "name": "Tertiary Education",
            "explanation": "Enrollment tertiary Education (% Gross)",
            "index": "readiness",
            "sector": "n/a",
            "component": "social",
            "source1": "http://data.worldbank.org/indicator/SE.TER.ENRR",
            "source2": null,
            "source3": null
        },
        "external": {
            "id": "external",
            "name": "External Dependence",
            "explanation": "External resources for health (% of total expenditure on health)",
            "index": "vulnerability",
            "sector": "health",
            "component": "sensitivity",
            "source1": "http://data.worldbank.org/indicator/SH.XPD.EXTR.ZS",
            "source2": null,
            "source3": null
        },
        "finan": {
            "id": "finan",
            "name": "Financial Freedom",
            "explanation": "Index of Economic Freedom. Fiancial Freedom subcomponent",
            "index": "readiness",
            "sector": "n/a",
            "component": "economic",
            "source1": "http://www.heritage.org/index/explore",
            "source2": null,
            "source3": null
        },
        "fiscal": {
            "id": "fiscal",
            "name": "Fiscal Freedom",
            "explanation": "Index of Economic Freedom. Fiscal Freedom subcomponent",
            "index": "readiness",
            "sector": "n/a",
            "component": "economic",
            "source1": "http://www.heritage.org/index/explore",
            "source2": null,
            "source3": null
        },
        "gov_spend": {
            "id": "gov_spend",
            "name": "Government Spending",
            "explanation": "Index of Economic Freedom. Goverment Spending subcomponent",
            "index": "readiness",
            "sector": "n/a",
            "component": "economic",
            "source1": "http://www.heritage.org/index/explore",
            "source2": null,
            "source3": null
        },
        "health_disease": {
            "id": "health_disease",
            "name": "Disease Mortality",
            "explanation": "Percentage mortality due to infectious diseases",
            "index": "vulnerability",
            "sector": "health",
            "component": "exposure",
            "source1": "http://apps.who.int/ghodata/?vid=99001#",
            "source2": null,
            "source3": null
        },
        "imports": {
            "id": "imports",
            "name": "Food Import Dependency",
            "explanation": "Proportion of cereal consumption derived from external sources",
            "index": "vulnerability",
            "sector": "agriculture",
            "component": "sensitivity",
            "source1": "FAO",
            "source2": null,
            "source3": null
        },
        "invest": {
            "id": "invest",
            "name": "Investment Freedom",
            "explanation": "Index of Economic Freedom. Investment Freedom subcomponent",
            "index": "readiness",
            "sector": "n/a",
            "component": "economic",
            "source1": "http://www.heritage.org/index/explore",
            "source2": null,
            "source3": null
        },
        "labor": {
            "id": "labor",
            "name": "Labor Freedom",
            "explanation": "Index of Economic Freedom. Labor Freedom subcomponent",
            "index": "readiness",
            "sector": "n/a",
            "component": "social",
            "source1": "http://www.heritage.org/index/explore",
            "source2": null,
            "source3": null
        },
        "longev": {
            "id": "longev",
            "name": "Longevity",
            "explanation": "Life expectancy at birth (both sexes)",
            "index": "vulnerability",
            "sector": "health",
            "component": "capacity",
            "source1": "http://data.worldbank.org/indicator/SP.DYN.LE00.IN",
            "source2": null,
            "source3": null
        },
        "malnutr": {
            "id": "malnutr",
            "name": "Malnutrition",
            "explanation": "Malnutrition measure based on the percent of under 5 year-olds with low weight for height",
            "index": "vulnerability",
            "sector": "agriculture",
            "component": "capacity",
            "source1": "WHO",
            "source2": null,
            "source3": null
        },
        "matern": {
            "id": "matern",
            "name": "Maternal Mortality",
            "explanation": "Lifetime risk of maternal death (%)",
            "index": "vulnerability",
            "sector": "health",
            "component": "capacity",
            "source1": "http://data.worldbank.org/indicator/SH.MMR.RISK.ZS",
            "source2": null,
            "source3": null
        },
        "mobiles": {
            "id": "mobiles",
            "name": "Mobile Penetration",
            "explanation": "Mobile cellular subscriptions (per 100 people)",
            "index": "readiness",
            "sector": "n/a",
            "component": "social",
            "source1": "http://data.worldbank.org/indicator/IT.CEL.SETS.P2",
            "source2": null,
            "source3": null
        },
        "monetary": {
            "id": "monetary",
            "name": "Monetary Freedom",
            "explanation": "Index of Economic Freedom. Monetary Freedom subcomponent",
            "index": "readiness",
            "sector": "n/a",
            "component": "economic",
            "source1": "http://www.heritage.org/index/explore",
            "source2": null,
            "source3": null
        },
        "non_violence": {
            "id": "non_violence",
            "name": "Political Stability & Non-Violence",
            "explanation": "World Governance Indicator. Political Stability and non-Violence Component",
            "index": "readiness",
            "sector": "n/a",
            "component": "governance",
            "source1": "http://info.worldbank.org/governance/wgi/sc_country.asp",
            "source2": null,
            "source3": null
        },
        "road_floods": {
            "id": "road_floods",
            "name": "Road Flooding",
            "explanation": "Frequency of floods / Land Area",
            "index": "vulnerability",
            "sector": "infrastructure",
            "component": "exposure",
            "source1": "CRED & WB Stats for area",
            "source2": null,
            "source3": null
        },
        "road_paved": {
            "id": "road_paved",
            "name": "Paved Roads",
            "explanation": "Percentage of paved roads",
            "index": "vulnerability",
            "sector": "infrastructure",
            "component": "sensitivity",
            "source1": "http://data.worldbank.org/indicator/IS.ROD.PAVE.ZS",
            "source2": null,
            "source3": null
        },
        "rural_popn": {
            "id": "rural_popn",
            "name": "Rural Population",
            "explanation": "% population in rural livelihoods",
            "index": "vulnerability",
            "sector": "agriculture",
            "component": "sensitivity",
            "source1": "http://data.worldbank.org/indicator/SP.POP.TOTL",
            "source2": "http://data.worldbank.org/indicator/SP.RUR.TOTL",
            "source3": null
        },
        "rule_of_law": {
            "id": "rule_of_law",
            "name": "Rule of Law",
            "explanation": "World Governance Indicator. Rule of Law Component",
            "index": "readiness",
            "sector": "n/a",
            "component": "social",
            "source1": "http://info.worldbank.org/governance/wgi/sc_country.asp",
            "source2": null,
            "source3": null
        },
        "sanit": {
            "id": "sanit",
            "name": "Sanitary Water",
            "explanation": "% Population with access to improved sanitation",
            "index": "vulnerability",
            "sector": "water",
            "component": "capacity",
            "source1": "http://data.worldbank.org/indicator/SH.STA.ACSN",
            "source2": null,
            "source3": null
        },
        "staff": {
            "id": "staff",
            "name": "Health workers per capita",
            "explanation": "Number of medical workers per 1000 population (2*Doctors + nurses/midwives)",
            "index": "vulnerability",
            "sector": "health",
            "component": "sensitivity",
            "source1": "http://data.worldbank.org/indicator/SH.MED.PHYS.ZS",
            "source2": "http://data.worldbank.org/indicator/SH.MED.NUMW.P3",
            "source3": null
        },
        "trade": {
            "id": "trade",
            "name": "Trade Freedom",
            "explanation": "Index of Economic Freedom. Trade Freedom subcomponent",
            "index": "readiness",
            "sector": "n/a",
            "component": "economic",
            "source1": "http://www.heritage.org/index/explore",
            "source2": null,
            "source3": null
        },
        "voice_accountability": {
            "id": "voice_accountability",
            "name": "Voice & Accountability",
            "explanation": "World Governance Indicator. Voice and Accountability Component",
            "index": "readiness",
            "sector": "n/a",
            "component": "governance",
            "source1": "http://info.worldbank.org/governance/wgi/sc_country.asp",
            "source2": null,
            "source3": null
        },
        "water_access": {
            "id": "water_access",
            "name": "Water Access",
            "explanation": "% Population with access to improved water supply",
            "index": "vulnerability",
            "sector": "water",
            "component": "capacity",
            "source1": "http://data.worldbank.org/indicator/SH.H2O.SAFE.ZS",
            "source2": null,
            "source3": null
        },
        "water_disease": {
            "id": "water_disease",
            "name": "Water Disease",
            "explanation": "Deaths due to water borne diseases in under 5 year-olds",
            "index": "vulnerability",
            "sector": "water",
            "component": "sensitivity",
            "source1": "WHO",
            "source2": null,
            "source3": null
        },
        "water_use": {
            "id": "water_use",
            "name": "Water Use",
            "explanation": "Water withdrawn for all uses as percent of total internal & external water",
            "index": "vulnerability",
            "sector": "water",
            "component": "sensitivity",
            "source1": "http://www.fao.org/nr/water/aquastat/data/query/index.html?lang=en",
            "source2": null,
            "source3": null
        },
        "yld_proj": {
            "id": "yld_proj",
            "name": "Yield Change",
            "explanation": "Projected impact of climate change on agricultural yields. (ACDI)",
            "index": "vulnerability",
            "sector": "agriculture",
            "component": "exposure",
            "source1": "From Cline via Wheeler",
            "source2": null,
            "source3": null
        },
        "governance": {
            "id": "governance",
            "name": "Governance",
            "explanation": "Readiness component comprised of voice & accountability, political stability and non-violence, and control of corruption.",
            "index": null,
            "sector": null,
            "component": null,
            "source1": null,
            "source2": null,
            "source3": null
        },
        "economic": {
            "id": "economic",
            "name": "Economic Readiness",
            "explanation": "Readiness component comprised of government spending, business, trade, fiscal, financial, investement and monetary freedoms.",
            "index": null,
            "sector": null,
            "component": null,
            "source1": null,
            "source2": null,
            "source3": null
        },
        "social": {
            "id": "social",
            "name": "Social Readiness",
            "explanation": "Readiness component comprised of mobile penetration, tertiary education, rule of law and labor freedom.",
            "index": null,
            "sector": null,
            "component": null,
            "source1": null,
            "source2": null,
            "source3": null
        },
        "exposure": {
            "id": "exposure",
            "name": "Exposure",
            "explanation": "Vulnerability component comprised of yield change, road flooding, disease mortality, precipitation change, temperature change, disability adjusted life years and coastal area.",
            "index": null,
            "sector": null,
            "component": null,
            "source1": null,
            "source2": null,
            "source3": null
        },
        "sensitivity": {
            "id": "sensitivity",
            "name": "Sensitivity",
            "explanation": "Vulnerability component comprised of water use, water disease, health workers per capita, rural population, paved roads, food import dependency, energy sensitivity and coastal population.",
            "index": null,
            "sector": null,
            "component": null,
            "source1": null,
            "source2": null,
            "source3": null
        },
        "capacity": {
            "id": "capacity",
            "name": "Capacity",
            "explanation": "Vulnerability component comprised of sanitary water, water access, maternal mortality, malnutrition, longevity,  and agricultural capacity.",
            "index": null,
            "sector": null,
            "component": null,
            "source1": null,
            "source2": null,
            "source3": null
        },
        "water": {
            "id": "water",
            "name": "Water",
            "explanation": "Vulnerability sector comprised of water access, water disease, water use, precipitation change and temperature change.",
            "index": null,
            "sector": null,
            "component": null,
            "source1": null,
            "source2": null,
            "source3": null
        },
        "agriculture": {
            "id": "agriculture",
            "name": "Agriculture",
            "explanation": "Vulnerability sector comprised of yield change, rural population, malnutrition, food import dependency, and agricultural capacity.",
            "index": null,
            "sector": null,
            "component": null,
            "source1": null,
            "source2": null,
            "source3": null
        },
        "health": {
            "id": "health",
            "name": "Health",
            "explanation": "Vulnerability component comprised of health workers per capita, longevity, maternal mortality, disease mortality and external dependence.",
            "index": null,
            "sector": null,
            "component": null,
            "source1": null,
            "source2": null,
            "source3": null
        },
        "infrastructure": {
            "id": "infrastructure",
            "name": "Infrastructure",
            "explanation": "Vulnerability component comprised of paved roads, road flooding, energy access, energy sensitivity, coastal area and coastal population.",
            "index": null,
            "sector": null,
            "component": null,
            "source1": null,
            "source2": null,
            "source3": null
        },
        "vulnerability": {
            "id": "vulnerability",
            "name": "Vulnerability",
            "explanation": "Index calculated using indicators paved roads, road flooding, energy access, energy sensitivity, coastal area, coastal population, health workers per capita, longevity, maternal mortality, disease mortality, external dependence, yield change, rural population, malnutrition, food import dependency, agricultural capacity, water access, water disease, water use, precipitation change and temperature change.",
            "index": null,
            "sector": null,
            "component": null,
            "source1": null,
            "source2": null,
            "source3": null
        },
        "readiness": {
            "id": "readiness",
            "name": "Readiness",
            "explanation": "Index calculated using indicators mobile penetration, tertiary education, rule of law, labor freedom, government spending, business, trade, fiscal, financial, investement, monetary freedoms, voice & accountability, political stability and non-violence, and control of corruption.",
            "index": null,
            "sector": null,
            "component": null,
            "source1": null,
            "source2": null,
            "source3": null
        },
        "gain": {
            "id": "gain",
            "name": "GaIn",
            "explanation": "Gain score calculated using readiness and vulnerability index scores.",
            "index": null,
            "sector": null,
            "component": null,
            "source1": null,
            "source2": null,
            "source3": null
        }
    }
});
