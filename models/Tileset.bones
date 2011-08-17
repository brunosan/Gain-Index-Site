// Tileset
// -------
model = Backbone.Model.extend({
    initialize: function(attr, options) {
        this.set({
            indicator: attr.id.slice(0, -5),
            year: attr.id.slice(-4)
        }, {silent : true});
    }
});
