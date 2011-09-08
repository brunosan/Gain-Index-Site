view = Backbone.View.extend({
    initialize: function(options) {
        // The country is passed in as `model` and automagically attached to
        // our view, but we need to manually tack on the indictor.
        this.indicator = options.indicator;
        this.render(options.callback);
    },
    render: function(callback) {
        var view = this,
            meta = models.Country.meta;
            options = {};

        if ($(this.el).hasClass('open')) {
            $(this.el).addClass('updating');
        }

        this.model.fetch({
            success: function(model) {
                $('.content', view.el).empty().append(templates.CountryDetailDrawer({
                    countryName: meta[model.id].name,
                    indicatorName: view.indicator.meta('name'),
                    countryPath: model.nameToPath(meta[model.id].name)
                }));
                view.attach();

                $(view.el).removeClass('updating');
                // if this is always used for the 'open' class we should just
                // include that here...
                if (typeof(callback) == 'function') callback();
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
        $('.content .composition-bars', this.el).empty();
        _.each(['Vulnerability', 'Readiness'], function(type) {
            new views.SectorCandyBar({
                type: type,
                model: that.model,
                el: $('.content .composition-bars', that.el)
            });
        });

        var data = this.model.get('indicators').getGraphData('name', this.indicator.id);
        if (data.length > 1) {
            new views.Bigline({
                el:$('.content .graph', this.el),
                data:data
            });
        } else {
            $('.content .indicator-time', this.el).hide();
        }
    }
});
