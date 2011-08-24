view = Backbone.View.extend({
    events: {
        'hover .country-sector-graph span': 'showInfo'
    },
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
            var name = indicator.get('name');
            if (_.indexOf(matches, name) > -1) {
                data[name] = {};
                data[name].score = indicator.score();
                data.tot += parseFloat(data[name].score);
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
    showInfo: function() {
        //$('.country-sector-graph span > .info', this.el).toggleClass('show');
        return false;
    }
});
