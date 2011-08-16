view = views.Main.extend({
    events: _.extend({
        'click .drawer .handle a.handle': 'closeDrawer',
        'click table.data a.handle': 'openDrawer',
    }, views.Main.prototype.events),
    render: function() {
        var data = [],
            sectors = {},
            indices = {},
            components = {},
            title = '',
            collection = this.model.get('indicators');

        // Arrange our metadata.
        var meta = collection.model.meta[this.model.get('id')];
        if (!meta) return this; // should be a 404

        _.each(collection.model.meta, function(v) {
            indices[v.index] = {
                id: v.index,
                name: collection.model.meta[v.index].name
            };
            if (v.index == meta.index) {
                if (v.sector) {
                    sectors[v.sector] = {
                        id: v.sector,
                        name: collection.model.meta[v.sector].name
                    };
                }
                if (v.component) {
                    components[v.component] = {
                        id: v.component,
                        name: collection.model.meta[v.component].name
                    };
                }
            }
        });

        var comparator = function(index) {
            return index.name;
        };
        components = _.sortBy(components, comparator);
        sectors = _.sortBy(sectors, comparator);
        indices = _.sortBy(indices, comparator);

        // Approach the cabinet.
        $(this.el).empty().append(templates.Cabinet());

        // Empty pockets on top.
        $('.top', this.el).empty().append(templates.Ranking({
            indicatorName: meta.name,
            indices: indices,
            sectors: sectors,
            components: components
        }));

        this.tableView = new views.RankingTable({
            el: $('table.data', this.el),
            collection: this.model.get('indicators')
        }).render();

        // Some things fall on the floor.
        $('.floor', this.el).empty().append(templates.RankingFloor({
            title: meta.name,
            content: '<p>' + meta.description + '</p>'
        }));
        return this;
    },
    attach: function() {
        var view = this;

        if (this.tableView == undefined) {
            this.tableView = new views.RankingTable({
                el: $('table.data', this.el),
                collection: this.model.get('indicators')
            });
        }
        this.tableView.attach();
    },
    openDrawer: function(ev) {
        var meta = models.Country.meta;
        var id = $(ev.currentTarget).parents('tr').attr('id').substr(8);
        if (!id || !meta[id]) return;

        var data = this.model.get('indicators').getGraphData('ISO3', id);

        $('.drawer .content', this.el).empty().append(templates.RankingDrawer({
            countryName: meta[id].name,
            indicatorName: models.Indicator.meta[this.model.id].name,
            countryId: id
        }));

        if (data.length > 1) {
            new views.Bigline({
                el:$('.drawer .content .graph', this.el),
                data:data
            });
        } else {
            $('.drawer .content .graph', this.el).hide();
        }
        $('.drawer', this.el).addClass('open');
        return false;
    },
    closeDrawer: function() {
        $('.drawer', this.el).removeClass('open');
        return false;
    }
});
