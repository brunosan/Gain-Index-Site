view = views.AdminDropdown.extend({
    icon: null,
    title: null,
    links: [
        { href: '#create', title: 'Create' },
        { href: '#view', title: 'View' }
    ],
    events: _.extend({
        'click a[href=#create]': 'create',
        'click a[href=#view]': 'view'
    }, views.AdminDropdown.prototype.events),
    initialize: function(options) {
        _.bindAll(this, 'create', 'view');
        views.AdminDropdown.prototype.initialize.call(this, options);
    },
    create: function() {},
    view: function() {}
});

/**
 * Only display the admin screen when the user is in the admin group.
 */
view.augment({
    render: function(sup) {
        //@TODO fix this check
        //if (!this.model.hasGroup('admin')) {
        //    return this;
        //}
        return sup.call(this);
    }
});
