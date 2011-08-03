view = Backbone.View.extend({
    initialize: function() {
        this.render();
    },
    render: function() {
        $(this.el).is(':empty') && $(this.el).empty().append(
            templates.Front()
        );
        return this;
    }
});
