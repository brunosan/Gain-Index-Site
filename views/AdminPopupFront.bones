// AdminPopupProject
// --------------
// Project creation/update popup.
view = views.AdminPopup.extend({
    events: _.extend({
        'click input[type=submit]': 'submit',
    }, views.AdminPopup.prototype.events),
    initialize: function (options) {
        this.options.documentType = options.documentType;
        this.options.documentTypeCSS = options.documentType
            .replace(/[^a-z0-9]+/gi, '-');
        _.bindAll(this, 'submit');
        this.content = templates.AdminPopupFront({
            documentType: this.options.documentType,
        });
        views.AdminPopup.prototype.initialize.call(this, options);
    },
    submit: function(e) {
        // stop the form from submitting
        e.preventDefault();

        var that = this;
        var params = {
            id: this.$('input[name=id]').val(),
            featuredFirst: this.$('input[name=featuredFirst]').val(),
            featuredSecond: this.$('input[name=featuredSecond]').val(),
            author: Bones.user.id || '',
            created: parseInt((new Date()).getTime() / 1000) + ''
        };
        this.model.save(params, {
            success: function() {
                var message = 'Your ' + that.options.documentType +' has been created';
                new views.AdminGrowl({message: message, autoclose: 15000});
                that.close();
                // Send to front page.
                that.route('/');
            },
            error: Bones.admin.error
        });
        return false;
    },
});
