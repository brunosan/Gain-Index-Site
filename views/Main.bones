view = Backbone.View.extend({
    id: 'main',
    initialize: function(options) {
        _.bindAll(this, 'drawerEvents', 'positionDrawer');
        this.app = new views.App();
        !Bones.server && _.once(this.drawerEvents)();
    },
    attach: function() {
        this.scrollToFragment();
        this.feedbackEmail();
        return this;
    },
    // Sets up feedback email href
    // ---------------------------
    feedbackEmail: function() {
        var mailto = $('.feedback-email')
            .attr('href')
            .split('?')
            .shift();
        var info = _.reduce({
            'subject': 'GaIn - Site feedback',
            'body': '\n\n\nSent from ' + window.location.href + '\n'
        }, function(memo, v, k) {
            memo += memo == '' ? '?' : '&';
            return memo + k + '=' + encodeURIComponent(v);
        }, '');
        $('.feedback-email').attr('href', mailto + info);
    },
    // Scrolls to the position requested by the hash
    // ---------------------------------------------
    scrollToFragment: function() {
        var offset = $(window.location.hash).offset();
        var top = offset ? $(window.location.hash).offset().top : 0;
        if (top) {
            if ($('body').scrollTop(0)) {
                $('body').scrollTop(top);
                return this;
            }
            if ($('html').scrollTop(0)) {
                $('html').scrollTop(top);
                return this;
            }
        }
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
        var view = this;
        _.each(['floor', 'drawer'], function(sel) {
            $(window).scroll(function() {
                view.positionDrawer(sel);
            });
        });
    },
    positionDrawer: function(sel) {
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
        var pos = $(window).scrollTop();
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
    }
});

view.render = Bones.server;
