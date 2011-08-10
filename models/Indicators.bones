model = Backbone.Collection.extend({
    model: models.Indicator,
    comparator: function(model) {
        // By default keep things sorted by country name.
        return model.get('country');
    },
    initialize: function() {
        _.bindAll(this, 'getGraphData');

        // Don't calculate rankings if the set is empty, or it's already done.
        if (this.length == 0 || this.first().get('rank')) {
            return;
        }

        var set = [];
        this.each(function(model) {
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
    }
});
