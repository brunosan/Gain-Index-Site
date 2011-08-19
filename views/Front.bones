view = views.Main.extend({
    events: {
        'click #map-years li a': 'yearClick',
        'click #map-indicators li a': 'indicatorClick',
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

        // Featured countries
        $('.featured.countries', this.el).empty();
        var that = this;
        this.model.each(function(model) {
            $('.featured .countries', that.el).append(
                templates.FeaturedFront({name: model.meta('name')})
            );
            new views.AboutQuadrant({
                el: $('.featured .prose', that.el).last(),
                model: model
            }).render();
            new views.CountrySummary({
                el: $('.featured .country-summary', that.el).last(),
                model: model
            }).render();
        });
 
        // Some things fall on the floor.
        $('.floor', this.el).empty().append(templates.DefaultFloor());

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
            year = 2010;

        this.map = this.initMap({indicator: indicator, year: year}); 

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
    initMap: function(options) {
        // TODO find a better place to stash the current year, current
        // indicator and tilejson for our click handlers.
        this.currentIndicator = options.indicator;
        this.currentYear = options.year;
        this.tilejson = {
            tilejson: '1.0.0',
            scheme: 'tms',
            tiles: ['http://'+ location.hostname +':3001/1.0.0/'+ options.indicator+'-'+options.year+'/{z}/{x}/{y}.png'],
            grids: ['http://'+ location.hostname +':3001/1.0.0/'+ options.indicator+'-'+options.year+'/{z}/{x}/{y}.grid.json'],
            formatter: function(options, data) {
                return '<span data-iso="' + data.iso_a3 + '">' + data.admin + '</span>';
            }
        };

        var mm = com.modestmaps,
            m = new mm.Map('map', new wax.mm.connector(this.tilejson), new mm.Point(635,490));

        wax.mm.fullscreen(m, this.tilejson).appendTo(m.parent);

        var tooltip = wax.tooltip;
        tooltip.prototype.click = function(feature, context, index) {
            // TODO open drawer.
            window.location = '/country/' + $(feature).data('iso');
        }
        wax.mm.interaction(m, this.tilejson, {callbacks: new tooltip });

        m.setCenterZoom(new mm.Location(39, -98), 2);
        return m;
    },
    swapMap: function(options) {
        var year = options.year || this.currentYear,
            indicator = options.indicator || this.currentIndicator;

        this.tilejson.tiles[0] = 'http://'+ location.hostname +':3001/1.0.0/' + indicator + '-' + year + '/{z}/{x}/{y}.png';
        this.tilejson.grids[0] = 'http://'+ location.hostname +':3001/1.0.0/' + indicator + '-' + year + '/{z}/{x}/{y}.grid.json';
        this.map.setProvider(new wax.mm.connector(this.tilejson));
    },
    yearClick: function(ev) {
        var e = $(ev.currentTarget);
        e.parents('ul').find('a').removeClass('selected');
        var year = e.addClass('selected').text();
        this.swapMap({year: year});
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
        this.swapMap({indicator: indicator});
        return false;
    }
});
