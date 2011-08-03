view = views.AdminDropdown.extend({
    icon: 'page',
    title: 'Pages',
    links: [
        { href: '#create', title: 'Create page' },
        { href: '#view', title: 'View pages' }
    ],
    events: _.extend({
        'click a[href=#create]': 'create',
        'click a[href=#view]': 'view'
    }, views.AdminDropdown.prototype.events),
    initialize: function(options) {
        _.bindAll(this, 'create', 'view');
        views.AdminDropdown.prototype.initialize.call(this, options);
    },
    create: function() {
        new views.AdminPopupDocument({
            title: 'Create page',
            documentType: 'page',
            pathPrefix: '/',
            model: new models.Page()
        });
    },
    view: function() {
        new views.AdminTable({
            title: 'Pages',
            collection: new models.Pages(),
            admin: this.admin,
            header: [
                {title:'Name'},
                {title:'Actions', className:'actions'}
            ],
            rowView: views.AdminTableRowDocument,
            path: function(id) { return '/' + id; }
        });
        return false;
    }

});

