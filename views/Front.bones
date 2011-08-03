view = views.App.extend({
    render: function() {
        $(this.el).is(':empty') && $(this.el).empty().append(
            templates.Front()
        );
        return this;
    }
});
