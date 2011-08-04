view = views.App.extend({
    events: _.extend({
        'click ul.tabs li a': 'selectTab'
    }, views.App.prototype.events),
    render: function() {
        if ($(this.el).is(':empty')) {
            var data = {},
                title = '',
                summary = [];
                indicators = {},
                currentYear = '2010';

            // Build a look up table for the data.
            this.collection.each(function(model) {
                if (!title) title = model.escape('country');

                data[model.get('name')] = model.get('values');
            });

            // Generate organized sets for the template.
            _.each(this.collection.model.prototype.meta, function(field) {
                if (indicators[field.indicator] == undefined) {
                    indicators[field.indicator] = {};
                }
                if (indicators[field.indicator][field.sector] == undefined) {
                    indicators[field.indicator][field.sector] = [];
                }
                if (data[field.id] !== undefined) {
                    indicators[field.indicator][field.sector].push({
                        field: field,
                        raw: data[field.id][currentYear],
                        normalized: data[field.id][currentYear]
                    });
                }
            });

            // The summary information needs to be done manually.
            _.each(['gain', 'readiness_delta', 'vulnerability_delta'], function(k) {
                data.hasOwnProperty(k) && summary.push({
                    id: k,
                    name: k,
                    value: data[k][currentYear]
                });
            });

            $(this.el).empty().append(templates.Country({
                title: title,
                summary: summary,
                tabs: indicators 
            }));
        }
        return this;
    },
    selectTab: function(ev) {
        var target  = ev.currentTarget.href.split('#').pop();
        $('.tab-content, ul.tabs li', this.el).removeClass('active');
        $(ev.currentTarget).parents('li').addClass('active');
        $('#'+ target, this.el).addClass('active');
        return false;
    }
});
