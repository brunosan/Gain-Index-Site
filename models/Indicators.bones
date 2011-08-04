model = Backbone.Collection.extend({
    model: models.Indicator,
    url: function() {
        return '/api/Indicator?country=' + encodeURIComponent(this.country);
    },
    initialize: function(models, options) {
        if (options && options.country != undefined) {
            this.country = options.country;
        }
    }
});
