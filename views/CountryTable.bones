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
        $(this.el).empty().append(templates.CountryTable({data: data}));
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
