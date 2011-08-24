view = Backbone.View.extend({
    initialize: function(options) {
        this.model = options.model;
        this.type = options.type;
        this.render();
    },
    render: function() {
        var collection = this.model.get('indicators'),
            data = {},
            matches = (this.type == 'Vulnerability') ? 
          ['water', 'food', 'health', 'infrastruct'] : 
          ['economic', 'governance', 'social'];
        data.tot = 0;
        collection.each(function(indicator) {
            var id = indicator.get('name');
            if (_.indexOf(matches, id) > -1) {
                data[id] = {};
                data[id].score = indicator.score();
                data[id].name = indicator.meta('name');
                data.tot += parseFloat(data[id].score);
            }
        });
        // Calculate percentages based on totals
        _.each(data, function(sector) { sector.percent = Math.round((parseFloat(sector.score) / data.tot)*100) });
        // Otherwise it gets iterated over in the template.
        delete data.tot;
        $(this.el).append(templates.SectorCandyBar({
            data: data,
            type: this.type
        }));
        return this;
    },
});
