// AdminTableRowDocument
// -----------------
// Custom table row for users.
view = views.AdminTableRow.extend({
    template: 'AdminTableRowDocument',
    initialize: function(options) {
        _.bindAll(this, 'render');
        this.options.template = options.template || this.template;
        views.AdminTableRow.prototype.initialize.call(this, options);
    },
    events: _.extend({
        'click input.edit': 'edit'
    }, views.AdminTableRow.prototype.events),
    render: function () {
        var locals = this.model.renderer();
        locals.path = this.options.table.options.path;
        $(this.el).html(templates[this.options.template](locals));
        return this;
    },
    edit: function() {
        var path = this.options.table.options.path;
        this.route(path(this.model.get('id') + '/edit'));
        this.options.table.close();
    }
});
