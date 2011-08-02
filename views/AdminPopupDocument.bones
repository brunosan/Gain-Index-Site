// AdminPopupProject
// --------------
// Project creation/update popup.
view = views.AdminPopup.extend({
    events: _.extend({
        'click input[type=submit]': 'submit',
        'keyup input[name=name]': 'populatePath'
    }, views.AdminPopup.prototype.events),
    initialize: function (options) {
        this.options.pathPrefix = options.pathPrefix;
        this.options.documentType = options.documentType;
        this.options.documentTypeCSS = options.documentType
            .replace(/[^a-z0-9]+/gi, '-');
        _.bindAll(this, 'submit', 'populatePath');
        this.content = templates.AdminPopupDocument({
            pathPrefix: this.options.pathPrefix,
            documentType: this.options.documentType
        });
        views.AdminPopup.prototype.initialize.call(this, options);
    },
    submit: function(e) {
        // stop the form from submitting
        e.preventDefault();

        var that = this;
        var params = {
            id: this.$('input[name=id]').val(),
            name: this.$('input[name=name]').val(),
            author: Bones.user.id || '',
            created: parseInt((new Date()).getTime() / 1000) + ''
        };
        this.model.save(params, {
            success: function() {
                var message = 'Your ' + that.options.documentType +' has been created - ' +
                    'fill out the remaining fields and click "save".';
                new views.AdminGrowl({message: message, autoclose: 15000});
                that.close();
                Backbone.history.navigate(that.options.pathPrefix + that.model.id + '/edit');
            },
            error: Bones.admin.error
        });
        return false;
    },
    populatePath : function(ev) {
        var val = $('input[name=name]', this.el)
            .val()
            .toLowerCase().replace(/[^a-z0-9]+/gi, '-');
        val = val.replace(/^[-]+/, '').replace(/[-]+$/, '');
        $('input[name=id]', this.el).val(val);
    }
});

