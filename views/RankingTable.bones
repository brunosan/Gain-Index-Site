view = Backbone.View.extend({
    events: {
        'click a.sort.rank': 'sortRank',
        'click a.sort.alpha':  'sortAlpha',
        'click a.sort.income':  'sortIncome'
    },
    initialize: function() {
        // "Reset" is fired when the collection is sorted. When that happens
        // it's time to re-render.
        _.bindAll(this, 'render');
        this.collection.bind('reset', this.render);
    },
    render: function() {
        var data = [],
            meta = models.Country.meta,
            previousId = $('tr.active', this.el).attr('id');

        this.collection.each(function(model) {
            if (model.rank({format: false}) && meta[model.get('ISO3')]) {
                data.push({
                    name: meta[model.get('ISO3')].name,
                    income: meta[model.get('ISO3')].oecd_income,
                    incomeClass: meta[model.get('ISO3')].oecd_income
                        .toLowerCase()
                        .replace(/[^a-zA-Z0-9]+/gi, '-'),
                    iso3: model.get('ISO3'),
                    score: model.score(),
                    outlook: model.outlook(),
                    rank: model.rank()
                });
            }
        });

        $(this.el).empty().append(templates.RankingTable({
            rows: data
        }));
        // Conserve previously active table rows.
        previousId && $('tr#' + previousId).addClass('active');
        return this;
    },
    sortAlpha: function(ev) {
        this.collection.comparator = function(model) {
            return model.get('country');
        };
        this.collection.sort();
        $('a.sort.label').removeClass('activeSort');
        $('a.sort.label.alpha').addClass('activeSort');
        return false;
    },
    sortRank: function(ev) {
        this.collection.sortByRank();
        $('a.sort.label').removeClass('activeSort');
        $('a.sort.label.rank').addClass('activeSort');
        return false;
    },
    sortIncome: function(ev) {
        // Start with a defined sort order - otherwise successive sorts
        // by income will yield different results.
        this.collection.sortByRank();
        var meta = meta = models.Country.meta;
        this.collection.comparator = function(model) {
            var country = meta[model.get('ISO3')];
            if (country && country.oecd_value) {
                return country.oecd_value;
            }
            return Infinity;
        };
        this.collection.sort();
        $('a.sort.label').removeClass('activeSort');
        $('a.sort.label.income').addClass('activeSort');
        return false;
    }
});
