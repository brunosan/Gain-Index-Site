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
    }
});
