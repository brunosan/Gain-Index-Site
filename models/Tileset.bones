// Tileset
// -------
model = Backbone.Model.extend({
    initialize: function(attr, options) {
        this.set({
            indicator: attr.id.slice(0, -5),
            year: attr.id.slice(-4)
        }, {silent : true});
    },
    tilejson: function() {
        return {
            "tilejson": "1.0.0",
            "name": this.get('id'),
            "tiles": [
                "http://localhost:3001/1.0.0/" + this.get('id') + "/{z}/{x}/{y}.png"
            ],
            "grids": [
                "http://localhost:3001/1.0.0/" + this.get('id') + "/{z}/{x}/{y}.grid.json"
            ],
        }
    }
});
