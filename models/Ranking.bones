model = Backbone.Collection.extend({
    url: function() {
        return '/api/Ranking/' + encodeURIComponent(this.get('id'));
    }
});
