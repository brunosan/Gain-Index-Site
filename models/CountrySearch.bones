model = Backbone.Collection.extend({
    model: models.Country,
    initialize: function(init, options) {
        this.models = _(models.Country.meta).map(function(o, id) { 
            return new models.Country({id: id}); 
        });
    },
    comparator: function(model) {
        return model.name;
    },
    sync: function(method, model, options) {
        return options.error('Unsupported method');
    }
});
