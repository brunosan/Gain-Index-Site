// AdminPopupProject
// --------------
// Project creation/update popup.
view = views.AdminPopup.extend({
    events: _.extend({
        'click input[type=submit]': 'submit',
    }, views.AdminPopup.prototype.events),
    initialize: function (options) {
        // Load the only frontFeature model
        var model = this.model
        var that = this;
        model.fetch({
            success: function(model) {
                // @TODO replace all this w/ countries model
                that.options.countries = {};
                that.options.countries['abw'] = 'Aruba';
                that.options.countries['afg'] = 'Afghanistan';
                that.options.countries['ago'] = 'Angola';
                that.options.countries['tod'] = 'TODO';
                that.options.documentType = options.documentType;
                _.bindAll(that, 'submit');
                that.content = templates.AdminPopupFrontFeature({
                    documentType: that.options.documentType,
                    countries: that.options.countries,
                    featuredFirst: model.get('featuredFirst'),
                    featuredSecond: model.get('featuredSecond')
                });
                views.AdminPopup.prototype.initialize.call(that, options);
            },
            error: Bones.admin.error
        });
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
        this.model.save(params, {
            success: function() {
                var message = 'Featured countries on front page have been updated.';
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
