// AdminPopupProject
// --------------
// Project creation/update popup.
view = views.AdminPopup.extend({
    events: _.extend({
        'click input[type=submit]': 'submit',
    }, views.AdminPopup.prototype.events),
    initialize: function (options) {
        _.bindAll(this, 'submit');
        this.content = templates.AdminPopupFrontFeature({
            documentType: this.options.documentType,
            countries: models.Country.meta,
            featuredFirst: this.collection.first().get('id'),
            featuredSecond: this.collection.last().get('id')
        });
        views.AdminPopup.prototype.initialize.call(this, options);
    },
    submit: function(e) {
        // stop the form from submitting
        e.preventDefault();

        var that = this;
        var featuredFirst = this.$('select[name=featuredFirst]').val();
        var featuredSecond =  this.$('select[name=featuredSecond]').val();
        var params = {
            id: this.$('input[name=id]').val(),
            featuredFirst: featuredFirst,
            featuredSecond: featuredSecond,
            author: Bones.user.id || '',
            created: parseInt((new Date()).getTime() / 1000) + ''
        };
        var that = this;
        this.model.save(params, {
            success: function() {
                var collection = that.collection;
                var first = collection.first();
                var last = collection.last();
                collection.remove(first); collection.remove(last);
                first = new models.Country({id: featuredFirst});
                last = new models.Country({id: featuredSecond});
                first.fetch({
                    success: function(firstModel) {
                        last.fetch({
                            success: function(lastModel) {
                                collection.add(firstModel, {silent: true});
                                collection.add(lastModel);
                            },
                            error: Bones.admin.error
                        });
                    },
                    error: Bones.admin.error
                });
                var message = 'Featured countries on front page have been updated.';
                new views.AdminGrowl({message: message, autoclose: 5000});
                that.close();
            },
            error: Bones.admin.error
        });
        return false;
    },
});
