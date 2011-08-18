view = views.AdminDropdownDocument.extend({
    icon: 'page',
    links: [
        { href: '#create', title: 'Create page' },
        { href: '#view', title: 'View pages' }
    ],
    title: 'Page',
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
            path: function(id) { return '/about/' + id; }
        });
        return false;
    }
});
