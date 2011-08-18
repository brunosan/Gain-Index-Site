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
        var tilejson = {
            tilejson: '1.0.0',
            scheme: 'tms',
            tiles: ['http://localhost:3001/1.0.0/gain-2010/{z}/{x}/{y}.png']
        }, current_indicator = 'gain', current_year = 2010, swapMap = function() {
            tilejson.tiles[0] = 'http://localhost:3001/1.0.0/' + current_indicator + '-' + current_year + '/{z}/{x}/{y}.png';
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
        $(map).append(ul
            .find('li:first a').addClass('first').end()
            .find('li:last a').addClass('last').end()
            .find('li.year-' + current_year + ' a').addClass('selected').end());

        ul = $('<ul id="map-indicators" class="map-selector"></ul>');
        _.each(indicators, function(machine, human) {
            console.log(human, machine)
            var li = $('<li><a href="#"></a></li>').addClass('indicator-' + machine).find('a').text(human).click(function() {
                $(this).parents('ul').find('a').removeClass('selected').end().end().addClass('selected');
                current_indicator = machine;
                swapMap();
                return false;
            }).end();
            ul.append(li);
        });
        $(map).append(ul
            .find('li:first a').addClass('first').end()
            .find('li:last a').addClass('last').end()
            .find('li.indicator-' + current_indicator + ' a').addClass('selected').end());

        return this;
    }
});
