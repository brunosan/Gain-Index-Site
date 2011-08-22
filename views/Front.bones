view = views.Main.extend({
    events: {
        'click .drawer .handle a.handle': 'closeDrawer',
        'click #map-years li a': 'yearClick',
        'click #map-indicators li a': 'indicatorClick',
        'click .floor .correction-control input': 'toggleCorrection',
        'click .featured': 'featureClick'
    },
    initialize: function(options) {
        _.bindAll(this, 'render'); 
        this.model.bind('add', this.render, this);
        views.Main.prototype.initialize.call(this, options);
    },
    render: function() {
        // Approach the cabinet.
        $(this.el).empty().append(templates.Cabinet());

        // Empty pockets on top.
        $('.top', this.el).empty().append(templates.Front());

        var topBottom = [];
        // For best and worst indicators list. 
        // @TODO move fetch to router?
        // @TODO add to DOM.
        (new models.IndicatorSummary(
            {id: 'gain'}, {years: [2009]}
        )).fetch({
            success: function(summary) {
                var list = summary.list('values', 2009);
                // Hash-like access.
                var i = 0; while (topBottom.length < 5) {
                    // Make sure value is a number; '-' exists as some values.
                    !isNaN(parseFloat(list[i].value)) 
                      && topBottom.push(list[i]);
                    i++;
                }
                var i = 1; while (topBottom.length < 10) {
                    !isNaN(parseFloat(list[list.length - i].value)) 
                      && topBottom.push(list[list.length - i]);
                    i++;
                }
                topBottom.sort(function(a, b) { return b.value - a.value} );
            }
        });

        // Featured countries
        var that = this;
        this.model.each(function(model) {
            $('.featured .countries', that.el).append(
                templates.FeaturedFront({
                    name: model.meta('name'),
                    iso: model.meta('ISO3')
                })
            );
            new views.AboutQuadrantShort({
                el: $('.featured .prose', that.el).last(),
                model: model,
            }).render();
            new views.CountrySummary({
                el: $('.featured .country-summary', that.el).last(),
                model: model,
            }).render();
        });
 
        // Some things fall on the floor.
        var gain = new models.Indicator({id: 'gain'});
        $('.floor', this.el).empty().append(templates.CorrectionFloor({
            title: gain.meta('name'),
            content: gain.meta('description'),
            isCorrected: false
        }));

        return this;
    },
    featureClick: function() {
        if (Bones.user.authenticated) {
            new views.AdminPopupFrontFeature({
                title: 'Change featured countries on front page',
                documentType: 'front',
                pathPrefix: '/front/',
                model: new models.Front({id: 'front'}),
                collection: this.model
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
        this.map.bind('change:indicator', function(model) {
            var id = model.get('indicator'),
                corrected = id.slice(-6) == '_delta';

            // Don't show the definition for delta...
            id = (corrected ? id.slice(0, -6) : id);

            var indicator = new models.Indicator({id: id});
            $('.floor', this.el).empty().append(templates.CorrectionFloor({
                title: indicator.meta('name'),
                content: indicator.meta('description'),
                isCorrected: corrected 
            }));
        });

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
