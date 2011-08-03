view = views.Document.extend({
    className: 'document page page-inner clearfix',
    render: function(options) {
        if (options && options.editable) {
            $(this.el).empty().append(templates.AdminPage(
                this.model.renderer()
            ));
        } else {
            $(this.el).empty().append(templates.Page(
                this.model.renderer()
            ));
        }
        return this.renderEditControl();
    }
});
