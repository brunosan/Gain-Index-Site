view = views.Main.extend({
    render: function() {
        $(this.el).empty().append(templates.Matrix());
        return this;
    }
});
