// Document view
// -------------
// Base class, not meant for direct use.
view = views.Main.extend({
    className: 'inner',
    events: _.extend({
        'click a.save': 'save',
        'click a.cancel': 'cancel'
    }, Backbone.View.prototype.events),
    initialize: function(options) {
        views.Main.prototype.initialize.apply(this, arguments);
        _.bindAll(this, 'render', 'save', 'cancel');
        this.render();
    },
    save: function(e) {
        e.preventDefault();
        $('.adminDocument input.save', this.el).trigger('click');
    },
    cancel: function(e) {
        e.preventDefault();
        $('.adminDocument input.cancel', this.el).trigger('click');
    }
});
