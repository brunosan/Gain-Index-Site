view = views.Main.extend({
    events: _.extend({
        'click .drawer .handle a.handle': 'closeDrawer',
        'click table.data tr': 'openDrawer',
    }, views.Main.prototype.events),
    render: function() {
        var data = [],
            sectors = {},
            components = {},
            title = '',
            collection = this.model.get('indicators'),
            meta = collection.model.meta;

        // Arrange our metadata.
        if (!meta[this.model.get('id')]) {
            return this;
        }
        var id = this.model.get('id');
        var active = (id == 'gain') ? {} : {
            path: '/ranking/' + meta[id].index,
            name: meta[meta[id].index].name
        };
        _.each(meta, function(v) {
            if (v.index == meta[id].index) {
                if (v.sector) {
                    sectors[v.sector] = {
                        path: '/ranking/' + v.index + '/' + v.sector,
                        name: meta[v.sector].name
                    };
                }
                if (v.component) {
                    components[v.component] = {
                        path: '/ranking/' + v.index + '/' + v.component,
                        name: meta[v.component].name
                    };
                }
            }
        });

        var comparator = function(index) {
            return index.name;
        };
        components = _.sortBy(components, comparator);
        sectors = _.sortBy(sectors, comparator);

        // Approach the cabinet.
        $(this.el).empty().append(templates.Cabinet());

        // Empty pockets on top.
        $('.top', this.el).empty().append(templates.Ranking({
            indicatorName: this.model.get('subject').meta('name'),
            active: active,
            sectors: sectors,
            components: components
        }));

        this.tableView = new views.RankingTable({
            el: $('table.data', this.el),
            collection: this.model.get('indicators')
        }).render();

        // Some things fall on the floor.
        //
        // TODO not happy at all with how complex this is, nor with the fact
        // fact that I've got a hardcoded list of indicators here and totally
        // rely on the assumption that corrected indicators are afixed with a
        // `_delta`.
        var template = templates.DefaultFloor;
        var corrections = ['gain', 'gain_delta', 'readiness', 'readiness_delta', 'vulnerability', 'vulnerability_delta']
        var subject = this.model.get('subject');
        var locals = {
            title: subject.meta('name'),
            content: subject.meta('description'),
        };

        if (_.indexOf(corrections, subject.id) != -1) {
            template = templates.CorrectionFloor;
            locals.isCorrected = subject.id.slice(-6) == '_delta';
        }
        $('.floor', this.el).empty().append(template(locals));
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
        return this;
    },
    openDrawer: function(ev) {
        $('table.data tr').removeClass('active');
        $(ev.currentTarget).addClass('active');

        var meta = models.Country.meta;
        var id = $(ev.currentTarget).attr('id').substr(8);

        if (!id || !meta[id]) return;

        new views.CountryDetailDrawer({
            el: $('.drawer', this.el),
            model:new models.Country({id: id}),
            indicator: this.model.get('subject')
        });

        $('.drawer', this.el).addClass('open');
        return false;
    },
    closeDrawer: function() {
        $('.drawer', this.el).removeClass('open');
        $('table.data tr').removeClass('active');
        return false;
    }
});
