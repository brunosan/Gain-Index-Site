router = Backbone.Router.extend({
    routes: {
        '' : 'front',
        '/' : 'front',
        '/country/:id': 'country'
    },
    initialize: function(options) {
        Backbone.Router.prototype.initialize.call(this, options);
        Bones.user = new models.User;

        // Add bones-admin view.
        Bones.admin = new views['Admin']({
            model: Bones.user,
            auth: views['AdminLogin'],
            dropdowns: [
                views['AdminDropdownUser']
            ]
        });
        Bones.admin.render();
        if (!Bones.server) {
            Bones.user.status();
        }
    },
    newApp: function() {
        return new views.App({el: $('body')});
    },
    front: function() {
        var app = this.newApp();
        new views.Front({el: $('#view', app.el)});
        this.send(app);
    },
    country: function(id) {
        var router = this;
        var fetcher = this.fetcher();
        var indicators = new models.Indicators(null, {country: id});
        var app = this.newApp();

        fetcher.push(indicators);
        fetcher.fetch(function() {
            new views.Country({collection: indicators, el: $('#view', app.el)})
            router.send(app);
        });
    },
    send: function() {},
    fetcher: function() {
        var models = [];
        var fetched = 0;
        var done = function(callback) {
            return function() {
                if (++fetched == models.length) {
                    callback();
                }
            }
        };
        return {
            push: function(item) { models.push(item) },
            fetch: function(callback) {
                if (!models.length) return callback();
                var _done = done(callback);
                _.each(models, function(model) {
                    model.fetch({
                        success: _done,
                        error: _done
                    });
                });
            }
        }
    }
});
