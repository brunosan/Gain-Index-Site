view = Backbone.View.extend({
    render: function() {
        var that = this;

        var data = {},
            ranks = {},
            missing = [],
            country = '',
            collection = this.model.get('indicators');


        // Build a look up table for the data.
        collection.each(function(m) {
            if (!country) country = new models.Country({id: m.get('ISO3')});

            data[m.get('name')] = m;
        });
        
        _.each(['gain', 'readiness', 'vulnerability'], function(k) {
            var value = false;

            if (data.hasOwnProperty(k)) {
                value = that.formatRank(data[k].rank({format: false}));
            }

            if (value) {
                ranks[k] = value;
            }
            else {
                k !== 'gain' && missing.push({
                    'vulnerability': 'Vulnerability',
                    'readiness': 'Readiness'
                }[k]);
            }
        });

        var template = this.templateName || 'AboutQuadrant';

        if (!missing.length && !this.templateName) {
            var coords = [
                data.vulnerability.score({format: false}) > 0.5 ? 'Top' : 'Bottom',
                data.readiness.score({format: false}) > 0.5 ? 'Right' : 'Left'
            ];

            template = template + coords.join('');
        }


        // Description text based on quadrant.
        $(this.el).empty().append(templates[template]({
            country: country.get('name'),
            ranks: ranks,
            missing: missing,
            rankVerb: {
                gain: 'suitable',
                readiness: 'ready',
                vulnerability: 'vulnerable'
            }
        }));

    },
    formatRank: function(value) {
        if (_.isUndefined(value)) {
            return false;
        }
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
