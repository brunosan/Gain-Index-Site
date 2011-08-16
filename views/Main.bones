view = Backbone.View.extend({
    id: 'main',
    initialize: function(options) {
        this.app = new views.App();
        !Bones.server && _.once(this.drawerEvents)();
    },
    attach: function() {
        return this;
    },
    activeLinks: function() {
        $('a.active').removeClass('active');
        var activePath = window.location.pathname;

        $('a').each(function(i, a) {
            var href = $(a).attr('href');
            if (activePath == '/') {
                activePath == href && $(a).addClass('active');
            } else {
                (activePath.indexOf(href) != -1) && (href != '/') && $(a).addClass('active');
            }
        });
    },
    // Initializes global drawer events
    // --------------------------------
    drawerEvents: function() {
        _.each(['floor', 'drawer'], function(sel) {
            $(window).scroll(function() {
                window.drawerTop = window.drawerTop || $('#cabinet .floor').offset().top;
                var top = window.drawerTop;
                var el = $('#cabinet .' + sel);
                var range = $('#cabinet .top').outerHeight()
                            + $('#cabinet .top').offset().top
                            - el.outerHeight();
                var pos = $(this).scrollTop();
                if (pos > top) {
                    el.addClass('fixed');
                }
                else {
                    el.removeClass('fixed');
                }
                if (pos > range) {
                    el.addClass('bottom');
                }
                else {
                    el.removeClass('bottom');
                }
            });
        });
    },
});

view.render = Bones.server;
