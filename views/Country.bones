view = views.Main.extend({
    events: _.extend({
        'click ul.tabs li a': 'selectTab',
        'click .tab-content td.name a': 'openDrawer',
        'click .drawer .handle a': 'closeDrawer'
    }, views.Main.prototype.events),
    initialize: function() {
        _.bindAll(this, 'getGraphData');
        views.Main.prototype.initialize.apply(this, arguments);
    },
    render: function() {
        var data = {},
            title = '',
            summary = [];
            indicators = {},
            currentYear = '2010';

        // Build a look up table for the data.
        this.collection.each(function(model) {
            if (!title) title = model.escape('country');

            data[model.get('name')] = model;
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
                    raw: data[field.id].get('input')[currentYear],
                    normalized: data[field.id].get('values')[currentYear]
                });
            }
        });

        // The summary information needs to be done manually.
        _.each(['gain', 'readiness_delta', 'vulnerability_delta'], function(k) {
            data.hasOwnProperty(k) && summary.push({
                id: k,
                name: k,
                value: data[k].get('values')[currentYear]
            });
        });

        // Approach the cabinet.
        $(this.el).empty().append(templates.Cabinet());

        // Empty pockets on top.
        $('.top', this.el).empty().append(templates.Country({
            title: title,
            summary: summary,
            tabs: indicators 
        }));

        // Some things fall on the floor.
        $('.floor', this.el).empty().append('<p>TODO</p>');
        return this;
    },
    attach: function() {
        this.initGraphs();
    },
    getGraphData: function(ind) {
            var data = this.collection.detect(function(v) {
                return v.get('name') == ind;
            });
            data = _(data.get('values')).chain()

            // Not sure if we need to ensure range...
            // var years = data.keys();
            // var min = years.min().value();
            // var max = years.max().value();

            data = data.map(function(v, k) {
                return [parseInt(k, 10), v];
            }).reject(function(v) {
                return v[1] === null;
            }).value();

            return data;
    },
    initGraphs: function() {
        var view = this;

        // iterate over all rows, if they have a div.graph setup the chart
        $('.country-profile table tr', this.el).each(function() {
            var graph = $('.graph .placeholder', this);
            if (graph.length == 0) return;

            var ind = $(this).attr('id').substr(10);
            if (!ind) return;

            var data = view.getGraphData(ind);

            new views.Sparkline({el: graph, data: data});
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
        var ind = $(ev.currentTarget).parents('tr').attr('id').substr(10);;
        if (!ind) return;

        var data = this.getGraphData(ind);

        var meta = this.collection.model.prototype.meta[ind];
        if (meta != undefined) {
            $('.drawer .content', this.el).empty().append(templates.IndicatorDrawer({
                title: meta.name,
                content: meta.explanation,
                indicator: meta.id
            }));

            if (data.length > 1) {
                new views.Bigline({
                    el: $('.drawer .content .graph', this.el),
                    data: data
                })
            } else {
                $('.drawer .content .graph', this.el).hide();
            }
            $('.drawer', this.el).addClass('open');
        }
        return false;
    },
    closeDrawer: function() {
        $('.drawer', this.el).removeClass('open');
        return false;
    },
    routeClick: function(ev) {
        if ($(ev.currentTarget).hasClass('handle')) {
            return false;
        }
        return views.Main.prototype.routeClick(ev);
    }
});
