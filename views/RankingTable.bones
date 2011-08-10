view = Backbone.View.extend({
    events: {
        'click a.sort.rank': 'sortRank',
        'click a.sort.alpha':  'sortAlpha'
    },
    initialize: function() {
        // "Reset" is fired when the collection is sorted. When that happens
        // it's time to re-render.
        var view = this;
        this.collection.bind('reset', function() {
            view.render().attach();
        });
    },
    render: function() {
        var data = [];

        // Build a look up table for the data.
        this.collection.each(function(model) {
            data.push({
                name: model.escape('country'),
                iso3: model.get('ISO3'),
                value: model.currentValue(),
                rank: model.get('rank')
            });
        });

        $(this.el).empty().append(templates.RankingTable({
            rows: data
        }));
        return this;
    },
    attach: function() {
        var view = this;

        // iterate over all rows, if they have a div.graph setup the chart
        $('.ranking table tr', this.el).each(function() {
            var graph = $('.graph', this);
            if (graph.length == 0) return;

            var id = $(this).attr('id').substr(8);
            if (!id) return;

            var data = view.collection.getGraphData(id);

            new views.Sparkline({el: graph, data: data});
        });
    },
    sortAlpha: function() {
        this.collection.comparator = function(model) {
            return model.get('country');
        };
        this.collection.sort();
        return false;
    },
    sortRank: function(ev) {
        this.collection.comparator = function(model) {
            var rank = model.get('rank');
            if (rank) return rank;
            return Infinity;
        };
        this.collection.sort();
        return false;
    }
});
