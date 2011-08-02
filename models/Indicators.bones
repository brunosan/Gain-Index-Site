model = Backbone.Collection.extend({
    model: models.Indicator,
    initialize: function(models, options) {
        if (options && options.country != undefined) {
            this.country = options.country;
        }
    }
});
