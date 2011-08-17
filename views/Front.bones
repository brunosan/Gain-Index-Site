view = views.Main.extend({
    render: function() {
        // Approach the cabinet.
        $(this.el).empty().append(templates.Cabinet());

        // Empty pockets on top.
        $('.top', this.el).empty().append(templates.Front());

        // Featured countries
        var that = this;
        var countries = [];
        var models = [this.model.featuredFirst, this.model.featuredSecond];
        _.each(models, function(model) {
            var pin = {}; var info = {};
            var collection = model.get('indicators');
            var indicators = ['gain', 'vulnerability', 'readiness'];
            _.each(indicators, function(i) {
                info[i] = {};
                var data = collection.getGraphData('name', i);
                if (data instanceof Array) {
                    info[i].name = i;
                    info[i].value = _.last(data)[1];
                }
            });
            if (info['readiness'] && info['vulnerability']) {
                pin.x = Math.round((info['readiness'].value * 80) + 15);
                pin.y = 80 - Math.round(info['vulnerability'].value * 80);
                info.pin = pin;
            }
            countries.push(info);
        });
        // @TODO add in the country description
        $('.featured', that.el).empty().append(templates.FeaturedFront({
            countries: countries
            //rank: lookup.gain.get('rank'),
        }));
 
        // Some things fall on the floor.
        $('.floor', this.el).empty().append(templates.DefaultFloor());

        return this;
    },
});
