router = Backbone.Router.extend({
    routes: {
        '/' : 'front',
        '/country/:id': 'country',
        '/ranking': 'rankingDefault',
        '/ranking/delta/:id': 'rankingDelta',
        '/ranking/:id': 'ranking',
        '/ranking/readiness/:id': 'ranking',
        '/ranking/vulnerability/:id': 'ranking',
        '/matrix': 'matrix',
        '/about': 'overview',
        '/about/:id': 'page',
        '/.*': 'error'
    },
    front: function() {
        var router = this;
        var fetcher = this.fetcher();
        var feature = new models.Front({id: 'front'});
        var ranking = new models.IndicatorSummary({id: 'gain', years: [views.App.endYear]});
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
        // Don't serve countries on /country/ISO
        if (id.length == 3 && _.detect(models.Country.meta, function(o) { return id == o.ISO3 })) {
            return router.error();
        }
        var country = new models.Country({id: id});
        fetcher.push(country);
        fetcher.fetch(function(err) {
            if (err) return router.error(err);
            router.send(views.Country, {model: country});
        });
    },
    rankingDelta: function(id) {
        return this.ranking((id || 'gain') + '_delta');
    },
    rankingDefault: function(id) {
        return this.ranking('gain');
    },
    ranking: function(id) {
        var router = this;
        var fetcher = this.fetcher();
        var ranking = new models.Ranking({id: id});

        fetcher.push(ranking);
        var trends = new models.Ranking({id: 'trend'});
        fetcher.push(trends);

        fetcher.fetch(function(err) {
            if (err) return router.error(err);
            router.send(views.Ranking, {model: ranking, trends: trends});
        });
    },
    overview: function() {
        return this.page('overview');
    },
    page: function(id) {
        // TODO: we shouldn't need to clean out fragments from requests.
        var id = id.split('#').shift(),
            router = this,
            fetcher = this.fetcher(),
            model = new models.Page({id: id});

        fetcher.push(model);

        // Download pages need an additional dynamic model loaded.
        if (id === 'download') {
            var download = new models.Download({id: 'data'});
            fetcher.push(download);
        }

        fetcher.fetch(function(err) {
            if (err) return router.error(err);
            var options = {model: model};
            download && (options.download = download);
            router.send(views.Page, options);
        });
    },
    matrix: function() {
        var router = this;
        var fetcher = this.fetcher();

        var vuln = new models.Ranking({id: 'vulnerability'});
        fetcher.push(vuln);

        var ready = new models.Ranking({id: 'readiness'});
        fetcher.push(ready);

        fetcher.fetch(function(err) {
            if (err) return router.error(err);
            router.send(views.Matrix, {readiness: ready, vulnerability: vuln});
        });
    },
    error: function(error) {
        this.send(views.Error, _.isArray(error) ? error.shift() : error);
    },
    send: function(view) {
        var options = arguments.length > 1 ? arguments[1] : {};
        var v = new view(options);
        $('#page').empty().append(v.el);
        v.render().attach().activeLinks().scrollTop();
        _gaq && _gaq.push(['_trackPageview']);
        document.title =  (v.pageTitle ? v.pageTitle + ' | GAIN Index' : 'GAIN Index');
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
