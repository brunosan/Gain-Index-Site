view = Backbone.View.extend({
    initialize: function(options) {
        this.model = options.model;
        this.type = options.type;
        this.render();
    },
    render: function() {
        var collection = this.model.get('indicators'),
            data = [],
            matches = (this.type == 'Vulnerability') ? 
              ['water', 'food', 'health', 'infrastruct'] : 
              ['economic', 'governance', 'social'],
            totalWidth = 0,
            total = 0;

        collection.each(function(indicator) {
            var id = indicator.get('name');
            var item = {};
            if (_.indexOf(matches, id) > -1) {
                item.score = !isNaN(parseFloat(indicator.score())) ? indicator.score() : 0;
                item.name = indicator.meta('name');
                item.id = id;
                total += parseFloat(item.score);
                data.push(item);
            }
        });
        // Calculate percentages based on totals
        _.each(data, function(sector) {
            sector.percent = Math.round((parseFloat(sector.score) / total)*100); 
            totalWidth += sector.percent;
        });
        var i = -1;
        while (totalWidth > 100) {
            if (i < 0) i = data.length - 1;
            if (data[i].percent > 1) {
                data[i].percent--;
                totalWidth--;
            }
            i--;
        }
        $(this.el).append(templates.SectorCandyBar({
            data: data,
            type: this.type
        }));
        return this;
    },
});
