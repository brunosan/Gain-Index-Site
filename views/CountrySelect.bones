view = views.CountrySearch.extend({
    className: 'country-selector',
    _ensureElement: function() {
        this.el = $('.country-selector');
    },
    filter: function(results) {
        if (this.options.selected) {
            var skip = this.options.selected.pluck('ISO3');

            results = _(results).reject(function(m) {
                return _.include(skip, m.get('ISO3'));
            });
        }
        return views.CountrySearch.prototype.filter.call(this, results)
    },
    select: function(ui) {
        if (this.options.selected) {
            this.options.selected.add([
                new models.Country({id: ui.item.value}
            )]);
        }
    }
});
