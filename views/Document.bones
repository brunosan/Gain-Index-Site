// Document view
// -------------
// Base class, not meant for direct use.
view = views.Main.extend({
    initialize: function(options) {
        views.Main.prototype.initialize.apply(this, arguments);
        _.bindAll(this, 'edit');
        Bones.user && Bones.user.bind('auth:status', this.edit);
    },
    panel: null,
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
    }
});
