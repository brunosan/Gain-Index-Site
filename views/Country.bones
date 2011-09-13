view = views.Main.extend({
    events: _.extend({
        'click ul.tabs.level-1 li a': 'selectVR',
        'click ul.tabs.level-2 li a': 'selectBreakdown',
        'click table.data tr': 'openDrawer',
        'click .country-summary .gain': 'openDrawer',
        'click .country-summary .indicator': 'openDrawer',
        'click .country-profile .reporting': 'openDrawer',
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
        $(this.el).empty().append(templates.Cabinet({klass: 'country'}));
        // Empty pockets on top.
        $('.top', this.el).empty().append(templates.Country({
            title: this.model.meta('name'),
            reporting: indicators.byName('reporting').input(),
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
            content: templates.GaInFloorText(),
            methodologyHash:
                (gain.meta('component') || gain.meta('sector')) ?
                'scoringindicators' :
                gain.meta('index')
        }));

        this.ensureChildViews();
        this.vTable.render();
        this.rTable.render();
        this.pageTitle = this.model.meta('name');
        return this;
    },
    attach: function() {
        views.Main.prototype.attach.call(this);
        var coords = (this.model.meta('coords'));

        this.map = new models.Map({year: 2010, indicator: 'gain'}, {
            el: $('.country-summary .map-wrapper', this.el)[0],
            width: 340,
            height: 160,
            extent: coords 
        });
        this.map.featureClick = function(feature, context, index) {
            var iso = $(feature).data('iso');
            if (iso) {
                views.App.route('/country/' + models.Country.pathSafe(iso));
            }
        }

        this.ensureChildViews();
        this.vTable.attach();
        this.rTable.attach();
        return this;
    },
    ensureChildViews: function() {
        if (this.vTable == undefined) {
            this.vTable = new views.CountryTable({
                el: $('table#vulnerability', this.el),
                collection: this.model.get('indicators')
            });
        }
        if (this.rTable == undefined) {
            this.rTable = new views.CountryTable({
                el: $('table#readiness', this.el),
                collection: this.model.get('indicators'),
                structure: 'components',
                index: 'readiness'
            });
        }
    },
    activeLinks: function() {
        views.Main.prototype.activeLinks.apply(this, arguments);
        $('ul.tabs.level-1 a').addClass('active');
        $('ul.tabs.level-2').removeClass('hidden');
        $('.tab-content table.hidden').each(function(i, el) {
            var id = $(el).attr('id');
            $('ul.tabs.level-1 a#' + id).removeClass('active');
            $('ul.tabs.level-2.' + id).addClass('hidden');
        });
        $('ul.tabs.level-2 .' + this.vTable.options.structure).addClass('active');
        return this;
    },
    selectVR: function(ev) {
        $('.tab-content table').addClass('hidden');
        $('.tab-content table' + $(ev.currentTarget).attr('href')).removeClass('hidden');
        this.activeLinks();
        return false;
    },
    selectBreakdown: function(ev) {
        this.vTable.options.structure = 'sectors';
        if ($(ev.currentTarget).hasClass('components')) {
            this.vTable.options.structure = 'components';
        }
        this.vTable.render().attach();
        this.activeLinks();
        return false;
    },
    openDrawer: function(ev) {
        $('.indicator').removeClass('active');
        var ind = $(ev.currentTarget).attr('id').substr(10),
            indicator = this.model.get('indicators').byName(ind),
            country = this.model;
        if (!indicator) return;
        $(ev.currentTarget).addClass('active');

        // Determine wether to graph the score or input properties.
        var propName = (ind == 'reporting') ? 'input' : 'values';

        var chartTitle = indicator.meta('name');

        // Score indicators have score added to the title.
        if (propName !== 'input') {
            chartTitle = chartTitle + ' score';
        }

        var data = this.model.get('indicators').getGraphData('name', ind, propName);
        $('.drawer .content', this.el).empty().append(templates.CountryDrawer({
            title: indicator.meta('name'),
            chartTitle: chartTitle,
            description: indicator.meta('description'),
            indicator: indicator.get('name'),
            source: indicator.meta('source') || [],
            // We're assuming that all indicators are assigned to either a
            // component or a sector.
            methodologyHash:
                (indicator.meta('component') || indicator.meta('sector')) ?
                'scoringindicators' :
                indicator.meta('index')
        }));

        // Lazy load 5 similar countries.
        // We can't easily determine similar countries from the input values.
        var el = this.el;
        if (propName !== 'input') {
            if (indicator.score({format: false}) == undefined) {
                $('.drawer .similar-countries', el).empty().append(
                    templates.SimilarCountries({
                        similar: false,
                        title: indicator.meta('name')
                    })
                );
            } else {
                $('.drawer .similar-countries', el).css({opacity: 0});
                (new models.IndicatorSummary(
                    {id: indicator.get('name'), years: [indicator.get('currentYear')]}
                )).fetch({
                    success: function(summary) {
                        $('.drawer .similar-countries', el).empty().append(
                            templates.SimilarCountries({
                                similar: summary.similar(country.get('id'), 5),
                                title: indicator.meta('name')
                            })
                        );
                        $('.drawer .similar-countries', el).animate({opacity: 1, duration: 250});
                    }
                });
            }
        }

        if (data && data.length > 1) {
            var rawData = this.model.get('indicators').getRawGraphData('name', ind);
            if (rawData.length) {
                $('.lastReported', el).empty().append('Most recent reported data from ' + _(rawData).last()[0]);
            }
            var graphOptions = {
                el: $('.drawer .content .graph', this.el),
                data: data,
                rawData: rawData
            }
            if (propName == 'input') {
                graphOptions.options= {
                    yaxis: {
                        tickFormatter: function(val, axis) {
                            return models.Indicator.format(val, ind);
                        }
                    }
                }
            }

            new views.Bigline(graphOptions)
        } else {
            $('.drawer .content .graph', this.el).addClass('no-data');
        }
        $('.drawer', this.el).addClass('open');
        this.positionDrawer('drawer');
        return false;
    },
    closeDrawer: function() {
        $('.drawer', this.el).removeClass('open');
        $('.indicator').removeClass('active');
        return false;
    }
});
