view = views.Main.extend({
    events: _.extend({
        'click .drawer .handle a.handle': 'closeDrawer',
        'click table.data tr': 'openDrawer'
    }, views.Main.prototype.events),
    initialize: function(options) {
        _.bindAll(this, 'render', 'attach');

        if (options.trends) {
            var trendType = this.model.get('id');
            this.trends = options.trends.get('indicators').reduce(function(result, m) {
                var trend = m.trend(trendType);
                if (trend) result[m.get('ISO3')] = trend;
                return result;
            }, {});
        }

        views.Main.prototype.initialize.call(this, options);
    },
    render: function() {
        var data = [],
            sectors = {},
            components = {},
            title = '',
            collection = this.model.get('indicators'),
            meta = collection.model.meta,
            path = models.Ranking.path;

        // Arrange our metadata.
        if (!meta[this.model.get('id')]) {
            return this;
        }

        var id = this.model.get('id');
        _.each(meta, function(v) {
            if (v.index == meta[id].index) {
                if (v.sector) {
                    sectors[v.sector] = {
                        path: path(v.sector),
                        name: meta[v.sector].name
                    };
                }
                if (v.component) {
                    components[v.component] = {
                        path: path(v.component),
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
        var active = (components.length + sectors.length) > 1 ? {
            path: path(meta[id].index),
            name: meta[meta[id].index].name
        } : {};

        // Approach the cabinet.
        $(this.el).empty().append(templates.Cabinet({klass: 'ranking'}));

        // Empty pockets on top.
        $('.top', this.el).empty().append(templates.Ranking({
            indicatorName: this.model.get('subject').meta('name'),
            active: active,
            current: views.App.endYear,
            sectors: sectors,
            components: components,
            delta: this.model.get('subject').isCorrection()
        }));

        this.tableView = new views.RankingTable({
            el: $('table.data', this.el),
            indicatorName: id,
            trends: this.trends,
            collection: this.model.get('indicators')
        }).render();

        this.renderFloor();
        this.pageTitle = this.model.get('subject').meta('name') + " rankings";
        return this;
    },
    attach: function() {
        views.Main.prototype.attach.call(this);
        var view = this;

        if (this.tableView == undefined) {
            this.tableView = new views.RankingTable({
                el: $('table.data', this.el),
                collection: this.model.get('indicators'),
                trends: this.trends
            });
        }
        return this;
    },
    renderFloor: function() {
        var template = templates.DefaultFloor;
        var subject = this.model.get('subject');
        var locals = {
            title: subject.meta('name'),
            content: subject.get('id') == 'gain' ? templates.GaInFloorText() : subject.meta('description'),
            methodologyLink: '/about/methodology#' +
                ((subject.meta('component') || subject.meta('sector')) ?
                'scoringindicators' :
                subject.meta('index'))
        };
        if (subject.hasCorrection() || subject.isCorrection()) {
            var path = models.Ranking.path(subject.uncorrected()),
                caption = subject.meta('ranking_caption') || 'World wide ranking by ' + subject.meta('name');
            template = templates.CorrectionFloor;
            if (subject.isCorrection()) {
                locals.correction = {
                    caption: caption,
                    href: path == '/ranking/gain' ? '/ranking' : path,
                    methodologyLink: '/about/methodology#' +
                        ((subject.meta('component') || subject.meta('sector')) ?
                        'scoringindicators' :
                        subject.meta('index')),
                    title: 'Remove GDP adjustment'
                };
            } else {
                locals.correction = {
                    caption: caption,
                    href: path.replace('/ranking', '/ranking/delta'),
                    methodologyLink: '/about/methodology#' +
                        ((subject.meta('component') || subject.meta('sector')) ?
                        'scoringindicators' :
                        subject.meta('index')),
                    title: 'Adjust for GDP'
                };
            }
        }
        $('.floor', this.el).empty().append(template(locals));
    },
    openDrawer: function(ev) {
        $('table.data tr').removeClass('active');
        $(ev.currentTarget).addClass('active');

        var view = this;
        var meta = models.Country.meta;
        var id = $(ev.currentTarget).attr('id').substr(8);

        if (!id || !meta[id]) return;

        new views.CountryDetailDrawer({
            el: $('.drawer', this.el),
            model: new models.Country({id: id}),
            indicator: this.model.get('subject'),
            callback: function() {
                $('.drawer', view.el).addClass('open');
            }
        });
        this.positionDrawer('drawer');
        return false;
    },
    closeDrawer: function() {
        $('.drawer', this.el).removeClass('open');
        $('table.data tr').removeClass('active');
        return false;
    }
});
