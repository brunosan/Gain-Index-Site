router = Backbone.Router.extend({
    routes: {
        '/' : 'home',
    },
    home: function() {
        this.send(new views.App().el);
    },
    notFound: function() {
        this.send(new views.App({view: new views.Error()}).el);
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
