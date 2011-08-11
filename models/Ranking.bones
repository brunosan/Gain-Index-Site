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
        // Don't calculate rankings if the set is empty, or it's already done.
        if (indicators.length == 0 || indicators.first().get('rank')) {
            return;
        }

        var set = [];
        indicators.each(function(model) {
            var val = model.currentValue();
            if (val != null) {
                set.push({
                  model: model,
                  val: val
                });
            }
        });
        set.sort(function(a, b) {
            return b.val - a.val;
        });
        _.each(set, function(v, i) {
            v.model.set({rank: i + 1}, {silent: true});
        });

        indicators.comparator = function(model) {
            var rank = model.get('rank');
            if (rank) return rank;
            return Infinity;
        };
        indicators.sort({silent: true});
    }
});
