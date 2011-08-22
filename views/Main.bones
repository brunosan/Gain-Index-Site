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
        var activePath = window.location.pathname;
        $('a.active').removeClass('active');
        $('a.exact').each(function(i, a) {
            activePath == $(a).attr('href') && $(a).addClass('active');
        });
        $('a:not(.exact)').each(function(i, a) {
            (activePath.indexOf($(a).attr('href')) == 0) && $(a).addClass('active');
        });
    },
    // Initializes global drawer events
    // --------------------------------
    drawerEvents: function() {
        _.each(['floor', 'drawer'], function(sel) {
            $(window).scroll(function() {
                window.drawerTop = window.drawerTop || $('#cabinet .floor').offset().top;
                var top = window.drawerTop,
                    el = $('#cabinet .' + sel),
                    offset = $('#cabinet .top').offset();
                if (!offset) return;
                var range = $('#cabinet .top').outerHeight()
                            + offset.top
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
