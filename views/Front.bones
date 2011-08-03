view = views.App.extend({
    render: function() {
        $('#view', this.el).is(':empty') && $('#view', this.el).empty().append(
            templates.Front()
        );
        return this;
    }
});
