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
                var drawer = $('#cabinet .' + sel),
                    topOffset = $('#cabinet .top').offset(),
                    drawerOffset = $('#cabinet .floor').offset();
                if (!topOffset || !drawerOffset) return;
                // Capture drawer position once, will change as it slides down.
                window.drawerTop = window.drawerTop || drawerOffset.top;
                // Vertical range we allow the drawer to 'stick' with the window.
                // This is the bottom border of the top element minus the height
                // of the drawer, minus the distance of the drawer's top border
                // to the top element.
                var range = $('#cabinet .top').outerHeight()
                            + topOffset.top
                            - drawer.outerHeight()
                            - (window.drawerTop - topOffset.top);
                var pos = $(this).scrollTop();
                if (pos > topOffset.top) {
                    drawer.addClass('fixed');
                }
                else {
                    drawer.removeClass('fixed');
                }
                if (pos > range) {
                    drawer.addClass('bottom');
                }
                else {
                    drawer.removeClass('bottom');
                }
            });
        });
    },
});

view.render = Bones.server;
