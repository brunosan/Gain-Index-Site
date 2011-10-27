view = Backbone.View.extend({
    initialize: function() {
        this.render.apply(this, arguments);
    },
    sparklineOptions: {
        xaxis: {show: false},
        yaxis: {show: false},
        grid: { borderWidth: 0 },
        series: {
            lines: { lineWidth: 1 },
            shadowSize: 0
        },
        colors: ['#ebebeb', '#666', '#666']
    },
    render: function(options) {
        var data = options.data;
        var rawData = options.rawData || [];

        // if rawData has no valid points, consider
        // data the authoritive source to render the
        // point.
        rawData = _.size(rawData) ? rawData : data;

        if (data && data.length > 1) {
            var last = data.length -1;
            var baseline = [
                [data[0][0], data[0][1]],
                [data[last][0], data[0][1]]
            ];
            var end = {
                data: _(rawData).rest(-1),
                lines: {show:false},
                points: { show:true, radius: 1 }
            };


            if (options.options != undefined) {
                var opts = _.extend(options.options, this.sparklineOptions);
            } else {
                var opts = this.sparklineOptions;
            }

            var range = [Infinity, -Infinity];
             _(data).each(function(d) {
                if (d[1] < range[0]) range[0] = d[1];
                if (d[1] > range[1]) range[1] = d[1];
            });
            var delta = range[1] - range[0];
            if (delta < 0.01) {
                var center = range[1] - delta;
                var center = range[0] + (delta / 2);
                opts = _.extend({}, opts, {
                    yaxis: _.extend({}, opts.yaxis,  {
                        min: center - 0.005,
                        max: center + 0.005
                    })
                });
            }

            $.plot(options.el, [baseline, data, end], opts);
        }
    }
});
