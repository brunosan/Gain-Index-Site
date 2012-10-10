view = views.Main.extend({
    events: {
        'click .drawer .handle a.handle': 'closeDrawer',
        'click #map-years li a': 'yearClick',
        'click #map-indicators li a': 'indicatorClick',
        'click .floor .correction-control a.correct': 'toggleCorrection',
        'click .featured .country': 'countryClick',
        'click #map-fullscreen': 'fullscreenClick',
        'touchmove .drawer': 'disableEvent',
        'gesturechange .drawer': 'disableEvent'

    },
    initialize: function(options) {
        _.bindAll(this, 'render', 'renderCountryFeature', 'renderFloor', 'setupPanel', 'fullscreenClick');
        this.collection.bind('add', this.renderCountryFeature);
        views.Main.prototype.initialize.call(this, options);
        Bones.user && Bones.user.bind('auth:status', this.setupPanel);
    },
    render: function() {
        // Approach the cabinet.
        $(this.el).empty().append(templates.Cabinet({klass: 'front'}));

        // Empty pockets on top.
        $('.top', this.el).empty().append(templates.Front());

        // Top / Bottom indicators
        var rankTop = [],
            rankBottom = [];
        var ranking = this.model;
        // Toss out non-numeric values like '-'
        var list = _.reject(ranking.list('values', views.App.endYear), function(v) {
            return isNaN(parseFloat(v.value)) 
        });
        rankTop = list.slice(0, 5);
        rankBottom = list.slice(list.length - 5, list.length);
        // Names are extra long, also, format score and add path
        _.map(rankTop, function(value) {
            value.path = models.Country.pathSafe(value.name);
            value.name = value.name.replace('The', '');
            value.value = value.value.substr(0, value.value.length-2);
        });
        _.map(rankBottom, function(value) {
            value.path = models.Country.pathSafe(value.name);
            value.name = value.name.replace('The', '');
            value.value = value.value.substr(0, value.value.length-2);
        });
        $('.ranking', this.el).empty().append(
            templates.RankingTopBottom({
                top: rankTop,
                bottom: rankBottom,
                length: list.length
            })
        );

        this.renderCountryFeature();
        this.renderFloor('gain');
        return this;
    },
    attach: function() {
        views.Main.prototype.attach.call(this);
        var indicator = 'gain',
            year = views.App.endYear,
            view = this;


        this.map = new models.Map({ year: year, indicator: indicator},
            {controls: ['interaction', 'zoomer']});

        this.map.featureClick = function(feature, context, index) {
            var iso = $(feature).data('iso');
            if (iso) {
              return view.openDrawer($(feature).data('iso'));
            }
        }

        // Any time the maps' indicator changes rebuild the floor with the new
        // indicator's info.
        this.map.bind('change:indicator', this.renderFloor);

        var locals = {indicators: [], years: []};
        for (var i = views.App.startYear; i <= views.App.endYear; i++) {
            var item = {year: i, klass: 'year-'+ i};
            if (i == year) {
                item.klass += ' selected';
            }
            locals.years.push(item);
        }

        _.each(['gain', 'readiness', 'vulnerability'], function(id) {
            // TODO grab info from the schema.
            var item = {
                name: models.Indicator.meta[id].name,
                id: id,
                klass: 'indicator-'+id
            };
            if (indicator == id) {
                item.klass += ' selected';
            }
            locals.indicators.push(item);
        });

        $('#map', this.el).append(templates.MapInterface(locals));


        $('#carousel').after("<div id='carousel-nav'>").cycle({
            timeout: 6000,
            delay: 6000,
            pager: '#carousel-nav'
        }).cycle('pause');
        $('#carousel .overview').fadeIn('normal');

        var startedCarousel = false;

        function checkCarousel() {
            function isInView(qs) {
                var win = $(window);
                var el = $(qs);
                var winPos = win.scrollTop() + win.height();
                if (!el.offset()) return false;
                var elPos = el.offset().top + el.height();
                return winPos > elPos;
            }

            if(!startedCarousel && isInView('#carousel') ) {
                startedCarousel = true;
                $('#carousel').cycle('resume');
            }
        }
        checkCarousel();
        $(window).scroll(checkCarousel);

        this.setupPanel();
        return this;
    },
    fullscreenClick: function(e) {
        e.preventDefault();
        this.scrollTop();

        $('body').toggleClass('fullscreen-map');
        this.map.toggleFullscreen();
    },
    disableEvent: function(e) {
        if (this.map.isFullscreen) {
            e.preventDefault();
        }
    },
    setupPanel: function() {
        if (Bones.user && Bones.user.authenticated) {
            Bones.admin.setPanel(
                new views.AdminFrontFeature({collection: this.collection})
            );
        }
        else {
            Bones.admin.setPanel();
        }
    },
    renderCountryFeature: function() {
        // Featured countries
        var that = this;
        $('.featured .countries', this.el).empty();
        this.collection.each(function(model) {
            $('.featured .countries', that.el).append(
                templates.FeaturedFront({
                    path: model.path(),
                    name: model.meta('name'),
                    iso: model.meta('ISO3')
                })
            );
            new views.AboutQuadrantShort({
                el: $('.featured .prose', that.el).last(),
                model: model
            }).render();
            new views.CountrySummary({
                el: $('.featured .country-summary', that.el).last(),
                model: model
            });
        });
    },
    renderFloor: function(id) {
        id = _.isObject(id) ? id.get('indicator') : id;
        var indicator = new models.Indicator({id: id}),
            caption = indicator.meta('map_caption') || 'Countries of the world by ' + indicator.meta('name');
        var locals = {
            title: indicator.meta('name'),
            content: indicator.get('id') == 'gain' ? templates.GaInFloorText() : indicator.meta('description'),
            correction: {
                caption: caption,
                href: '#',
                methodologyLink: '/about/methodology#' +
                    ((indicator.meta('component') || indicator.meta('sector')) ?
                    'scoringindicators' :
                    indicator.meta('index')),
                title: indicator.isCorrection() ?
                    'Remove GDP adjustment' :
                    'Adjust for GDP'
            }
        };
        $('.floor', this.el).empty().append(templates.CorrectionFloor(locals));
    },
    yearClick: function(ev) {
        var e = $(ev.currentTarget);
        e.parents('ul').find('a').removeClass('selected');

        this.map.set({year:e.addClass('selected').text()});
        this.noDrawer = true;
        return false;
    },
    indicatorClick: function(ev) {
        var e = $(ev.currentTarget),
            indicator = '';

        e.parents('ul').find('a').removeClass('selected')
        e.addClass('selected');

        // Tear indicator id out of class...
        _.each(e.attr('class').split(' '), function(v) {
            if (v.slice(0, 10) === 'indicator-') {
                indicator = v.slice(10);
            }
        });
        $('.legend', this.el).removeClass('active');
        $('.legend.' + indicator, this.el).addClass('active');
        this.map.set({indicator: indicator});
        this.noDrawer = true;
        return false;
    },
    countryClick: function(ev) {
        var path = '/country/' + models.Country.pathSafe($(ev.currentTarget).attr('id'));
        return views.App.route(path);
    },
    toggleCorrection: function() {
        // Currently toggling between indicators is as simple as adding or
        // removing a `_delta` suffix. If this becomes more complex we'll need
        // a mapping.
        var indicator = this.map.get('indicator');
        if (indicator.slice(-6) === '_delta') {
            this.map.set({indicator: indicator.slice(0, -6)});
        } else {
            this.map.set({indicator: indicator + '_delta'});
        }
        return false;
    },
    openDrawer: function(iso3) {
        // Neither stopPropagation() nor preventDefault() seem to have effect
        // when the click is over the map. So we use this `noDrawer` flag to
        // stop the drawer from opening. This only works because it appears
        // that our click handers fire before the drawer get's opened.
        if (this.noDrawer != undefined) {
            delete this.noDrawer;
            return;
        }

        var view = this;

        new views.CountryDetailDrawer({
            el: $('.drawer', this.el),
            model:new models.Country({id: iso3}),
            indicator: new models.Indicator({id: this.map.get('indicator')}),
            callback: function() { $('.drawer', view.el).addClass('open'); }
        });
    },
    closeDrawer: function() {
        $('.drawer', this.el).removeClass('open');
        return false;
    }
});
