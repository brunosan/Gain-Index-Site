// Document view
// -------------
// Base class, not meant for direct use.
view = views.App.extend({
    className: 'inner',
    events: _.extend({
        'click a.save': 'save',
        'click a.cancel': 'cancel'
    }, Backbone.View.prototype.events),
    initialize: function(options) {
        _.bindAll(this, 'render', 'save', 'cancel');
        this.render();
    },
    panel: null,
    edit: function() {
        (this.panel && this.panel.edit());
    },
    // A user can edit a document if they are her own or if she is admin.
    editAccess: function(user) {
        return user.authenticated;
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
