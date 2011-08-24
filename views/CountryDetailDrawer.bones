view = Backbone.View.extend({
    initialize: function(options) {
        // The country is passed in as `model` and automagically attached to
        // our view, but we need to manually tack on the indictor.
        this.indicator = options.indicator;
        this.render();
    },
    render: function() {
        var view = this,
            meta = models.Country.meta;
            options = {};

        $('.content', this.el).empty().append(templates.CountryDetailDrawer({
            countryName: meta[this.model.id].name,
            indicatorName: this.indicator.meta('name'),
            countryId: this.model.id
        }));

        this.model.fetch({
            success: function(model) {
                view.attach();
            }
        });
        return this;
    },
    attach: function() {
        // Now that we've got data, draw the country summary and graph.
        new views.CountrySummary({
            el: $('.content .country-summary', this.el),
            model: this.model
        });

        var that = this;
        _.each(['Vulnerability', 'Readiness'], function(type) {
            new views.SectorCandyBar({
                type: type,
                model: that.model,
                el: $('.content .candybar', that.el)
            });
        });

        var data = this.model.get('indicators').getGraphData('name', this.indicator.id);
        if (data.length > 1) {
            new views.Bigline({
                el:$('.content .graph', this.el),
                data:data
            });
        } else {
            $('.content .graph', this.el).hide();
        }
    }
});