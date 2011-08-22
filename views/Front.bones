view = views.Main.extend({
    events: {
        'click .drawer .handle a.handle': 'closeDrawer',
        'click #map-years li a': 'yearClick',
        'click #map-indicators li a': 'indicatorClick',
        'click .floor .correction-control a': 'toggleCorrection',
        'click .featured': 'featureClick'
    },
    initialize: function(options) {
        _.bindAll(this, 'render', 'renderFloor'); 
        this.collection.bind('add', this.render);
        views.Main.prototype.initialize.call(this, options);
    },
    render: function() {
        // Approach the cabinet.
        $(this.el).empty().append(templates.Cabinet());

        // Empty pockets on top.
        $('.top', this.el).empty().append(templates.Front());

        // Top / Bottom indicators
        var rankTop = [],
            rankBottom = [];
        var ranking = this.model;
        // Toss out non-numeric values like '-'
        var list = _.reject(ranking.list('values', 2009), function(v) { return isNaN(parseFloat(v.value)) });
        rankTop = list.slice(0, 5);
        rankBottom = list.slice(list.length - 5, list.length);
        // Names are extra long, also, format score
        _.map(rankTop, function(value) {
            value.name = value.name.replace('The', '');
            value.value = value.value.substr(0, value.value.length-2);
        });
        _.map(rankBottom, function(value) {
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

        // Featured countries
        var that = this;
        this.collection.each(function(model) {
            $('.featured .countries', that.el).append(
                templates.FeaturedFront({
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
        this.renderFloor('gain');
        return this;
    },
    featureClick: function() {
        if (Bones.user.authenticated) {
            new views.AdminPopupFrontFeature({
                title: 'Change featured countries on front page',
                documentType: 'front',
                pathPrefix: '/front/',
                model: new models.Front({id: 'front'}),
                collection: this.collection
            });
        }
    },
    attach: function() {
        var indicator = 'gain',
            year = 2010,
            view = this;

        this.map = new models.Map({year: year, indicator: indicator});
        this.map.featureClick = function(feature, context, index) {
            return view.openDrawer($(feature).data('iso'));
        }

        // Any time the maps' indicator changes rebuild the floor with the new
        // indicator's info.
        this.map.bind('change:indicator', this.renderFloor);

        var locals = {indicators: [], years: []};
        for (var i = 1995; i <= 2010; i++) {
            var item = {year: i, klass: 'year-'+ i};
            if (i == year) {
                item.klass += ' selected';
            }
            locals.years.push(item);
        }

        _.each(['gain', 'readiness', 'vulnerability'], function(id) {
            // TODO grab info from the schema.
            var item = {name: id, id: id, klass: 'indicator-'+id};
            if (indicator == id) {
                item.klass += ' selected';
            }
            locals.indicators.push(item);
        });

        $('#map', this.el).append(templates.MapInterface(locals));

        return this;
    },
    renderFloor: function(id) {
        id = _.isObject(id) ? id.get('indicator') : id;
        var indicator = new models.Indicator({id: id});
        var locals = {
            title: indicator.meta('name'),
            content: indicator.meta('description'),
            correction: {
                caption: 'Countries of the world by ' + indicator.meta('name'),
                href: '#',
                title: indicator.isCorrection() ?
                    'Remove GDP correction' :
                    'Correct for GDP'
            }
        };
        $('.floor', this.el).empty().append(templates.CorrectionFloor(locals));
    },
    yearClick: function(ev) {
        var e = $(ev.currentTarget);
        e.parents('ul').find('a').removeClass('selected');

        this.map.set({year:e.addClass('selected').text()});
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
        this.map.set({indicator: indicator});
        return false;
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
        new views.CountryDetailDrawer({
            el: $('.drawer', this.el),
            model:new models.Country({id: iso3}),
            indicator: new models.Indicator({id: this.map.get('indicator')})
        });
        $('.drawer', this.el).addClass('open');
    },
    closeDrawer: function() {
        $('.drawer', this.el).removeClass('open');
        return false;
    }
});
