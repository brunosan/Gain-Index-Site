view = views.Document.extend({
    render: function(options) {
        // Approach the cabinet.
        $(this.el).empty().append(templates.Cabinet({klass: 'page'}));
        $('.top', this.el).empty().append(templates.Page(
            this.model.renderer()
        ));
        // Some things fall on the floor.
        $('.floor', this.el).empty().append(templates.AboutFloor());
        return this;
    }
});
