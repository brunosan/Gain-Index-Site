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
    },
    attach: function() {
        // Scroll to the position requested by the hash.
        if (!Bones.server && window.location && window.location.hash) {
            var offset = $(window.location.hash).offset();
            var top = offset ? $(window.location.hash).offset().top : 0;
            if (top) {
                if ($('body').scrollTop(0)) {
                    $('body').animate({scrollTop: top}, {duration: 500});
                    return this;
                }
                if ($('html').scrollTop(0)) {
                    $('html').animate({scrollTop: top}, {duration: 500});
                    return this;
                }
            }
        }
        return this;
    }
});
