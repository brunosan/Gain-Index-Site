view = views.Main.extend({
    render: function() {
        // Approach the cabinet.
        $(this.el).empty().append(templates.Cabinet());

        // Empty pockets on top.
        $('.top', this.el).empty().append(templates.Front());

        // Some things fall on the floor.
        $('.floor', this.el).empty().append(templates.DefaultFloor());

        return this;
    }
});
