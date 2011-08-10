view = Backbone.View.extend({
    initialize: function() {
        this.render.apply(this, arguments);
    },
    sparklineOptions: {
        //xaxis: {show: false},
        //yaxis: {show: false},
        grid: {borderColor: '#ccc'},
        series: {
            lines: { lineWidth: 1 },
            shadowSize: 0
        },
        colors: ['#666', '#f00']
    },
    render: function(options) {
        var data = options.data;
        if (data && data.length > 1) {

            var points = {
                data: data,
                lines: { show:false },
                points: { show:true, radius: 1 }
            };

            if (options.options != undefined) {
                var opts = _.extend(options.options, this.sparklineOptions);
            } else {
                var opts = this.sparklineOptions;
            }
            $.plot(options.el, [data, points], opts);
        }
    }
});
