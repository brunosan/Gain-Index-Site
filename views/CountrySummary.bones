view = Backbone.View.extend({
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
            pin.x = Math.round((summary.readiness.raw * 80) + 15);
            pin.y = 80 - Math.round(summary.vulnerability.raw * 80);
        }
        $(this.el).append(templates.CountrySummary({
            summary: summary,
            pin: pin
        }));
        return this;
    }
});
