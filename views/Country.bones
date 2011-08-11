view = views.Main.extend({
    events: _.extend({
        'click ul.tabs li a': 'selectTab',
        'click .tab-content td.name a': 'openDrawer',
        'click .drawer .handle a': 'closeDrawer'
    }, views.Main.prototype.events),
    initialize: function() {
        views.Main.prototype.initialize.apply(this, arguments);
    },
    render: function() {
        var lookup = {},
            title = '',
            summary = {},
            pin = {},
            indicators = {};
            collection = this.model.get('indicators'),
            meta = collection.model.prototype.meta;


        // Build a look up table for the data.
        // TODO move this to the collection.
        collection.each(function(m) {
            lookup[m.get('name')] = m;
        });

        // The summary information needs to be done manually.
        _.each(['gain', 'readiness', 'vulnerability'], function(k) {
            if (!title) title = lookup[k].escape('country');
            if (lookup.hasOwnProperty(k)) {
                summary[k] = {
                    name: meta[k].name,
                    value: lookup[k].currentValue()
                };
            }
        });
        if (summary.readiness && summary.vulnerability) {
            pin.x = Math.round((summary.readiness.value * 80) + 15);
            pin.y = 80 - Math.round(summary.vulnerability.value * 80);
        }

        // Approach the cabinet.
        $(this.el).empty().append(templates.Cabinet());

        // Empty pockets on top.
        $('.top', this.el).empty().append(templates.Country({
            title: title,
            summary: summary,
            rank: lookup.gain.get('rank'),
            tabs: indicators,
            pin: pin
        }));

        this.aboutView = new views.AboutQuadrant({
            el: $('.prose', this.el),
            model: this.model
        }).render();


        // Some things fall on the floor.
        $('.floor', this.el).empty().append(templates.DefaultFloor());

        if (this.tableView == undefined) {
            this.tableView = new views.CountryTable({
                el: $('table#country-data', this.el),
                collection: this.model.get('indicators')
            });
        }
        this.tableView.render();
        return this;
    },
    attach: function() {
        if (this.tableView == undefined) {
            this.tableView = new views.CountryTable({
                el: $('table.data', this.el),
                collection: this.model.get('indicators')
            });
        }
        this.tableView.attach();
    },
    selectTab: function(ev) {
        var e = $(ev.currentTarget);

        $('ul.tabs li.active', this.el).removeClass('active');
        e.parents('li').addClass('active');
        e.parents('div:first').siblings('ul').find('li:first').addClass('active');
        
        this.tableView.options.tab = 'vulnerability';
        this.tableView.options.structure = 'components';
        if (e.hasClass('readiness')) {
            this.tableView.options.tab = 'readiness';
        }
        if (e.hasClass('sectors')) {
            this.tableView.options.structure = 'sectors';
        }

        this.tableView.render().attach();
        return false;
    },
    openDrawer: function(ev) {
        var ind = $(ev.currentTarget).parents('tr').attr('id').substr(10);;
        if (!ind) return;

        var collection = this.model.get('indicators');
        var data = collection.getGraphData('name', ind);

        var collection = this.model.get('indicators');
        var meta = collection.model.prototype.meta[ind];
        if (meta != undefined) {
            $('.drawer .content', this.el).empty().append(templates.CountryDrawer({
                title: meta.name,
                content: meta.explanation,
                indicator: meta.id
            }));

            if (data && data.length > 1) {
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
    }
});
