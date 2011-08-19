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
        var params = {
            id: this.$('input[name=id]').val(),
            featuredFirst: this.$('select[name=featuredFirst]').val(),
            featuredSecond: this.$('select[name=featuredSecond]').val(),
            author: Bones.user.id || '',
            created: parseInt((new Date()).getTime() / 1000) + ''
        };
        var that = this;
        this.model.save(params, {
            success: function() {
                var message = 'Featured countries on front page have been updated.';
                new views.AdminGrowl({message: message, autoclose: 15000});
                that.close();
            },
            error: Bones.admin.error
        });
        return false;
    },
});
