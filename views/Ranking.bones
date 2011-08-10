view = views.Main.extend({
    events: _.extend({
        'click .drawer .handle a.handle': 'closeDrawer',
        'click table.data a.handle': 'openDrawer',
        'click a.sort.rank': 'sortRank',
        'click a.sort.alpha':  'sortAlpha'
    }, views.Main.prototype.events),
    initialize: function() {
        // "Reset" is fired when the collection is sorted. When that happens
        // it's time to re-render.
        var view = this;
        this.model.get('indicators').bind('reset', function() {
            view.render().attach();
        });

        _.bindAll(this, 'getGraphData');
        views.Main.prototype.initialize.apply(this, arguments);
    },
    render: function() {
        var data = [],
            sectors = {},
            indices = {},
            components = {},
            title = '',
            collection = this.model.get('indicators');

        // Arrange our metadata.
        var meta = collection.model.prototype.meta[this.model.get('id')];
        if (!meta) return this; // should be a 404

        _.each(collection.model.prototype.meta, function(v) {
            indices[v.index] = true;
            if (v.index == meta.index) {
                if (v.sector) {
                    sectors[v.sector] = true;
                }
                if (v.component) {
                    components[v.component] = true;
                }
            }
        });

        components = _.keys(components).sort();
        sectors = _.keys(sectors).sort();
        indices = _.keys(indices).sort();

        // Build a look up table for the data.
        collection.each(function(model) {
            data.push({
                name: model.escape('country'),
                iso3: model.get('ISO3'),
                value: model.currentValue(),
                rank: model.get('rank')
            });
        });

        // Approach the cabinet.
        $(this.el).empty().append(templates.Cabinet());

        // Empty pockets on top.
        $('.top', this.el).empty().append(templates.Ranking({
            indicatorName: meta.name,
            activeIndex: meta.index,
            indices: indices,
            sectors: sectors,
            components: components,
            countries: data
        }));

        // Some things fall on the floor.
        $('.floor', this.el).empty().append(templates.RankingFloor({
            title: meta.name,
            content: '<p>'+meta.explanation+'</p>'
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

            var data = view.getGraphData(id);

            new views.Sparkline({el: graph, data: data});
        });
    },
    getGraphData: function(id) {
            var collection = this.model.get('indicators');
            var data = collection.detect(function(v) {
                return v.get('ISO3') == id;
            });
            data = _(data.get('values')).chain()

            // Not sure if we need to ensure range...
            // var years = data.keys();
            // var min = years.min().value();
            // var max = years.max().value();

            data = data.map(function(v, k) {
                return [parseInt(k, 10), v];
            }).reject(function(v) {
                return v[1] === null;
            }).value();

            return data;
    },
    openDrawer: function(ev) {
        var id = $(ev.currentTarget).parents('tr').attr('id').substr(8);;
        if (!id) return;

        var data = this.getGraphData(id);

        $('.drawer .content', this.el).empty().append(templates.RankingDrawer({
            title: id,
            country: id
        }));

        if (data.length > 1) {
            new views.Bigline({
                el:$('.drawer .content .graph', this.el),
                data:data
            });
        } else {
            $('.drawer .content .graph', this.el).hide();
        }
        $('.drawer', this.el).addClass('open');
        return false;
    },
    closeDrawer: function() {
        $('.drawer', this.el).removeClass('open');
        return false;
    },
    sortAlpha: function() {
        var collection = this.model.get('indicators');
        collection.comparator = function(model) {
            return model.get('country');
        };
        collection.sort();
        return false;
    },
    sortRank: function(ev) {
        var e = $(ev.currentTarget),
            collection = this.model.get('indicators');

        if (e.hasClass('desc')) {
            collection.comparator = function(model) {
                var rank = model.get('rank');
                if (rank) return rank;
                return Infinity;
            };
        } else {
            collection.comparator = function(model) {
                var rank = model.get('rank');
                if (rank) return -rank;
                return -Infinity;
            };
        }

        collection.sort();
        return false;
    }
});
