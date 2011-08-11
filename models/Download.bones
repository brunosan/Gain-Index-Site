model = Backbone.Model.extend({
    url: function() {
        return '/api/Download/' + encodeURIComponent(this.get('id'));
    },
});
