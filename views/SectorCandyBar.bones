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
            var id = indicator.get('name'),
                item = {},
                score = indicator.score();
            if (_.indexOf(matches, id) > -1 && !isNaN(parseFloat(score))) {
                item.score = score;
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
        if (data.length) {
            // Make sure total adds up to 100.
            var sorted = _.sortBy(data, function(sector) { return sector.percent;});
            var i = sorted.length;
            while (totalWidth < 100) {
                if (i >= sorted.length) i = 0;
                sorted[i].percent++;
                totalWidth++;
                i++;
            }
            var i = -1;
            while (totalWidth > 100) {
                if (i < 0) i = sorted.length - 1;
                sorted[i].percent--;
                totalWidth--;
                i--;
            }
        }
        $(this.el).append(templates.SectorCandyBar({
            data: data,
            klass: data.length ? '' : 'empty',
            type: this.type
        }));
        return this;
    }
});
