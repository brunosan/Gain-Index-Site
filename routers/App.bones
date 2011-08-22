router = Backbone.Router.extend({
    routes: {
        '' : 'front',
        '/' : 'front',
        '/country/:id': 'country',
        '/ranking': 'rankingDefault',
        '/ranking/:id': 'ranking',
        '/ranking/readiness/:id': 'ranking',
        '/ranking/vulnerability/:id': 'ranking',
        '/download': 'download',
        '/matrix': 'matrix',
        '/about': 'overview',
        '/about/:id': 'page'
    },
    front: function() {
        var router = this;
        var fetcher = this.fetcher();
        var feature = new models.Front({id: 'front'});
        var ranking = new models.IndicatorSummary({id: 'gain'}, {years: [2009]});
        fetcher.push(feature);
        fetcher.push(ranking);
        fetcher.fetch(function() {
            var featuredFirst = new models.Country({id: feature.get('featuredFirst')});
            var featuredSecond = new models.Country({id: feature.get('featuredSecond')});
            // Reset fetcher
            var fetcher = router.fetcher();
            fetcher.push(featuredFirst);
            fetcher.push(featuredSecond);
            fetcher.fetch(function() {
                var collection = new models.Countries([featuredFirst, featuredSecond]);
                fetcher.fetch(function() {
                    router.send(views.Front, {model: ranking, collection: collection});
                });
            });
        });
    },
    country: function(id) {
        var router = this;
        var fetcher = this.fetcher();
        var country = new models.Country({id: id});

        fetcher.push(country);
        fetcher.fetch(function(err) {
            if (err) return router.error(err);
            router.send(views.Country, {model: country});
        });
    },
    rankingDefault: function(id) {
        return this.ranking('gain');
    },
    ranking: function(id) {
        var router = this;
        var fetcher = this.fetcher();
        var ranking = new models.Ranking({id: id});

        fetcher.push(ranking);
        fetcher.fetch(function(err) {
            if (err) return router.error(err);
            router.send(views.Ranking, {model: ranking});
        });
    },
    download: function() {
        var router = this;
        var fetcher = this.fetcher();
        var model = new models.Download({id: 'data'});

        fetcher.push(model);
        fetcher.fetch(function() {
            router.send(views.Download, {model: model});
        });
    },
    overview: function() {
        return this.page('overview');
    },
    page: function(id) {
        var router = this;
        var fetcher = this.fetcher();
        var model = new models.Page({id: id});

        fetcher.push(model);
        fetcher.fetch(function(err) {
            if (err) return router.error(err);
            router.send(views.Page, {model: model});
        });
    },
    matrix: function() {
        this.send(views.Matrix);
    },
    error: function(error) {
        this.send(views.Error, _.isArray(error) ? error.shift() : error);
    },
    send: function(view) {
        var options = arguments.length > 1 ? arguments[1] : {};
        var v = new view(options);
        $('#page').empty().append(v.el);
        v.render().attach().activeLinks();
    },
    fetcher: function() {
        var models = [];

        return {
            push: function(item) { models.push(item) },
            fetch: function(callback) {
                if (!models.length) return callback();
                var errors = [];
                var _done = _.after(models.length, function() {
                    callback(errors.length ? errors : null);
                });
                _.each(models, function(model) {
                    model.fetch({
                        success: _done,
                        error: function(error) {
                            errors.push(error);
                            _done();
                        }
                    });
                });
            }
        }
    }
});
