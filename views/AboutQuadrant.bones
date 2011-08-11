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
                ranks[k] = that.formatRank(data[k].currentValue('rank'));
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
        var index = value.desc < value.asc ? 'desc' : 'asc';

        var qualifier = {desc: 'most', asc: 'least'}[index];

        var rank = value[index];
        var suffix = 'th';

        var suffixMap = {1: 'st', 2: 'nd', 3: 'rd'};

        if (!/1\d$/.test('' + rank)) {
            suffix = suffixMap[rank % 10] || 'th';
        }

        return (rank == 1) ? qualifier : rank + suffix + ' ' + qualifier;
    }

});
