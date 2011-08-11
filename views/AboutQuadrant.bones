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
            country: this.formatCountry(country),
            ranks: ranks
        }));

    },
    // a small helper function to process some country
    // names into more gramattically correct alternative.
    formatCountry: function(name) {
        var map = {
            'Central African Republic': 'The Central African Republic',
            'Congo, the Democratic Republic of the': 'The Democratic Republic of the Congo',
            'Czech Republic': 'The Czech Republic',
            'Dominican Republic': 'The Dominican Republic',
            'Iran, Islamic Republic of': 'The Islamic Republic of Iran',
            'Korea, Democratic People\'s Republic of': 'The Democratic People\'s Republic of Korea',
            'Korea, Republic of': 'The Republic of Korea',
            'Lao People\'s Democratic Republic': 'The Lao People\'s Democratic Republic',
            'Libyan Arab Jamahiriya': 'The Libyan Arab Jamahiriya',
            'Marshall Islands': 'The Marshall Islands',
            'Micronesia, Federated States of': 'The Federated States of Micronesia',
            'Moldova, Republic of': 'The Republic of Moldova',
            'Netherlands': 'The Netherlands',
            'Philippines': 'The Philippines',
            'Russian Federation': 'The Russian Federation',
            'Seychelles': 'The Seychelles',
            'Syrian Arab Republic': 'The Syrian Arab Republic',
            'Tanzania, United Republic of': 'The United Republic of Tanzania',
            'United Arab Emirates': 'The United Arab Emirates',
            'United Kingdom': 'The United Kingdom',
            'United States': 'The United States',
            'Venezuela, Bolivarian Republic of': 'The Bolivarian Republic of Venezuela'
        }

        return map[name] || name;
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
