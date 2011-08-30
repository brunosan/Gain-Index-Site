view = Backbone.View.extend({
    id: 'country-search',
    _ensureElement: function() {
        this.el = $('#country-search');
    },
    initialize: function() {
        _.bind(this, 'search');
        var that = this;
        $('input[name=search]', this.el).autocomplete({
            source: function(request, response) {
                response(that.search(request.term));
                return false;
            },
            select: function(e, ui) {
                e.preventDefault();
                views.App.route('/country/' + ui.item.value);
            },
            position: { at: "left bottom", my: 'left top' }
        });
    },
    events: {
        'click input[name=submit]': 'search'
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

        results = _(results).first(3);

        return _(results).map(function(o) { 
            return { label: o.get('name'), value: o.get('ISO3') }
        });
    }
});
