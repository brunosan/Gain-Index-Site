// Provides a summary for an indicator for all countries
// -----------------------------------------------------
model = Backbone.Model.extend({
    initialize: function(attrs, options) {
        this.options = options;
        this.options.years = this.options.years || [2010]; // TODO
    },
    url: function() {
        var url = '/api/IndicatorSummary/' + encodeURIComponent(this.get('id')) + '?';
        _.each(this.options.years, function(year) {
            url += '&years[]=' + encodeURIComponent(year);
        });
        return url;
    }
});
