view = Backbone.View.extend({
    initialize: function(options) {
        this.map = options.map || false;
        this.render();
    },
    render: function() {
        var summary = {},
            pin = {},
            indicators = this.model.get('indicators');

        _.each(['gain', 'readiness', 'vulnerability'], function(k) {
            var indicator = indicators.byName(k);
            if (indicator) {
                summary[k] = {
                    name: indicator.meta('name'),
                    value: indicator.score(),
                    raw: indicator.score({format: false})
                };
                if (k === 'gain') {
                    summary[k].outlook = indicator.outlook();
                }
            }
        });
        if (summary.readiness && summary.vulnerability) {
            // Determine which quadrant to highlight.
            var activeQuad = (summary.vulnerability.raw > 0.5 ? 't' : 'b');
            activeQuad += (summary.readiness.raw > 0.5 ? 'r' : 'l');

            // This math depends very heavily on the CSS which is applied to the
            // matrix. We've got the following assumptions.
            //
            // * The grid is made up of 32px x 32px quadrants
            // * The grid has 1px center lines, so it's 65px across
            // * The point has a 10px diameter
            // * The grid is vertically offset by 0px;
            // * The grid is horizontally offset by 23px;
            // * The containing element is 100px x 90px
            pin.x = Math.round(summary.readiness.raw * (65 - 10)) + 23;
            pin.y = (65 - 10) - Math.round(summary.vulnerability.raw * (65 - 10));
        }
        $(this.el).empty().append(templates.CountrySummary({
            data: summary,
            active: activeQuad,
            pin: pin,
            map: this.map
        }));
        return this;
    }
});
