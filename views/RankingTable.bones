// From http://is.gd/CKCkga
function hslToRgb(hsl) {
    var h = hsl.h,
        s = hsl.s,
        l = hsl.l,
        r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return {r: r * 255, g: g * 255, b: b * 255};
}

function rgbToHsl(rgb){
    var r = rgb.r / 255,
        g = rgb.g / 255,
        b = rgb.b / 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return {h: h, s: s, l: l};
}

function hexToRgb(h) {
    var cutHex = function(h) {
        return (h.charAt(0)=="#") ? h.substring(1,7):h
    };
    return {
        r: parseInt((cutHex(h)).substring(0,2),16),
        g: parseInt((cutHex(h)).substring(2,4),16),
        b: parseInt((cutHex(h)).substring(4,6),16)
    };
}

function rgbToHex(rgb) {
    var toHex = function(n) {
        n = parseInt(n,10);
        if (isNaN(n)) return "00";
        n = Math.max(0,Math.min(n,255));
        return "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);
    }
    return toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
}

function hexToHsl(hex) {
    return rgbToHsl(hexToRgb(hex));
}

function hslToHex(hsl) {
    return rgbToHex(hslToRgb(hsl));
}

view = Backbone.View.extend({
    events: {
        'click a.sort.rank': 'sortRank',
        'click a.sort.alpha':  'sortAlpha',
        'click a.sort.income':  'sortIncome'
    },
    initialize: function() {
        // "Reset" is fired when the collection is sorted. When that happens
        // it's time to re-render.
        var view = this;
        this.collection.bind('reset', function() {
            view.render().attach();
        });
    },
    render: function() {
        var data = [],
            meta = models.Country.meta,
            previousId = $('tr.active', this.el).attr('id');

        // Build a look up table for the data.
        var from = hexToHsl('#67b6e0'),
            to = hexToHsl('#fc7b7e'),
            max = this.collection.max(function(model) {
                var rank = model.rank({format: false});
                return rank ? rank.desc : 0;
            }).rank({format: false}).desc,
            half = max / 2;

        this.collection.each(function(model) {
            var rank = model.rank({format: false});
            if (rank && meta[model.get('ISO3')]) {
                rank = rank.desc;
                var h = rank <= half ? from.h : to.h;
                var s = rank <= half ?
                    from.s - rank * from.s / half :
                    (rank - half) * to.s / half;
                var l = from.l + rank * (to.l - from.l) / max;
                data.push({
                    name: meta[model.get('ISO3')].name,
                    income: meta[model.get('ISO3')].oecd_income,
                    incomeClass: meta[model.get('ISO3')].oecd_income
                        .toLowerCase()
                        .replace(/[^a-zA-Z0-9]+/gi, '-'),
                    iso3: model.get('ISO3'),
                    score: model.score(),
                    rank: model.rank(),
                    color: hslToHex({h: h, s: s, l: l})
                });
            }
        });

        $(this.el).empty().append(templates.RankingTable({
            rows: data
        }));
        // Conserve previously active table rows.
        previousId && $('tr#' + previousId).addClass('active');
        return this;
    },
    attach: function() {
        var collection = this.collection;

        // iterate over all rows, if they have a div.graph setup the chart
        $('tr', this.el).each(function() {
            var graph = $('.graph', this);
            if (graph.length == 0) return;

            var id = $(this).attr('id').substr(8);
            if (!id) return;

            var data = collection.getGraphData('ISO3', id);

            new views.Sparkline({el: graph, data: data});
        });
    },
    sortAlpha: function() {
        this.collection.comparator = function(model) {
            return model.get('country');
        };
        this.collection.sort();
        return false;
    },
    sortRank: function(ev) {
        this.collection.sortByRank();
        return false;
    },
    sortIncome: function(ev) {
        var meta = meta = models.Country.meta;
        this.collection.comparator = function(model) {
            var country = meta[model.get('ISO3')];
            if (country && country.oecd_value) {
                return country.oecd_value;
            }
            return Infinity;
        };
        this.collection.sort();
        return false;
    }
});
