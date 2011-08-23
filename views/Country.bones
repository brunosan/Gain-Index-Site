view = views.Main.extend({
    events: _.extend({
        'click ul.tabs li a': 'selectTab',
        'click table.data tr': 'openDrawer',
        'click .drawer .handle a': 'closeDrawer'
    }, views.Main.prototype.events),
    render: function() {
        var indicators = this.model.get('indicators');

        // Generate historical rankings.
        var rank = [];
        _.each(indicators.byName('gain').get('rank'), function(r, year) {
            rank.push({
                year: year,
                rank: indicators.byName('gain').rank({year: year})
            });
        });

        // Approach the cabinet.
        $(this.el).empty().append(templates.Cabinet());
        // Empty pockets on top.
        $('.top', this.el).empty().append(templates.Country({
            title: this.model.meta('name'),
            rank: rank,
            gdp: {
                year: 2009,
                value: indicators.byName('gdp').input({year: 2009}),
                label: indicators.byName('gdp').meta('name')
            },
            population: {
                year: 2009,
                value: indicators.byName('pop').input({year: 2009}),
                label: indicators.byName('pop').meta('name')
            }
        }));

        new views.CountrySummary({
            el: $('.country-summary', this.el).last(),
            model: this.model,
            map: true
        });

        this.aboutView = new views.AboutQuadrant({
            el: $('.prose', this.el),
            model: this.model
        }).render();

        // Some things fall on the floor.
        var gain = new models.Indicator({id: 'gain'});
        $('.floor', this.el).empty().append(templates.DefaultFloor({
            title: gain.meta('name'),
            content: gain.meta('description')
        }));

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
        var coords = (this.model.meta('coords'));

        this.map = new models.Map({year: 2010, indicator: 'gain'}, {
            el: $('.country-summary .map', this.el)[0],
            width: 340,
            height: 160,
            lon: coords[0],
            lat: coords[1]
        });
        this.map.featureClick = function(feature, context, index) {
            var iso = $(feature).data('iso');
            return window.location = '/country/'+ iso;
        }

        if (this.tableView == undefined) {
            this.tableView = new views.CountryTable({
                el: $('table#country-data', this.el),
                collection: this.model.get('indicators')
            });
        }
        this.tableView.attach();
        return this;
    },
    activeLinks: function() {
        views.Main.prototype.activeLinks.apply(this, arguments);
        $('ul.tabs.level-1 .' + this.tableView.options.tab).addClass('active');
        $('ul.tabs.level-2 .' + this.tableView.options.structure).addClass('active');
    },
    selectTab: function(ev) {
        var e = $(ev.currentTarget);

        this.tableView.options.tab = 'vulnerability';
        this.tableView.options.structure = 'sectors';
        if (e.hasClass('readiness')) {
            this.tableView.options.structure = 'components';
            this.tableView.options.tab = 'readiness';
        }
        if (e.hasClass('components')) {
            this.tableView.options.structure = 'components';
        }
        this.tableView.options.tab == 'readiness' ? $('ul.tabs.level-2').hide() : $('ul.tabs.level-2').show();

        this.tableView.render().attach();
        this.activeLinks();
        return false;
    },
    openDrawer: function(ev) {
        $('table.data tr').removeClass('active');
        var ind = $(ev.currentTarget).attr('id').substr(10),
            indicator = this.model.get('indicators').byName(ind),
            country = this.model;
        if (!indicator) return;
        $(ev.currentTarget).addClass('active');

        var data = this.model.get('indicators').getGraphData('name', ind);
        $('.drawer .content', this.el).empty().append(templates.CountryDrawer({
            title: indicator.meta('name'),
            description: indicator.meta('description'),
            indicator: indicator.get('name'),
            source: indicator.meta('source') || [],
            // We're assuming that all indicators are assigned to either a
            // component or a sector.
            methodologyHash:
                (indicator.meta('component') || indicator.meta('sector')) ?
                'scoringindicators' :
                indicator.get('name')
        }));

        // Lazy load 5 similar countries.
        var el = this.el;
        (new models.IndicatorSummary(
            {id: indicator.get('name'), years: [indicator.get('currentYear')]}
        )).fetch({
            success: function(summary) {
                $('.drawer .similar-countries', el).empty().append(
                    templates.SimilarCountries({
                        similar: summary.similar(country.get('id'), 5)
                    })
                );
            }
        });

        if (data && data.length > 1) {
            new views.Bigline({
                el: $('.drawer .content .graph', this.el),
                data: data
            })
        } else {
            $('.drawer .content .graph', this.el).hide();
        }
        $('.drawer', this.el).addClass('open');
        return false;
    },
    closeDrawer: function() {
        $('.drawer', this.el).removeClass('open');
        $('table.data tr').removeClass('active');
        return false;
    }
});
