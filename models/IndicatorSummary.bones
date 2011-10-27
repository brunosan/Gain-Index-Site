// Provides a summary for an indicator for all countries
// -----------------------------------------------------
model = Backbone.Model.extend({
    initialize: function(attrs, options) {
        options = options || {};
        // Look for years in options, this is where it gets passed in by the
        // /api router.
        !this.get('years') && this.set({years: options.years, silent: true});
        if (!this.get('years')) throw new Error('Year parameter is required');
    },
    // Finds similar countries
    // -----------------------
    similar: function(iso3, count, aspect, year) {
        aspect = aspect || 'values';
        year = year || _.last(this.get('years'));
        var result = [],
            similar = this.list(aspect, year),
            pos = _.indexOf(_.pluck(similar, 'ISO3'), iso3);

        if (pos == -1) return result;
        for (var i = pos; i < pos + count + 1; i++) {
            var k = i - Math.ceil(count / 2);
            similar[k] && (k != pos) && result.push(similar[k]);
        }
        return result.reverse();
    },
    // Lists a specific aspect in descending order
    // -------------------------------------------
    list: function(aspect, year) {
        if (!this.get(aspect)) return [];
        // TODO figure out a way to push this formatting logic into Indicator.bones.
        var id = aspect == 'values' ? {format: 'number', decimals: 3} : this.get('id');
        return _(this.get(aspect)).chain().map(function(v, k) {
            if (models.Country.meta[k] && models.Country.meta[k]['name'])
                return {
                    'ISO3': k,
                    'name': models.Country.meta[k]['name'],
                    'value': models.Indicator.format(v[year], id),
                    'path': models.Country.pathSafe(k)
                };
        }).sortBy(function(v) {return v.value;}).value();
    },
    url: function() {
        var url = '/api/IndicatorSummary/' + encodeURIComponent(this.get('id')) + '?';
        _.each(this.get('years'), function(year) {
            url += '&years[]=' + encodeURIComponent(year);
        });
        return url;
    }
});
