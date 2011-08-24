view = Backbone.View.extend({
    className: 'adminDocument',
    display: null,
    events: {
        'click .edit': 'edit'
    },
    initialize: function(options) {
        _.bindAll(this, 'edit', 'render');
        this.collection.bind('add', this.render);
        this.render();
    },
    render: function() {
        var countries = [];
        this.collection.each(function(country) {
            countries.push(country.get('name'));
        })
        $(this.el).empty().append(templates.AdminFrontFeature({
            countries: countries.join(', ')
        }));
        return this;
    },
    edit: function() {
        new views.AdminPopupFrontFeature({
            model: new models.Front({id: 'front'}),
            collection: this.collection
        });
    }
});
