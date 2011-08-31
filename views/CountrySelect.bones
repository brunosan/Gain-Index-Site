view = views.CountrySearch.extend({
    className: 'country-selector',
    _ensureElement: function() {
        this.el = $('.country-selector');
    },
    select: function(ui) {
        console.warn(ui.item.value);
    }
});
