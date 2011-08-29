view = views.Main.extend({
    initialize: function(options) {
        _.bindAll(this, 'render', 'attach');
        this.options = this.options || {};
        this.options.tab = options.index || 'vulnerability';
        this.options.structure = options.structure || 'sectors';
    },
    render: function() {
        var that = this;
        var lookup = {}, data = [];

        // Build a look up table for the data.
        // TODO move this to the collection.
        this.collection.each(function(m) {
            lookup[m.get('name')] = m;
        });

        var branch = this.tree[this.options.tab][this.options.structure],
            meta = this.collection.model.meta

        var scores = {};
        var sectors = [];
        var appendData = function(key, klass) {
            var field = {
                field: meta[key],
                klass: klass,
                raw: null, 
                normalized: null
            };
            var sector = {};
            if (lookup[key] != undefined) {
                field.input = lookup[key].input();
                field.score = lookup[key].score();
            }
            // Create new hash to determine worst scores.
            scores[field.field.id] = {};
            scores[field.field.id].score = field.score;
            scores[field.field.id].index = field.field.index;
            scores[field.field.id].name = field.field.id;
            scores[field.field.id].sector = field.field.sector;
            if (field.field.component == null && field.field.id != that.options.tab) {
                sector.id = field.field.id;
                sector.score = !isNaN(parseFloat(field.score)) ? field.score : 0;
                sectors.push(sector);
            }
            data.push(field);
        }

        appendData(this.options.tab, 'index');
        _.each(branch, function(leaf, section) {
            appendData(section, 'section');
            _.each(leaf, function(indicator) {
                if (indicator.id != section) {
                    appendData(indicator, 'data');
                }
            });
        });

        // Calculate the % for each sector and stick onto data.graph
        var total = 0;
        var totalWidth = 0;
        _.each(sectors, function(sector) { total += parseFloat(sector.score) });
        _.each(sectors, function(sector) { sector.percent = Math.round((parseFloat(sector.score) / total)*100) });
        var i = -1;
        while (totalWidth > 100) {
            if (i < 0) i = sectors.length - 1;
            if (sectors[i].percent > 1) {
                sectors[i].percent--;
                totalWidth--;
            }
            i--;
        }
        _.each(data, function(field) {
            if (field.field.component == null) {
                field.graph = sectors;
            }
        });

        // Sort by score, drop 0's and 1's, drop sectors
        scores = _.filter(scores, function(item) { return ((item.score > 0 && item.score < 1) || item.sector == null); });
        if (this.options.tab == 'vulnerability') {
            scores = _.filter(scores, function(item) {return item.score > 0.7 });
            scores.sort(function(a, b) { return b.score - a.score });
            scores = scores.slice(0,3);
        } else {
            scores = _.filter(scores, function(item) {return item.score < 0.3 });
            scores.sort(function(a, b) { return a.score - b.score });
            scores = scores.slice(0,3);
        }
        // New hash w/ indicators as keys
        var worst = {};
        _.each(scores, function(score) {
            worst[score.name] = score.score;
        });
        $(this.el).empty().append(templates.CountryTable({data: data, worst: worst}));
        return this;
    },
    attach: function() {
        var collection = this.collection;

        // iterate over all rows, if they have a div.graph setup the chart
        $('tr', this.el).each(function() {
            var graph = $('.graph .placeholder', this);
            if (graph.length == 0) return;

            var ind = $(this).attr('id');
            var ind = $(this).attr('id').substr(10);
            if (!ind) return;

            var data = collection.getGraphData('name', ind);

            new views.Sparkline({el: graph, data: data});
        });
    }
});


view.prototype.tree = {
    "readiness": {
        "components": {
            "economic": [
                "business",
                "finan",
                "fiscal",
                "gov_spend",
                "invest",
                "monetary",
                "trade"
            ],
            "governance": [
                "corruption",
                "non_violence",
                "voice_accountability"
            ],
            "social": [
                "enrollment",
                "labor",
                "mobiles",
                "rule_of_law"
            ]
        },
        "sectors": {}
    },
    "vulnerability": {
        "components": {
            "exposure": [
                "coast_area",
                "d-Ppt",
                "d-Temp",
                "daly",
                "energy_access",
                "health_disease",
                "road_floods",
                "yield_cv",
                "yld_proj"
            ],
            "sensitivity": [
                "coast_popn",
                "energy_sensit",
                "external",
                "imports",
                "road_paved",
                "rural_popn",
                "staff",
                "water_disease",
                "water_use"
            ],
            "capacity": [
                "food_capacity",
                "life",
                "malnutr",
                "matern",
                "sanit",
                "water_access"
            ]
        },
        "sectors": {
            "food": [
                "food_capacity",
                "imports",
                "malnutr",
                "rural_popn",
                "yield_cv",
                "yld_proj"
            ],
            "water": [
                "d-Ppt",
                "d-Temp",
                "sanit",
                "water_access",
                "water_disease",
                "water_use"
            ],
            "health": [
                "daly",
                "external",
                "health_disease",
                "life",
                "matern",
                "staff"
            ],
            "infrastruct": [
                "coast_area",
                "coast_popn",
                "energy_access",
                "energy_sensit",
                "road_floods",
                "road_paved"
            ]
        }
    },
    "vulnerability_delta": {
        "components": {},
        "sectors": {}
    },
    "readiness_delta": {
        "components": {},
        "sectors": {}
    },
    "gain": {
        "components": {},
        "sectors": {}
    }
}
