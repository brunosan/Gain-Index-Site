view = views.Main.extend({
    events: _.extend({
        'click .drawer .handle a.handle': 'closeDrawer',
        'click table.data a.handle': 'openDrawer',
    }, views.Main.prototype.events),
    initialize: function() {
        views.Main.prototype.initialize.apply(this, arguments);
    },
    render: function() {
        var data = [],
            sectors = {},
            indices = {},
            components = {},
            title = '',
            collection = this.model.get('indicators');

        // Arrange our metadata.
        var meta = collection.model.prototype.meta[this.model.get('id')];
        if (!meta) return this; // should be a 404

        _.each(collection.model.prototype.meta, function(v) {
            indices[v.index] = true;
            if (v.index == meta.index) {
                if (v.sector) {
                    sectors[v.sector] = true;
                }
                if (v.component) {
                    components[v.component] = true;
                }
            }
        });

        components = _.keys(components).sort();
        sectors = _.keys(sectors).sort();
        indices = _.keys(indices).sort();

        // Approach the cabinet.
        $(this.el).empty().append(templates.Cabinet());

        // Empty pockets on top.
        $('.top', this.el).empty().append(templates.Ranking({
            indicatorName: meta.name,
            activeIndex: meta.index,
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
        var id = $(ev.currentTarget).parents('tr').attr('id').substr(8);
        if (!id) return;

        var data = this.model.get('indicators').getGraphData('ISO3', id);

        $('.drawer .content', this.el).empty().append(templates.RankingDrawer({
            title: id,
            country: id
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
