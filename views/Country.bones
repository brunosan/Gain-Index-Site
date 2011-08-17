view = views.Main.extend({
    events: _.extend({
        'click ul.tabs li a': 'selectTab',
        'click table.data tr': 'openDrawer',
        'click .drawer .handle a': 'closeDrawer'
    }, views.Main.prototype.events),
    render: function() {
        var lookup = {},
            title = '',
            summary = {},
            pin = {},
            indicators = {};
            collection = this.model.get('indicators'),
            meta = collection.model.meta;


        // Build a look up table for the data.
        // TODO move this to the collection.
        collection.each(function(m) {
            lookup[m.get('name')] = m;
        });

        // The summary information needs to be done manually.
        _.each(['gain', 'readiness', 'vulnerability'], function(k) {
            if (!title) title = lookup[k].escape('country');
            if (lookup.hasOwnProperty(k)) {
                summary[k] = {
                    name: meta[k].name,
                    value: lookup[k].score(),
                    raw: lookup[k].score({format: false})
                };
            }
        });
        if (summary.readiness && summary.vulnerability) {
            pin.x = Math.round((summary.readiness.raw * 80) + 15);
            pin.y = 80 - Math.round(summary.vulnerability.raw * 80);
        }

        // GDP and Population data.  Assumes we want the latest year, and that both
        // GDP and Pop latest year will be the same year (see template).
        var gdp = {}; var pop = {};
        var gdpLatest = _.last(collection.getGraphData('name', 'gdp'));
        var popLatest = _.last(collection.getGraphData('name', 'pop'));
        if (gdpLatest instanceof Array) {
            gdp.val = this.numberFormat(gdpLatest[1], 2, '.', ',');
            gdp.yr = gdpLatest[0];
        } else {
            gdp.val = gdp.yr = 'Unknown';
        }
        if (popLatest instanceof Array) {
            pop.val = this.numberFormat(popLatest[1], 0, '.', ',');
            pop.yr = popLatest[0];
        } else {
            pop.val = pop.yr = 'Unknown';
        }
        // Determine year of data
        var bgdYear = (gdp.yr != 'Unknown' ? gdp.yr : pop.yr);
        
        // Approach the cabinet.
        $(this.el).empty().append(templates.Cabinet());
        // Empty pockets on top.
        $('.top', this.el).empty().append(templates.Country({
            title: title,
            summary: summary,
            rank: lookup.gain.get('rank'),
            tabs: indicators,
            pin: pin,
            gdp: gdp,
            pop: pop,
            bgdYear: bgdYear
        }));

        this.aboutView = new views.AboutQuadrant({
            el: $('.prose', this.el),
            model: this.model
        }).render();


        // Some things fall on the floor.
        $('.floor', this.el).empty().append(templates.DefaultFloor());

        if (this.tableView == undefined) {
            this.tableView = new views.CountryTable({
                el: $('table#country-data', this.el),
                collection: this.model.get('indicators')
            });
        }
        this.tableView.render();
        return this;
    },
    attach: function() {
        if (this.tableView == undefined) {
            this.tableView = new views.CountryTable({
                el: $('table.data', this.el),
                collection: this.model.get('indicators')
            });
        }
        this.tableView.attach();
        return this;
    },
    selectTab: function(ev) {
        var e = $(ev.currentTarget);

        $('ul.tabs li.active', this.el).removeClass('active');
        e.parents('li').addClass('active');
        e.parents('div:first').siblings('ul').find('li:first').addClass('active');
        
        this.tableView.options.tab = 'vulnerability';
        this.tableView.options.structure = 'components';
        if (e.hasClass('readiness')) {
            this.tableView.options.tab = 'readiness';
        }
        if (e.hasClass('sectors')) {
            this.tableView.options.structure = 'sectors';
        }

        this.tableView.render().attach();
        return false;
    },
    openDrawer: function(ev) {
        $('table.data tr').removeClass('active');
        $(ev.currentTarget).addClass('active');
        var ind = $(ev.currentTarget).attr('id').substr(10);;
        if (!ind) return;

        var collection = this.model.get('indicators');
        var data = collection.getGraphData('name', ind);

        var collection = this.model.get('indicators');
        var meta = collection.model.meta[ind];
        if (meta != undefined) {
            $('.drawer .content', this.el).empty().append(templates.CountryDrawer({
                title: meta.name,
                content: meta.description,
                indicator: meta.id
            }));

            if (data && data.length > 1) {
                new views.Bigline({
                    el: $('.drawer .content .graph', this.el),
                    data: data
                })
            } else {
                $('.drawer .content .graph', this.el).hide();
            }
            $('.drawer', this.el).addClass('open');
        }
        return false;
    },
    closeDrawer: function() {
        $('.drawer', this.el).removeClass('open');
        $('table.data tr').removeClass('active');
        return false;
    },
    // From StackOverflow http://is.gd/sR4ygY
    numberFormat: function(n, decimals, decimal_sep, thousands_sep) { 
        var c = isNaN(decimals) ? 2 : Math.abs(decimals),
            d = decimal_sep || ',',
            t = (typeof thousands_sep === 'undefined') ? '.' : thousands_sep,
            sign = (n < 0) ? '-' : '',
            i = parseInt(n = Math.abs(n).toFixed(c)) + '', 
            j = ((j = i.length) > 3) ? j % 3 : 0; 
            return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ''); 
    }
});