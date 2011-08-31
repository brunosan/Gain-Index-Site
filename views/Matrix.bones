// * Readiness range accounting for std dev is 0.1 - 0.9
// Our matrix is 580 px wide
var readinessToX = function(d) {
    return Math.round(((d - 0.1) / 0.8) * 580);
};

// * Vulnerability range accounting for std dev is 0 - 0.6
// ...and 410 tall
var vulnerabilityToY= function(d) {
    return Math.round((d / 0.6) * 410);
};

var openTooltips = 0;

// Some closure variables to help with animation.
var animated = false,
    currentYear = 2010;

view = views.Main.extend({
    events: {
        'click ul.year-selector li a': 'yearSelect',
        'click a.play-button': 'yearsGo',
        'click .drawer .handle a.handle': 'closeDrawer',
        'click div.point': 'pointSelect',
        'click .active-countries span.country a.remove': 'removeCountry',
        'click .active-countries span.country a.more': 'openDrawer',
        'mouseenter div.point': 'pointHover',
        'mouseleave div.point': 'pointUnhover'
    },
    pageTitle: "Matrix",
    render: function() {
        $(this.el).empty().append(templates.Cabinet({klass: 'matrix'}));
        var gain = new models.Indicator({id: 'gain'});
        $('.floor', this.el).empty().append(templates.DefaultFloor({
            title: gain.meta('name'),
            content: gain.meta('description_long')
        }));
        $('.top', this.el).empty().append(templates.Matrix());
        return this;
    },
    attach: function() {
        // IE8 Has a different, and older, way of setting style-y things. So we
        //  teach it the new hip stuff, what the kids are using.
        if (CSSStyleDeclaration.prototype.getAttribute) {
            CSSStyleDeclaration.prototype.getProperty = function(a) {
                return this.getAttribute(a);
            };
            CSSStyleDeclaration.prototype.setProperty = function(a,b) {
                return this.setAttribute(a,b);
            };
            CSSStyleDeclaration.prototype.removeProperty = function(a) {
                return this.removeAttribute(a);
            };
        }

        views.Main.prototype.attach.call(this);
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

        _({readiness: 'x', vulnerability: 'y'}).each(function(axis, series) {
            view.options[series].get('indicators').each(function(v) {
                _(v.get('values')).each(function(d, y) {
                    var iso = v.get('ISO3');
                    if (countries[iso] == undefined) {
                      countries[iso] = new models.Country({id: iso});
                    }

                    if (map[y][iso] == undefined) {
                        var item = {
                            iso: iso,
                            name: countries[iso].meta('name')
                        };

                        map[y][iso] = item;
                        data[y].push(item);
                    }

                    // And the original data.
                    map[y][iso][series] = d;
                })
            });
        });

        // Filter out countries without both axis.
        _(data).each(function(val, k) {
            data[k] = _(val).reject(function(v) {
                return (v.readiness == undefined || v.vulnerability == undefined);
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
            .html(function(d) { return templates.MatrixPoint(d); })
            .attr('class', 'point')
            .style('bottom', function(d) { return vulnerabilityToY(d.vulnerability) + 'px'; })
            .style('left', function(d) { return readinessToX(d.readiness) + 'px'; });

        $('ul.year-selector a.year-2010', this.el).addClass('active');


        var search = $('.country-selector input[name=country]', this.el),
            searchTitle = search.attr('title');

        search
            .blur(function() { search.val() === '' && search.val(searchTitle);  })
            .focus(function() { search.val() === searchTitle && search.val('');  })
            .blur();

        return this;
    },
    setYear: function(year) {
        currentYear = year;
        var currentData = this.data[year];
        var view = this;

        $('ul.year-selector a', this.el).removeClass('active');
        $('ul.year-selector a.year-'+ year, this.el).addClass('active');

        this.matrix.selectAll("div").data(currentData, function(d) {
                return view.countryOrder[d.iso];
            }).transition().duration(500)
            .style('bottom', function(d) { return vulnerabilityToY(d.y) + 'px'; })
            .style('left', function(d) { return readinessToX(d.readiness) + 'px'; })
            .attrTween('class', function(d, i, a) {
                var classes = this.className.split(' ');
                // If the only class is 'point' we're not active and don't
                // need to transition colors.
                if (classes.length > 1) {
                    // If our class won't change as a result of the transition,
                    // don't bother with this interpolator.
                    if ('point active-' + view.quadrant(d) != a) {

                        var xc = parseInt(this.style.getPropertyValue('left').slice(0, -2));
                        var xRange = readinessToX(d.readiness) - xc;

                        var yc = parseInt(this.style.getPropertyValue('bottom').slice(0, -2));
                        var yRange = vulnerabilityToY(d.vulnerability) - yc;
                        
                        return function(n) {
                            return 'point active-' + view.quadrantCoord({
                                x: (n * xRange) + xc,
                                y: (n * yRange) + yc
                            });
                        };
                    }
                }

                // Effectively a no-op. Don't tweak the class at all.
                return function() { return a; };
            });
    }, 
    yearSelect: function(ev) {
        var year = $(ev.currentTarget).text();
        if (this.data[year] == undefined) return true;

        this.setYear(year);
        return false;
    },
    yearsGo: function(ev) {
        if (animated == true) {
          $(ev.currentTarget).removeClass('running');
          animated = false;
          return false;
        }
        var actions = [],
            view = this;

        // If we click play from 2010, we really want to start from 1995
        if (currentYear == 2010) currentYear = 1995;
        
        for (var i = currentYear; i <= 2010; i++) {
            (function(y) {
                actions.push(function(next) {
                    if (animated) {
                        view.setYear(y);
                        setTimeout(next, 500);
                    }
                });
            })(i);
        }

        $(ev.currentTarget).addClass('running');
        animated = true;
        _(actions).reduceRight(_.wrap, function(){
            $(ev.currentTarget).removeClass('running');
            animated = false;
        })();
        return false;
    },
    pointSelect: function(ev) {
        var data = ev.currentTarget.__data__;
        if ($('.active-countries .country-'+ data.iso, this.el).length) {
            $('.active-countries .country-'+ data.iso, this.el).remove();
            $(ev.currentTarget)
              .removeClass('active-tl')
              .removeClass('active-tr')
              .removeClass('active-bl')
              .removeClass('active-br');
        } else {
            var quad = this.quadrant(data);
            $(ev.currentTarget).addClass('active-' + quad);
            $('.active-countries', this.el).append(templates.CountryOption(data));
        }
        ev.preventDefault();
    },
    quadrant: function(data) {
        // Determine which quadrant to highlight.
        // * The turning point for Vulnerability us 0.31
        // * The turning point for Readiness is 0.52
        var quad = (data.vulnerability > 0.31 ? 't' : 'b');
        quad += (data.readiness > 0.52 ? 'r' : 'l');
        return quad;
    },
    quadrantCoord: function(data) {
        // Determine which quadrant to highlight, base on Coords.
        // TODO it's unfortuate that we've got these two quad calcuation
        //      functions, we should be able to consolidate.
        var quad = (data.y > vulnerabilityToY(0.31) ? 't' : 'b');
        quad += (data.x > readinessToX(0.52) ? 'r' : 'l');
        return quad;
    },
    removeCountry: function(ev) {
        var elem = $(ev.currentTarget).parents('span:first');
        _(elem.attr('class').split(' ')).each(function(v) {
            if (v.slice(0,8) === 'country-') {
                var iso = v.slice(8);
                elem.remove();
                $('.graph .country-'+iso, this.el)
                    .parents('.point')
                    .removeClass('active-tl')
                    .removeClass('active-tr')
                    .removeClass('active-bl')
                    .removeClass('active-br');
            }
        });
        ev.preventDefault();
    },
    openDrawer: function(ev) {
        var view = this,
            elem = $(ev.currentTarget).parents('span:first');

        _(elem.attr('class').split(' ')).each(function(v) {
            if (v.slice(0,8) === 'country-') {
                var iso3 = v.slice(8);
                new views.CountryDetailDrawer({
                    el: $('.drawer', this.el),
                    model:new models.Country({id: iso3}),
                    indicator: new models.Indicator({id: 'gain'}),
                    callback: function() { $('.drawer', view.el).addClass('open');}
                });
            }
        });
        return false;

    },
    closeDrawer: function() {
        $('.drawer', this.el).removeClass('open');
        return false;
    },
    pointHover: function(ev) {
        openTooltips++;
        $('.tooltip', this.el).empty().append($(ev.currentTarget).html());
    },
    pointUnhover: function(ev) {
        // Decrement our count, dont' fall below 0.
        openTooltips > 0 && openTooltips--;

        if (openTooltips == 0) $('.tooltip', this.el).empty();
    }

});
