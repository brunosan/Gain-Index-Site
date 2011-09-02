view = Backbone.View.extend({
    initialize: function() {
        this.render.apply(this, arguments);
    },
    sparklineOptions: {
        xaxis: {
          tickDecimals: 0
        },
        //yaxis: {show: false},
        grid: {borderColor: '#ccc'},
        legend: {
            show: true,
            container: '.drawer .chart .legend',
            noColumns: 4,
        },
        series: {
            lines: { lineWidth: 1 },
            shadowSize: 0
        },
        colors: ['#666', '#d15659', '#d15659']
    },
    render: function(options) {
        var data = options.data;
        var rawData = options.rawData;

        if (data && data.length > 1) {

            var points = {
                data: data,
                color: 1,
                lines: { show: false },
                points: { show: true, radius: 1 }
            };

            var series = [data, points];

            if (rawData && rawData.length) {
                if (rawData.length != data.length) {
                    series[1].label = 'Calculated';
                    series[1].color = 0;
                }

                var rawPoints = {
                    label: "Reported",
                    data: rawData,
                    color: 1,
                    lines: { show: false },
                    points: { show: true, radius: 1 }
                };
                series.push(rawPoints);
            }

            if (options.options != undefined) {
                var opts = _.extend(options.options, this.sparklineOptions);
            } else {
                var opts = this.sparklineOptions;
            }
            $.plot(options.el, series, opts);
        }
    }
});
