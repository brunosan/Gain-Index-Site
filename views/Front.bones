view = views.Main.extend({
    render: function() {
        $(this.el).empty().append(
            templates.Front()
        );
        return this;
    }
});
