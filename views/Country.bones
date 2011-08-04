view = views.App.extend({
    events: _.extend({
        'click ul.tabs li a': 'selectTab',
        'click .tab-content td.name a': 'openDrawer',
        'click .drawer .handle a': 'closeDrawer'
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
                if (indicators[field.index] == undefined) {
                    indicators[field.index] = {};
                }
                if (indicators[field.index][field.sector] == undefined) {
                    indicators[field.index][field.sector] = [];
                }
                if (data[field.id] !== undefined) {
                    indicators[field.index][field.sector].push({
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
        this.initGraphs();
        return this;
    },
    sparklineOptions: {
        xaxis: {show: false},
        yaxis: {show: false},
        grid: {borderColor: '#fff'},
        series: {shadowSize: 0}
    },
    initGraphs: function() {
        var collection = this.collection,
            options = this.sparklineOptions;

        // iterate over all rows, if they have a div.graph setup the chart
        $('.country-profile table tr', this.el).each(function() {
            var graph = $('.graph .placeholder', this);
            if (graph.length == 0) return;

            var ind = $(this).attr('id').substr(10);
            if (!ind) return;

            var data = collection.detect(function(v) {
                return v.get('name') == ind;
            });
            data = _(data.get('values')).chain().reject(function(v) {
                return v === null;
            }).map(function(v, k) {
                return [k, v];
            }).value();

            $.plot(graph, [data], options);
        });
    },
    selectTab: function(ev) {
        var target  = ev.currentTarget.href.split('#').pop();
        $('.tab-content, ul.tabs li', this.el).removeClass('active');
        $(ev.currentTarget).parents('li').addClass('active');
        $('#'+ target, this.el).addClass('active');
        return false;
    },
    openDrawer: function(ev) {
        $('#empty-drawer', this.el).addClass('open');
    },
    closeDrawer: function() {
        $('#empty-drawer', this.el).removeClass('open');
    }
});
