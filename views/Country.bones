view = views.App.extend({
    render: function() {
        if ($('#view', this.el).is(':empty')) {
            var data = {},
                title = '',
                summary = [];

            this.collection.each(function(model) {
                if (!title) title = model.escape('country');

                var cat = model.escape('category'),
                    name = model.escape('name');

                if (data[cat] == undefined) data[cat] = {};

                data[cat][name] = model.get('values');
            });

            _.each(['gain', 'readiness_delta', 'vulnerability_delta'], function(k) {
                data.gain.hasOwnProperty(k) && summary.push({
                    id: k,
                    name: k,
                    value: data.gain[k]['2010']
                });
            });

            $('#view', this.el).empty().append(templates.Country({
                title: title,
                summary: summary,
                tabs: data
            }));
        }
        return this;
    }
});
