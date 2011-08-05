view = views.Main.extend({
    events: _.extend({
        'click .drawer .handle a': 'closeDrawer'
    }, views.Main.prototype.events),
    initialize: function() {
        _.bindAll(this, 'getGraphData');
        views.Main.prototype.initialize.apply(this, arguments);
    },
    render: function() {
//        if ($(this.el).is(':empty')) {
            var data = [],
                sectors = {},
                indeces = {},
                title = '',
                currentYear = '2010';

            // Arrange our metadata.
            var meta = this.collection.model.prototype.meta['gain'];

            _.each(this.collection.model.prototype.meta, function(v) {
                indeces[v.index] = true;
                if (v.index = meta.index) {
                    sectors[v.sector] = true;
                }
            });

            sectors = _.keys(sectors);
            indeces = _.keys(indeces);

            // Build a look up table for the data.
            this.collection.each(function(model) {
                data.push({
                    name: model.escape('country'),
                    value: model.get('values'),
                });
            });

            // Approach the cabinet.
            $(this.el).empty().append(templates.Cabinet());

            // Empty pockets on top.
            $('.top', this.el).empty().append(templates.Ranking({
                indeces: indeces,
                sectors: sectors,
                country: data
            }));

            // Some things fall on the floor.
            $('.floor', this.el).empty().append('<p>TODO</p>');
//        }
        //this.initGraphs();
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
    getGraphData: function(ind) {
            var data = this.collection.detect(function(v) {
                return v.get('name') == ind;
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
        $('.country-profile table tr', this.el).each(function() {
            var graph = $('.graph .placeholder', this);
            if (graph.length == 0) return;

            var ind = $(this).attr('id').substr(10);
            if (!ind) return;

            var data = view.getGraphData(ind);

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
