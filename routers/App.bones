router = Backbone.Router.extend({
    routes: {
        '' : 'front',
        '/' : 'front',
        '/country/:id': 'country',
        '/ranking': 'ranking',
        '/page/:id': 'page'
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
    front: function() {
        this.send(new views.Front());
    },
    country: function(id) {
        var router = this;
        var fetcher = this.fetcher();
        var indicators = new models.Indicators(null, {country: id});

        fetcher.push(indicators);
        fetcher.fetch(function() {
            router.send(new views.Country({collection: indicators}));
        });
    },
    ranking: function() {
        var router = this;
        var fetcher = this.fetcher();
        var indicators = new models.Indicators(null, {indicator: 'gain'});

        fetcher.push(indicators);
        fetcher.fetch(function() {
            router.send(new views.Ranking({collection: indicators}));
        });
    },
    pageEditor: function(id) {
        this.page(id, true);
    },
    page: function(id) {
        var router = this;
        var fetcher = this.fetcher();

        var model = new models.Page({id: id}, {
            route: '/' + id,
        });

        fetcher.push(model);
        fetcher.fetch(function() {
            var view = new views.Page({model: model});
            router.send(view);
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
