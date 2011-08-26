view = views.Main.extend({
    events: {
        'click ul.year-selector li a': 'yearSelect',
        'click a.play-button': 'yearsGo'
    },
    render: function() {
        $(this.el).empty().append(templates.Cabinet({klass: 'matrix'}));
        var gain = new models.Indicator({id: 'gain'});
        $('.floor', this.el).empty().append(templates.DefaultFloor({
            title: gain.meta('name'),
            content: gain.meta('description')
        }));
        $('.top', this.el).empty().append(templates.Matrix());
        return this;
    },
    attach: function() {
        var view = this,
            data = {};
            map = {};
            countries = {};

        this.countryOrder = {};
        this.data = data;

        for (var i = 1995; i <= 2010; i++) {
            data[i] = [];
            map[i] = {};
        }

        _({readiness: 'x', vulnerability: ['y']}).each(function(axis, series) {
            view.options[series].get('indicators').each(function(v) {
                _(v.get('values')).each(function(d, y) {
                    var iso = v.get('ISO3');
                    if (countries[iso] == undefined) {
                      countries[iso] = iso;
                    }

                    if (map[y][iso] == undefined) {
                        // TODO probably want more than just iso...
                        var item = {
                            iso: iso
                        };
                        map[y][iso] = item;
                        data[y].push(item);
                    }

                    // The Scale of things here is non-obvious.
                    // * Readiness range accounting for std dev is 0.1 - 0.9
                    // * Vulnerability range accounting for std dev is 0 - 0.6
                    if (series == 'readiness') {
                        // Our matrix is 580 px wide
                        d = ((d - 0.1) / 0.8) * 580;
                    } else {
                        // ...and 410 tall
                        d = (d / 0.6) * 410;
                    }

                    map[y][v.get('ISO3')][axis] = Math.round(d);
                })
            });
        });

        // TODO filter out countries without both axis.
        _(data).each(function(val, k) {
            data[k] = _(val).reject(function(v) {
                return (v.x == undefined || v.y == undefined);
            });
        });

        _(countries).chain().keys().sort().each(function(v, k) {
            view.countryOrder[v] = k;
        });

        this.matrix = d3.select('.big-matrix .graph')
        var chart = this.matrix.selectAll("div")
            .data(data['2010'], function(d) {
                return view.countryOrder[d.iso];
            });

        chart.enter().append("div")
            .text(function(d) { return d.iso; })
            .attr('class', 'point')
            .style('bottom', function(d) { return d.y + 'px'; })
            .style('left', function(d) { return d.x + 'px'; });

        $('ul.year-selector a.year-2010', this.el).addClass('active');

        return this;
    },
    setYear: function(year) {
        var currentData = this.data[year];
        var view = this;

        $('ul.year-selector a', this.el).removeClass('active');
        $('ul.year-selector a.year-'+ year, this.el).addClass('active');

        this.matrix.selectAll("div").data(currentData, function(d) {
                return view.countryOrder[d.iso];
            }).transition().duration(500)
            .style('bottom', function(d) { return d.y + 'px'; })
            .style('left', function(d) { return d.x + 'px'; });
    }, 
    yearSelect: function(ev) {
        var year = $(ev.currentTarget).text();
        if (this.data[year] == undefined) return true;

        this.setYear(year);
        return false;
    },
    yearsGo: function() {
        var actions = [],
            view = this;
        for (var i = 1995; i <= 2010; i++) {
            (function(y) {
                actions.push(function(next) {
                    view.setYear(y);
                    setTimeout(next, 500);
                });
            })(i);
        }
        _(actions).reduceRight(_.wrap, function(){ console.log('done')})();
        return false;
    }
});
