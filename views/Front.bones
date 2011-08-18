view = views.Main.extend({
    render: function() {
        // Approach the cabinet.
        $(this.el).empty().append(templates.Cabinet());

        // Empty pockets on top.
        $('.top', this.el).empty().append(templates.Front());

        // Featured countries
        var that = this;
        var countries = [];

        _.each([this.model.featuredFirst, this.model.featuredSecond], function(model) {
            var pin = {}; var info = {};
            info.name = models.Country.meta[model.get('id')].name;
            info.nameLower = info.name.toLowerCase();
            info.countryInfo = {};
            var collection = model.get('indicators');
            var indicators = ['gain', 'vulnerability', 'readiness'];
            
            _.each(indicators, function(i) {
                info.countryInfo[i] = {};
                var data = collection.getGraphData('name', i);
                if (data instanceof Array) {
                    info.countryInfo[i].name = i;
                    info.countryInfo[i].value = _.last(data)[1].toFixed(2);
                }
            });
            if (info.countryInfo['readiness'] && info.countryInfo['vulnerability']) {
                pin.x = Math.round((info.countryInfo['readiness'].value * 80) + 15);
                pin.y = 80 - Math.round(info.countryInfo['vulnerability'].value * 80);
                info.pin = pin;
            }
            countries.push(info);
        });

        $('.featured', this.el).empty().append(templates.FeaturedFront({
            countries: countries
        }));

        _.each([this.model.featuredFirst, this.model.featuredSecond], function(model) {
            new views.AboutQuadrant({
                el: $('.description.' + models.Country.meta[model.get('id')].name.toLowerCase(), that.el),
                model: model
            }).render();
        });
 
        // Some things fall on the floor.
        $('.floor', this.el).empty().append(templates.DefaultFloor());

        return this;
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
            // todo 'first', 'last' classes
            locals.years.push(item);
        }

        _.each(['gain', 'readiness', 'vulnerability'], function(id) {
            // TODO grab info from the schema.
            var item = {name: id, id: id};
            if (indicator == id) {
                item.klass += ' selected';
            }
            // todo 'first', 'last' classes
            locals.indicators.push(item);
        });

        $('#map', this.el).append(templates.MapInterface(locals));
    },
    initMap: function(options) {
        // TODO find a better place to stash the current year and current
        // indicator for our click handlers.
        this.currentIndicator = options.indicator;
        this.currentYear = options.year;

        var tilejson = {
            tilejson: '1.0.0',
            scheme: 'tms',
            tiles: ['http://localhost:3001/1.0.0/'+ options.indicator+'-'+options.year+'/{z}/{x}/{y}.png'],
            grids: ['http://localhost:3001/1.0.0/'+ options.indicator+'-'+options.year+'/{z}/{x}/{y}.grid.json'],
            formatter: function(options, data) {
                return '<span data-iso="' + data.iso_a3 + '">' + data.admin + '</span>';
            }
        };

        var mm = com.modestmaps,
            m = new mm.Map('map', new wax.mm.connector(tilejson), new mm.Point(635,490));

        wax.mm.fullscreen(m, tilejson).appendTo(m.parent);

        var tooltip = wax.tooltip;
        tooltip.prototype.click = function(feature, context, index) {
            // TODO open drawer.
            window.location = '/country/' + $(feature).data('iso');
        }
        wax.mm.interaction(m, tilejson, {callbacks: new tooltip });

        m.setCenterZoom(new mm.Location(39, -98), 2);
        return m;
    },
    swapMap: function(options) {
        var year = options.year || this.currentYear,
            indicator = options.indicator || this.currentIndicator;

        // TODO localhost won't do here...
        tilejson.tiles[0] = 'http://localhost:3001/1.0.0/' + indicator + '-' + year + '/{z}/{x}/{y}.png';
        tilejson.grids[0] = 'http://localhost:3001/1.0.0/' + indicator + '-' + year + '/{z}/{x}/{y}.grid.json';
        this.map.setProvider(new wax.mm.connector(tilejson));
    },
    yearClick: function(ev) {
        var e = $(ev.currentTarget);
        e.parents('ul').find('a').removeClass('selected');
        var year = e.addClass('selected').text();
        this.swapMap({year: year});
        return false;
    },
    indicatorClick: function(ev) {
        var e = $(ev.currentTarget);
        e.parents('ul').find('a').removeClass('selected')
        e.addClass('selected');
        // TODO tear indicator id out of class...
        console.log(e.attr('class'));
        var indicator = 'foo';
        this.swapMap({indicator: indicator});
        return false;
    }
});
