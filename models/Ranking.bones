model = Backbone.Model.extend({
    url: function() {
        return '/api/Ranking/' + encodeURIComponent(this.get('id'));
    },
    parse: function(resp) {
        resp.indicators = new models.Indicators(resp.indicators);
        this.calculateRankings(resp.indicators);
        return resp;
    },
    initialize: function(attributes, options) {
        var indicators = new models.Indicators(attributes.indicators);
        this.calculateRankings(indicators);
        this.set({indicators: indicators}, {silent : true});
    },
    calculateRankings: function(indicators) {

        indicators.comparator = function(model) {
            var rank = model.currentValue('rank');
            if (rank) return rank.desc;
            return Infinity;
        };
        indicators.sort({silent: true});
    }
});
