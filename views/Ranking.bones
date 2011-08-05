view = views.Main.extend({
    events: _.extend({
        'click .drawer .handle a': 'closeDrawer'
    }, views.Main.prototype.events),
    initialize: function() {
        _.bindAll(this, 'getGraphData');
        views.Main.prototype.initialize.apply(this, arguments);
    },
    render: function() {
        if ($(this.el).is(':empty')) {
            var data = [],
                sectors = {},
                indices = {},
                title = '',
                currentYear = '2010';

            // Arrange our metadata.
            var meta = this.collection.model.prototype.meta[this.collection.indicator];

            _.each(this.collection.model.prototype.meta, function(v) {
                indices[v.index] = true;
                if (v.index = meta.index) {
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
                    value: model.get('values')[currentYear],
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
            $('.floor', this.el).empty().append('<h3>'+meta.name+'</h3><p>'+meta.explanation+'</p>');
        }
        this.initGraphs();
        return this;
    },
    sparklineOptions: {
        xaxis: {show: false},
        yaxis: {show: false},
        grid: {borderColor: '#fff'},
        series: {
            lines: { lineWidth: 1 },
            shadowSize: 0
        },
        colors: ['#ccc', '#666', '#f00']
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
        var view = this,
            collection = this.collection,
            options = this.sparklineOptions;

        // iterate over all rows, if they have a div.graph setup the chart
        $('.ranking table tr', this.el).each(function() {
            var graph = $('.graph', this);
            if (graph.length == 0) return;

            var id = $(this).attr('id').substr(8);
            if (!id) return;

            var data = view.getGraphData(id);

            if (data.length > 1) {
                var last = data.length -1;
                var baseline = [
                    [data[0][0], data[0][1]],
                    [data[last][0], data[0][1]]
                ];
                var end = {
                    data: [[data[last][0], data[last][1]]],
                    lines: {show:false},
                    points: { show:true, radius: 1 }
                };
                $.plot(graph, [baseline, data, end], options);
            }
        });
    },
    closeDrawer: function() {
        $('.drawer', this.el).removeClass('open');
    }
});