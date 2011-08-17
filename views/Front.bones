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
                    info.countryInfo[i].value = _.last(data)[1];
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
            this.aboutView = new views.AboutQuadrant({
                el: $('.description .' + models.Country.meta[model.get('id')].name.toLowerCase(), that.el),
                model: model
            }).render();
        });
 
        // Some things fall on the floor.
        $('.floor', this.el).empty().append(templates.DefaultFloor());

        return this;
    },
});