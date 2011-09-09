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
            trends = this.options.trends,
            previousId = $('tr.active', this.el).attr('id');


        this.collection.each(function(model) {
            if (meta[model.get('ISO3')]) {
                data.push({
                    name: meta[model.get('ISO3')].name,
                    income: meta[model.get('ISO3')].oecd_income,
                    incomeClass: meta[model.get('ISO3')].oecd_income
                        .toLowerCase()
                        .replace(/[^a-zA-Z0-9]+/gi, '-'),
                    iso3: model.get('ISO3'),
                    score: model.score(),
                    trend: trends[model.get('ISO3')] || 'undefined',
                    rank: model.rank()
                });
            }
        });

        var showTrend = _.include(
            ['gain', 'readiness', 'vulnerability'],
            this.options.indicatorName
        );

        $(this.el).empty().append(templates.RankingTable({
            showTrend: showTrend,
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
        // by income will yield different results, though only for countries
        // with a `null` rank.
        this.collection.sortByRank();

        var meta = meta = models.Country.meta;
        this.collection.comparator = function(model) {
            var country = meta[model.get('ISO3')];
            if (country && country.oecd_value) {
                // Within each income group sort by rank. Ranks will always be
                // below 1000, so we can just divid by that, and add this to
                // the oecd_value.
                var rank = model.rank({format: false});
                rank = (rank && rank.desc) ?  (rank.desc / 1000) : 0.999;

                return country.oecd_value + rank;
            }
            return Infinity;
        };
        this.collection.sort();
        $('a.sort.label').removeClass('activeSort');
        $('a.sort.label.income').addClass('activeSort');
        return false;
    }
});
