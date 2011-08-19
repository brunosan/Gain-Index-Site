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
        _.bindAll(this, 'render', 'attach', 'save', 'cancel', 'edit');
        Bones.user && Bones.user.bind('auth:status', this.edit);
    },
    panel: null,
    render: function() {
        return this.renderEditControl();
    },
    edit: function() {
        if (Bones.user && Bones.user.authenticated) {
            Bones.admin.setPanel(new views.AdminDocument({
                model: this.model,
                display: this
            }));
        }
        else {
            Bones.admin.setPanel();
        }
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
