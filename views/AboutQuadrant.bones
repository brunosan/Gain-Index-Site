view = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'render');
        this.render.apply(this, arguments);
    },
    render: function() {
        var that = this;

        var data = {},
            ranks = {},
            country = '',
            collection = this.model.get('indicators');


        // Build a look up table for the data.
        collection.each(function(m) {
            if (!country) country = m.escape('country');

            data[m.get('name')] = m;
        });
        
        _.each(['gain', 'readiness', 'vulnerability'], function(k) {
            if (data.hasOwnProperty(k)) {
                ranks[k] = that.formatRank(data[k].get('rank'));
            }
        });

        var coords = [
            data.vulnerability.currentValue() > 0.5 ? 'Top' : 'Bottom',
            data.readiness.currentValue() > 0.5 ? 'Right' : 'Left'
        ];

        var template = 'AboutQuadrant' + coords.join('');

        // Description text based on quadrant.
        $(this.el).empty().append(templates[template]({
            country: country,
            ranks: ranks
        }));

    },
    formatRank: function(value) {
        var value = '' + value;
        if (/1\d$/.test(value)) {
            return value + 'th';
        }
        switch (value[value.length - 1]) {
            case '1': return value + 'st';
            case '2': return value + 'nd';
            case '3': return value + 'rd';
            default: return value + 'th';
        }
    }

});
