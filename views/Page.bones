view = views.Document.extend({
    className: 'document page page-inner clearfix',
    render: function() {
        if (!Bones.user || !Bones.user.authenticated) {
            return this;
        }
        Bones.admin.setPanel(new views.AdminDocument({
            model: this.model,
            display: this
        }));
        return this;
    },

});
