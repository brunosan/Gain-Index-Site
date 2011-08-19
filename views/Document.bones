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
        _.bindAll(this, 'render', 'attach', 'save', 'cancel');
        this.render().trigger('attach');
    },
    panel: null,
    edit: function() {
        (this.panel && this.panel.edit());
    },
    // Run after document view has rendered.
    renderEditControl: function() {
        if (Bones.user.authenticated) {
            this.panel = new views.AdminDocument({model: this.model, display: this});
            $(this.el).addClass('show-status');
            $(this.el).prepend(this.panel.el);
            $('.main', this.el).append(templates.AdminActionsPanel());
        }
        return this;
    },
    render: function() {
        return this.renderEditControl();
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
