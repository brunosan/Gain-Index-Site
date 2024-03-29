// * Readiness range is 0.2 - 0.85
// Our matrix is 580 px wide
// Points are 15px by 15px
var readinessToX = function(d) {
    return Math.round(((d - 0) / (0.9 - 0)) * 580) - 8;
};

// * Vulnerability range 0.1 - 0.6
// ...and 350 tall
// Points are 15px by 15px
var vulnerabilityToY= function(d) {
    return Math.round(((d - 0.1) / (0.7 - 0.1)) * 350) - 8;
};

var openTooltips = 0;

// Some closure variables to help with animation.
var animated = false,
    currentYear = views.App.endYear;

var quadrant = function(data) {
    // Determine which quadrant to highlight.
    // * The turning point for Vulnerability us 0.33.
    // * The turning point for Readiness is 0.56.
    var quad = (data.vulnerability > 0.33 ? 't' : 'b');
    quad += (data.readiness > 0.56 ? 'r' : 'l');
    return quad;
};

var quadrantCoord = function(data) {
    // Determine which quadrant to highlight, base on Coords.
    // TODO it's unfortuate that we've got these two quad calcuation
    //      functions, we should be able to consolidate.
    var quad = (data.y > vulnerabilityToY(0.33) ? 't' : 'b');
    quad += (data.x > readinessToX(0.56) ? 'r' : 'l');
    return quad;
};

var classTween = function(d, i, a) {
    var classes = this.className.split(' ');
    // If the only class is 'point' we're not active and don't
    // need to transition colors.
    if (classes.length > 1) {
        // If our class won't change as a result of the transition,
        // don't bother with this interpolator.
        if ('point active-' + quadrant(d) != a) {

            var xc = parseInt(this.style.left.slice(0, -2));
            var xRange = readinessToX(d.readiness) - xc;

            var yc = parseInt(this.style.bottom.slice(0, -2));
            var yRange = vulnerabilityToY(d.vulnerability) - yc;

            return function(n) {
                return 'point active-' + quadrantCoord({
                    x: (n * xRange) + xc,
                    y: (n * yRange) + yc
                });
            };
        }
    }

    // Effectively a no-op. Don't tweak the class at all.
    return function() { return a; };
}

var pixelTween = function(axis) {
    // Sorry for this.
    var valToCoord = {
      vulnerability: vulnerabilityToY,
      readiness: readinessToX
    }

    return  function(d, i, a) {
        // IE8 seems to forget things you try to teach it.
        if (a == null) {
            var plane = (axis == 'vulnerability' ? 'bottom' : 'left');
            a = this.style[plane];
        }

        var a = parseInt(a.slice(0, -2));
        var b = valToCoord[axis](d[axis]);
        b -= a;
        return function(t) { return Math.round(a + b * t) + 'px'; };
    };
};

view = views.Main.extend({
    events: {
        'click ul.year-selector li a': 'yearSelect',
        'click a.play-button': 'yearsGo',
        'click .drawer .handle a.handle': 'closeDrawer',
        'click div.point': 'pointSelect',
        'click .active-countries span.country a.remove': 'removeCountry',
        'click .active-countries span.country a.more': 'openDrawer',
        'mouseenter div.point': 'pointHover',
        'mouseleave div.point': 'pointUnhover',
        'mouseenter .interactive .quad': 'quadrantHover',
        'mouseleave .interactive .quad': 'quadrantUnhover',
        'mouseenter .mini-matrix-links a': 'hoverRelatedQuad',
        'mouseleave .mini-matrix-links a': 'unHoverRelatedQuad',
        'click .mini-matrix-links a': '_return'
    },
    pageTitle: "Matrix",
    initialize: function(options) {
        _.bindAll(this, 'pointSelect', 'removeCountry');
        views.Main.prototype.initialize.call(this, options);
    },
    render: function() {
        $(this.el).empty().append(templates.Cabinet({klass: 'matrix'}));
        $('.floor', this.el).empty().append(templates.DefaultFloor({
            title: 'The Readiness Matrix',
            content: templates.MatrixFloorText(),
            methodologyLink: '/about/matrix'
        }));
        $('.top', this.el).empty().append(templates.Matrix());
        return this;
    },
    _return: function(e) { return false; },
    attach: function() {
        views.Main.prototype.attach.call(this);

        var view = this,
            data = {};
            map = {};
            countries = {};

        this.data = data;

        for (var i = views.App.startYear; i <= views.App.endYear; i++) {
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

                    if (map[y] !== undefined) {
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
                    }
                })
            });
        });

        // Filter out countries without both axis.
        _(data).each(function(val, k) {
            data[k] = _(val).reject(function(v) {
                return (v.readiness == undefined || v.vulnerability == undefined);
            });
        });

        // We cannot use d3 in IE7...
        if (window.CSSStyleDeclaration == undefined) {
            this.staticGraphSetup(data);
        } else {
            this.d3setup(data);
        }
        this.countrySelectorSetup(data);

        return this;
    },
    d3setup: function(data) {

        this.polyfillSetup();

        this.matrix = d3.select('.big-matrix .graph')
        var chart = this.matrix.selectAll("div")
            .data(data[views.App.endYear.toString()], function(d) { return d.iso });

        chart.enter().append("div")
            .html(function(d) { return templates.MatrixPoint(d); })
            .attr('class', 'point')
            .style('bottom', function(d) { return vulnerabilityToY(d.vulnerability) + 'px'; })
            .style('left', function(d) { return readinessToX(d.readiness) + 'px'; });
    },
    staticGraphSetup: function(data) {
        $('.year-controls', this.el).remove();
        var matrix = $('.big-matrix .graph');
        _.each(data[views.App.endYear.toString()], function(d) {
            var elem = $('<div>')
              .html(templates.MatrixPoint(d))
              .addClass('point')
              .css('bottom', vulnerabilityToY(d.vulnerability) + 'px')
              .css('left', readinessToX(d.readiness) + 'px');

            elem.get(0).__data__ = d;

            matrix.append(elem);
        });
    },
    countrySelectorSetup: function(data) {
        // Create a collection to manage the selected countries.
        this.selected = new Backbone.Collection();

        this.available = _(data).chain()
            .map(function(d) { return _(d).pluck('iso'); })
            .flatten()
            .uniq()
            .value();

        // Bind the transformation of the DOM to the events of this
        // collection.
        this.selected.bind('add', function(model) {
            var target = $('.graph .country-'+ model.id, view.el).parents('.point');
            var label = $('.active-countries .country-'+ model.id, view.el);

            var adder = function() {
                var data = target.get(0).__data__;
                var quad = quadrant(data);
                $(target).addClass('active-' + quad);
                $('.active-countries', this.el).append(templates.CountryOption(data));
            }
            if (animated) {
                view.bind('yearSet', adder);
            } else {
                adder();
            }
        });
        this.selected.bind('remove', function(model) {
            var target = $('.graph .country-'+ model.id, view.el).parents('.point');
            var label = $('.active-countries .country-'+ model.id, view.el);

            var remover = function() {
                label.remove();

                target.removeClass('active-tl')
                    .removeClass('active-tr')
                    .removeClass('active-bl')
                    .removeClass('active-br');
            }
            if (animated) {
                view.bind('yearSet', remover);
            } else {
                remover();
            }
        });

        (new views.CountrySelect({
            model: new models.CountrySearch(),
            selected: this.selected,
            available: this.available,
            resultLimit: 10
        })).render();

        $('ul.year-selector a.year-' +  views.App.endYear, this.el).addClass('selected');
    },
    polyfillSetup: function() {
        // IE8 Has a different, and older, way of setting style-y things. So we
        //  teach it the new hip stuff, what the kids are using.
        if (window.CSSStyleDeclaration && CSSStyleDeclaration.prototype.getAttribute) {
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
        // Shim up `getComputedStyle` for IE8 as well.
        if (window.getComputedStyle == undefined) {
            window.getComputedStyle = function(x) {
                return { getPropertyValue: function(p) { return x.p } };
            }
        }

        // IE7 doesn't have a querySelector, add a shim that will be replaced with Sizzle.
        if (document.querySelector == undefined) {
            document.querySelector = function() {};
        }
    },
    setYear: function(year, next) {
        var currentData = this.data[year],
            count = currentData.length,
            n = 0,
            dur = ($.browser.msie ? 2000 : 500),
            view = this;

        // Update the currenYear closure
        currentYear = parseInt(year);

        this.matrix.selectAll("div").data(currentData, function(d) { return d.iso })
            .transition().duration(dur)
            .styleTween('bottom', pixelTween('vulnerability'))
            .styleTween('left', pixelTween('readiness'))
            .attrTween('class', classTween)
            .each('end', function() {
                n++;
                if (n == count) {
                    $('ul.year-selector a', view.el).removeClass('selected');
                    $('ul.year-selector a.year-'+ year, view.el).addClass('selected');

                    // Trigger the yearSet, and the wipe it's callbacks.
                    view.trigger('yearSet');
                    view.unbind('yearSet');

                    next && next();
                }
            });
    },
    yearSelect: function(ev) {
        var year = $(ev.currentTarget).text();
        if (this.data[year] == undefined) return true;

        this.setYear(year);
        return false;
    },
    yearsGo: function(ev) {
        // If the animation has been paused, bail.
        if (animated == true) {
          $(ev.currentTarget).removeClass('running');
          animated = false;
          return false;
        }

        // If we click play from the most recent year, we really want to start from 1995
        if (currentYear == views.App.endYear) currentYear =  views.App.startYear;

        var actions = [],
            view = this;

        actions.push(function(next) {
            $(ev.currentTarget).addClass('running');
            animated = true;
            next();
        });

        for (var i = (currentYear + 1); i <= views.App.endYear; i++) {
            (function(y) {
                actions.push(function(next) {
                    if (animated) { view.setYear(y, next) }
                });
            })(i);
        }

        _(actions).reduceRight(_.wrap, function() {
            $(ev.currentTarget).removeClass('running');
            animated = false;
        })();
        return false;
    },
    pointSelect: function(ev) {
        var data = ev.currentTarget.__data__;
        var country = this.selected.find(function(m) {
            return m.get('ISO3') === data.iso;
        });

        if (country) {
            this.selected.remove(country);
        } else {
            this.selected.add([new models.Country({id: data.iso})]);
         }
        ev.preventDefault();
    },

    removeCountry: function(ev) {
        var isoRegex = /country-(\w{3})/;

        var elem = $(ev.currentTarget).parents('span:first');
        var matches = isoRegex.exec(elem.attr('class'));

        if (matches && matches[1]) {
            var country = this.selected.find(function(m) {
                return m.get('ISO3') === matches[1];
            });
            this.selected.remove(country);
        }
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
    },
    quadrantHover: function(ev) {
        var relativeClass = $(ev.currentTarget).attr('class').match(/[tb][lr]/);
        relativeClass = relativeClass[0];

        $('.mini-matrix .'+ relativeClass, this.el).addClass('active');
        $('.big-matrix', this.el).append($(ev.currentTarget).html());
        $('.big-matrix .quad-' + relativeClass, this.el).animate({opacity: .90});
    },
    quadrantUnhover: function(ev) {
        var relativeClass = $(ev.currentTarget).attr('class').match(/[tb][lr]/);
        relativeClass = relativeClass[0];

        $('.mini-matrix .'+ relativeClass, this.el).removeClass('active');
        $('.big-matrix .quad-'+ relativeClass, this.el).fadeOut(function() {$(this).remove();});
    },
    hoverRelatedQuad: function(ev) {
        var relativeClass = $(ev.currentTarget).attr('class'),
            associatedQuad = $('.mini-matrix .quad', this.el).filter('.' + relativeClass).addClass('active');

        $('.big-matrix', this.el).append(associatedQuad.html());
        $('.big-matrix .quad-' + relativeClass, this.el).animate({opacity: .90});
    },
    unHoverRelatedQuad: function(ev) {
        var relativeClass = $(ev.currentTarget).attr('class').match(/[tb][lr]/);
        relativeClass = relativeClass[0];

        $('.mini-matrix .'+ relativeClass, this.el).removeClass('active');
        $('.big-matrix .quad-'+ relativeClass, this.el).fadeOut(function() {$(this).remove();});
    }
});
