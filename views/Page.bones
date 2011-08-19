view = views.Document.extend({
    className: 'document page page-inner clearfix',
    initialize: function(options) {
        _.bindAll(this, 'render', 'attach');
        this.render().trigger('attach');
    },
    attach: function() {
        if (!Bones.user || !Bones.user.authenticated) {
            return this;
        }
        Bones.admin.setPanel(new views.AdminDocument({
            model: this.model,
            display: this
        }));
        return this;
    },
    render: function(options) {

        // Approach the cabinet.
        $(this.el).empty().append(templates.Cabinet());

        if (options && options.editable) {
            $(this.el).empty().append(templates.AdminPage(
                this.model.renderer()
            ));
        } else {
            $('.top', this.el).empty().append(templates.Page(
                this.model.renderer()
            ));
        }

        // Some things fall on the floor.
        $('.floor', this.el).empty().append(templates.AboutFloor());
        
        return this;
    }
});
