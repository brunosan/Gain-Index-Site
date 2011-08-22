model = Backbone.Model.extend({
    url: function() {
        return '/api/Ranking/' + encodeURIComponent(this.get('id'));
    },
    parse: function(resp) {
        resp.indicators = new models.Indicators(resp.indicators);
        resp.indicators.sortByRank({silent: true});
        return resp;
    },
    initialize: function(attributes, options) {
        var indicators = new models.Indicators(attributes.indicators);
        var subject = new models.Indicator({id: this.id});
        this.set({
            indicators: indicators.sortByRank({silent: true}),
            subject: subject
        }, {silent : true});
    },
    path: function() {
        return model.path(this.id);
    }
});

// Generates the user facing paths for each ranking
// ------------------------------------------------
model.path = function(id) {
    var meta = models.Indicator.meta;
    if (!meta[id]) {
        return '/';
    }
    var base = '/ranking/';
    if (id.slice(-6) == '_delta') {
        base = '/ranking/delta/';
        id = id.slice(0, -6);
    }
    if (meta[id].index && (id != meta[id].index)) {
        return base + meta[id].index + '/' + id;
    }
    return base + id;
};
