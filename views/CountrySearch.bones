view = Backbone.View.extend({
    id: 'country-search',
    _ensureElement: function() {
        this.el = $('#country-search');
    },
    initialize: function() {
        _.bind(this, 'search', 'filter', 'select');
        this.options.resultLimit = this.options.resultLimit || 3;

        var that = this;

        var search = $('input[name=search]', this.el),
            searchTitle = search.attr('title');

        search
            .blur(function() { search.val() === '' && search.val(searchTitle);  })
            .focus(function() { search.val() === searchTitle && search.val('');  })
            .blur();


        search.autocomplete({
            source: function(request, response) {
                response(that.search(request.term));
                return false;
            },
            select: function(e, ui) {
                e.preventDefault();
                that.select(ui);
                search.val('');
            },
            position: { at: "left bottom", my: 'left top' }
        });
    },
    events: {
        'click input[name=submit]': 'search'
    },
    select: function(ui) {
        views.App.route('/country/' + ui.item.value);
    },
    filter: function(results) {
        return _(results).first(this.options.resultLimit);
    },
    search: function(term) {
        // remove double spaces
        term = term.replace(/\s+/g, ' ');
        // remove non-safe characters
        term = term.replace(/[^\w\s]/g, '');
        
        var reg = new RegExp('\\b' + term, "i");

        var results = this.model.select(function(o) {
            return reg.test(o.get('ISO3')) || reg.test(o.get('name'));
        });

        return _(this.filter(results)).map(function(o) {
            return { label: o.get('name'), value: o.get('ISO3') }
        });
    }
});
