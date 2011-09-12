model = Backbone.Collection.extend({
    model: models.Indicator,
    initialize: function() {
        _.bindAll(this, 'getGraphData', 'buildLookup');
        this.bind('add', this.buildLookup);
        this.bind('remove', this.buildLookup);
        this.buildLookup();
    },
    buildLookup: function() {
        var lookup = this.lookup = {};
        // Build a look up table for the data.
        this.each(function(m) {
            lookup[m.get('name')] = m;
        });
    },
    byName: function(name) {
        return this.lookup[name];
    },
    getGraphData: function(key, val, prop) {
        var prop = prop || 'values';

        var data = this.detect(function(v) {
            return v.get(key) == val;
        });
        if (data) {
          data = _(data.get(prop)).chain()

          // Not sure if we need to ensure range...
          // var years = data.keys();
          // var min = years.min().value();
          // var max = years.max().value();

          data = data.map(function(v, k) {
              return [parseInt(k, 10), v];
          }).reject(function(v) {
              return v[1] === null;
          }).value();
        }
        return data;
    },
    getRawGraphData: function(key, val) {
        // TODO: cleaner API.
        // This most likely causes the getGraphData to
        // be generated twice, and we should consider
        // improving this if the cost is too great.
        //     - AR.
        var data = this.getGraphData(key, val);
        var indicator = this.byName(val);

        var origin = _(indicator.get('origin')).reduce(function(m, v, k) {
            m[v] = m[v] || [];
            m[v].push(parseInt(k, 10));

            return m;
        }, {});
        return _(data).select(function(v) {
            return _.include(origin.raw, v[0]);
        });
    },
    sortByRank: function(options) {
        this.comparator = function(model) {
            var rank = model.rank({format: false});
            if (!rank) {
              return [Infinity, Infinity];
            }

            var index = model.meta('index');
            if (index == 'vulnerability' || model.get('name') == 'vulnerability_delta') {
                var rank = rank.asc || 000;
            } else {
                var rank = rank.desc || 999;
            }

            // Use the country code as a secondary
            // sort field.
            return [
                ('000' + rank).slice(-3),
                model.get('ISO3')
            ].join('');
        };
        this.sort(options);
        return this;
    }
});
