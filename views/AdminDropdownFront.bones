// AdminDropdownFront
// -----------------
// Front feature management
view = views.AdminDropdown.extend({
    // @TODO not yet sure what all the final menus will be, so
    // just calling it "structure" for now.
    icon: 'structure',
    events: _.extend({
        'click a[href=#frontFeature]': 'frontFeature',
    }, views.AdminDropdown.prototype.events),
    links: [
        { href: '#frontFeature', title: 'Featured Countries' },
    ],
    initialize: function(options) {
        this.title = "Structure";
        _.bindAll(this, 'frontFeature');
        views.AdminDropdown.prototype.initialize.call(this, options);
    },
    frontFeature: function() {
        new views.AdminPopupFront({
            title: 'Change featured countries on front page',
            documentType: 'front',
            pathPrefix: '/front/',
            model: new models.Front({id: 'front'})
        });
        return false;
    }
});