model = Backbone.Collection.extend({
    model: models.Indicator,
    initialize: function() {
        _.bindAll(this, 'getGraphData');
    },
    getGraphData: function(key, val) {
        var data = this.detect(function(v) {
            return v.get(key) == val;
        });
        if (data) {
          data = _(data.get('values')).chain()

          // Not sure if we need to ensure range...
          // var years = data.keys();
          // var min = years.min().value();
          // var max = years.max().value();

          data = data.map(function(v, k) {
              return [parseInt(k, 10), v];
          }).reject(function(v) {
              return v[1] === null;
          }).value();
        }
        return data;
    },
    sortByRank: function(options) {
        this.comparator = function(model) {
            var rank = model.currentValue('rank');
            if (rank) return rank.desc;
            return Infinity;
        };
        this.sort(options);
        return this;
    }
});
