model = Backbone.Collection.extend({
    model: models.Indicator,
    url: function() {
        // This collection supports two ways of loading a list of indicators.
        // In order or precidence, they are;
        //    1. By country - retrieve all indicators for a country.
        //    2. By indicator - retrieve one indicator for all countries.
        if (this.country != undefined) {
            return '/api/Indicator?country=' + encodeURIComponent(this.country);
        } else if (this.indicator != undefined) {
            return '/api/Indicator?indicator=' + encodeURIComponent(this.indicator);
        }
    },
    initialize: function(models, options) {
        if (options && options.country != undefined) {
            this.country = options.country;
        } else if (options && options.indicator != undefined) {
            this.indicator = options.indicator;
        }
    }
});
