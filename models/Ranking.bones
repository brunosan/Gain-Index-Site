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
    if (id == 'gain') {
        return '/ranking';
    }
    var meta = models.Indicator.meta;
    if (!meta[id]) {
        return '/';
    }
    if (meta[id].index && meta[meta[id].index].index != meta[id].index) {
        return '/ranking/' + meta[id].index + '/' + id;
    }
    return '/ranking/' + id;
};
