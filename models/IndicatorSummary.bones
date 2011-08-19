// Provides a summary for an indicator for all countries
// -----------------------------------------------------
model = Backbone.Model.extend({
    initialize: function(attrs, options) {
        this.options = options;
        if (!this.options.years) throw new Error('Year parameter is required');
    },
    // Finds similar countries
    // -----------------------
    similar: function(iso3, count, aspect, year) {
        aspect = aspect || 'values';
        year = year || _.last(this.options.years);
        var result = [],
            similar = this.list(aspect, year),
            pos = _.indexOf(_.pluck(similar, 'ISO3'), iso3);

        if (pos == -1) return result;
        for (var i = pos; i < pos + count + 1; i++) {
            var k = i - Math.floor(count / 2);
            similar[k] && (k != pos) && result.push(similar[k]);
        }
        return result;
    },
    // Lists a specific aspect in descending order
    // -------------------------------------------
    list: function(aspect, year) {
        if (!this.get(aspect)) return [];
        // TODO figure out a way to push this formatting logic into Indicator.bones.
        var id = aspect == 'values' ? {format: 'number', decimals: 3} : this.get('id');
        return _.map(this.get(aspect), function(v, k) {
            if (models.Country.meta[k] && models.Country.meta[k]['name'])
                return {
                    'ISO3': k,
                    'name': models.Country.meta[k]['name'],
                    'value': models.Indicator.format(v[year], id)
                };
        }).sort(function(a, b) {
            return b.value - a.value;
        });
    },
    url: function() {
        var url = '/api/IndicatorSummary/' + encodeURIComponent(this.get('id')) + '?';
        _.each(this.options.years, function(year) {
            url += '&years[]=' + encodeURIComponent(year);
        });
        return url;
    }
});
