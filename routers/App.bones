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
        '/page/:id': 'page'
    },
    front: function() {
        var router = this;
        var fetcher = this.fetcher();
        var feature = new models.Front({id: 'front'});
        fetcher.push(feature);
        fetcher.fetch(function() {
            var countries = [feature.get('featuredFirst'), feature.get('featuredSecond')];
            var featuredFirst = new models.Country({id: feature.get('featuredFirst')});
            var featuredSecond = new models.Country({id: feature.get('featuredSecond')});
            fetcher.push(featuredFirst);
            fetcher.push(featuredSecond);
            fetcher.fetch(function() {
                // @TODO featuredSecond doesn't get fetched.
                //console.log(featuredFirst.get('indicators').getGraphData('name', 'gdp'));
                router.send(views.Front, {model: {featuredFirst: featuredFirst, featuredSecond: featuredSecond}});
            });
        });
    },
    country: function(id) {
        var router = this;
        var fetcher = this.fetcher();
        var country = new models.Country({id: id});

        fetcher.push(country);
        fetcher.fetch(function() {
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
        fetcher.fetch(function() {
            router.send(views.Ranking, {model: ranking});
        });
    },
    pageEditor: function(id) {
        this.page(id, true);
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
    page: function(id) {
        var router = this;
        var fetcher = this.fetcher();

        var model = new models.Page({id: id}, {
            route: '/' + id,
        });

        fetcher.push(model);
        fetcher.fetch(function() {
            router.send(views.Page, {model: model});
        });

    },
    send: function(view) {
        var options = arguments.length > 1 ? arguments[1] : {};
        var v = new view(options);
        $('#page').empty().append(v.el);
        v.render().attach().activeLinks();
    },
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
