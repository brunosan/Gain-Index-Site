view = views.CountrySearch.extend({
    className: 'country-selector',
    _ensureElement: function() {
        this.el = $('.country-selector');
    },
    events: {
        'click input[name=add]': 'submit',
        'submit form': 'submit'
    },
    filter: function(results) {
        var avail = this.options.available;

        results = _(results).select(function(m) {
            return _.include(avail, m.get('ISO3'));
        });

        if (this.options.selected) {
            var skip = this.options.selected.pluck('ISO3');

            results = _(results).reject(function(m) {
                return _.include(skip, m.get('ISO3'));
            });
        }
        return views.CountrySearch.prototype.filter.call(this, results)
    },
    trigger: function(item) {
        if (this.options.selected) {
            this.options.selected.add([new models.Country({id: item.value})]);
            $('input[name=search]', this.el).val('');
        }
    }
});
