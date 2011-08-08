view = views.Main.extend({
    events: _.extend({
        'click .drawer .handle a.handle': 'closeDrawer',
        'click table.data a.handle': 'openDrawer'
    }, views.Main.prototype.events),
    initialize: function() {
        _.bindAll(this, 'getGraphData');
        views.Main.prototype.initialize.apply(this, arguments);
    },
    render: function() {
        var data = [],
            sectors = {},
            indices = {},
            title = '';

        // Arrange our metadata.
        var meta = this.collection.model.prototype.meta[this.collection.indicator];
        if (!meta) return this; // should be a 404

        _.each(this.collection.model.prototype.meta, function(v) {
            indices[v.index] = true;
            if (v.index == meta.index) {
                sectors[v.sector] = true;
            }
        });

        sectors = _.keys(sectors);
        indices = _.keys(indices);

        // Build a look up table for the data.
        this.collection.each(function(model) {
            data.push({
                name: model.escape('country'),
                iso3: model.get('ISO3'),
                value: model.currentValue(),
            });
        });

        // Approach the cabinet.
        $(this.el).empty().append(templates.Cabinet());

        // Empty pockets on top.
        $('.top', this.el).empty().append(templates.Ranking({
            indicatorName: meta.name,
            indices: indices,
            sectors: sectors,
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
        this.initGraphs();
    },
    getGraphData: function(id) {
            var data = this.collection.detect(function(v) {
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
    initGraphs: function() {
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
    routeClick: function(ev) {
        if ($(ev.currentTarget).hasClass('handle')) {
            return false;
        }
        return views.Main.prototype.routeClick(ev);
    }
});
