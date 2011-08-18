view = views.Main.extend({
    render: function() {
        // Approach the cabinet.
        $(this.el).empty().append(templates.Cabinet());

        // Empty pockets on top.
        $('.top', this.el).empty().append(templates.Front());

        // Featured countries
        $('.featured.countries', this.el).empty();
        var that = this;
        _.each([this.model.featuredFirst, this.model.featuredSecond], function(model) {
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
    attach: function() {
        var currentCountry = '', tilejson = {
            tilejson: '1.0.0',
            scheme: 'tms',
            tiles: ['http://localhost:3001/1.0.0/gain-2010/{z}/{x}/{y}.png'],
            grids: ['http://localhost:3001/1.0.0/gain-2010/{z}/{x}/{y}.grid.json'],
            formatter: function(options, data) {
                return '<span data-iso="' + data.iso_a3 + '">' + data.admin + '</span>';
            }
        }, current_indicator = 'gain', current_year = 2010, swapMap = function() {
            tilejson.tiles[0] = 'http://localhost:3001/1.0.0/' + current_indicator + '-' + current_year + '/{z}/{x}/{y}.png';
            tilejson.grids[0] = 'http://localhost:3001/1.0.0/' + current_indicator + '-' + current_year + '/{z}/{x}/{y}.grid.json';
            m.setProvider(new wax.mm.connector(tilejson));
        }, indicators = {
            // Human: machine
            'GaIn': 'gain',
            'Readiness': 'readiness',
            'Vulnerability': 'vulnerability',
        };

        var mm = com.modestmaps,
            m = new mm.Map('map',
            new wax.mm.connector(tilejson),
            new mm.Point(635,490));

        wax.mm.fullscreen(m, tilejson).appendTo(m.parent);
        var tooltip = wax.tooltip;
        tooltip.prototype.click = function(feature, context, index) {
            window.location = '/country/' + $(feature).data('iso');
        }
        wax.mm.interaction(m, tilejson, {
            callbacks: new tooltip,
        });

        m.setCenterZoom(new mm.Location(39, -98), 2);
        var ul = $('<ul id="map-years" class="map-selector">');
        for (i = 1995; i <= 2010; i++) {
            var li = $('<li><a href="#"></a></li>').addClass('year-' + i).find('a').text(i).click(function() {
                $(this).parents('ul').find('a').removeClass('selected');
                current_year = $(this).addClass('selected').text();
                swapMap();
                return false;
            }).end();
            ul.append(li);
        };
        $('#map').append(ul
            .find('li:first a').addClass('first').end()
            .find('li:last a').addClass('last').end()
            .find('li.year-' + current_year + ' a').addClass('selected').end());

        ul = $('<ul id="map-indicators" class="map-selector"></ul>');
        _.each(indicators, function(machine, human) {
            var li = $('<li><a href="#"></a></li>').addClass('indicator-' + machine).find('a').text(human).click(function() {
                $(this).parents('ul').find('a').removeClass('selected').end().end().addClass('selected');
                current_indicator = machine;
                swapMap();
                return false;
            }).end();
            ul.append(li);
        });
        $('#map').append(ul
            .find('li:first a').addClass('first').end()
            .find('li:last a').addClass('last').end()
            .find('li.indicator-' + current_indicator + ' a').addClass('selected').end());

        return this;
    }
});
