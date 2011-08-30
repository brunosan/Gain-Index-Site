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
        colors: ['#ebebeb', '#C6C6C6', '#d15659']
    },
    render: function(options) {
        var data = options.data;
        if (data && data.length > 1) {
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

            if (options.options != undefined) {
                var opts = _.extend(options.options, this.sparklineOptions);
            } else {
                var opts = this.sparklineOptions;
            }

            $.plot(options.el, [baseline, data, end], opts);
        }
    }
});
