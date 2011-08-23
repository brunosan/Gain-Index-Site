view = views.Main.extend({
    initialize: function(options) {
        _.bindAll(this, 'render', 'attach');
        this.options = this.options || {};
        this.options.tab = options.index || 'vulnerability';
        this.options.structure = options.structure || 'sectors';

        var tree = {};
        _.each(this.collection.model.meta, function(field) {
            if (field.index && tree[field.index] == undefined) {
                tree[field.index] = {'components': {}, 'sectors': {}};
            }
            if (field.component) {
                if (tree[field.index].components[field.component] == undefined) {
                    tree[field.index].components[field.component] = [];
                }
                tree[field.index].components[field.component].push(field);
            }
            if (field.sector) {
                if (tree[field.index].sectors[field.sector] == undefined) {
                    tree[field.index].sectors[field.sector] = [];
                }
                tree[field.index].sectors[field.sector].push(field);
            }
        });
        this.tree = tree;
    },
    render: function() {
        var lookup = {}, data = [];

        // Build a look up table for the data.
        // TODO move this to the collection.
        this.collection.each(function(m) {
            lookup[m.get('name')] = m;
        });

        var branch = this.tree[this.options.tab][this.options.structure],
            meta = this.collection.model.meta

        var scores = {};
        var appendData = function(key, klass) {
            var field = {
                field: meta[key],
                klass: klass,
                raw: null, 
                normalized: null
            };
            if (lookup[key] != undefined) {
                field.input = lookup[key].input();
                field.score = lookup[key].score();
            }
            // Create new hash to determine worst scores.
            scores[field.field.id] = {};
            scores[field.field.id].score = field.score;
            scores[field.field.id].index = field.field.index;
            scores[field.field.id].name = field.field.id;
            scores[field.field.id].sector = field.field.sector;
            
            data.push(field);
        }

        appendData(this.options.tab, 'index');
        _.each(branch, function(leaf, section) {
            appendData(section, 'section');
            _.each(leaf, function(indicator) {
                if (indicator.id != section) {
                    appendData(indicator.id, 'data');
                }
            });
        });
        var exclude = ['infr'];
        // Sort by score, drop 0's and 1's, drop sectors
        scores = _.filter(scores, function(item) { return ((item.score > 0 && item.score < 1) || item.sector == null); });
        if (this.options.tab == 'vulnerability') {
            scores = _.filter(scores, function(item) {return item.score > 0.7 });
            scores.sort(function(a, b) { return b.score - a.score });
            scores = scores.slice(0,3);
        } else {
            scores = _.filter(scores, function(item) {return item.score < 0.3 });
            scores.sort(function(a, b) { return a.score - b.score });
            scores = scores.slice(0,3);
        }
        // New hash w/ indicators as keys
        var worst = {};
        _.each(scores, function(score) {
            worst[score.name] = score.score;
        });
        $(this.el).empty().append(templates.CountryTable({data: data, worst: worst}));
        return this;
    },
    attach: function() {
        var collection = this.collection;

        // iterate over all rows, if they have a div.graph setup the chart
        $('tr', this.el).each(function() {
            var graph = $('.graph .placeholder', this);
            if (graph.length == 0) return;

            var ind = $(this).attr('id');
            var ind = $(this).attr('id').substr(10);
            if (!ind) return;

            var data = collection.getGraphData('name', ind);

            new views.Sparkline({el: graph, data: data});
        });
    }
});
