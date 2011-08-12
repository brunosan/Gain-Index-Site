require('chrono');

model = Backbone.Model.extend({
    initialize: function() {
        _.bind(this, 'getFileSize', 'getDate');
    },
    url: function() {
        return '/api/Download/' + encodeURIComponent(this.get('id'));
    },
    getDate: function() {
        var d = new Date(this.get('timestamp'));
        return d.format('d F Y', 'CET');
    },
    getFileSize: function() {
        var value = this.get('size');

        var pow = Math.floor(Math.log(value) /  Math.log(1024));

        return (value / Math.pow(1024, pow))
            .toFixed(2)
            .replace(/00$/,'')
            .replace(/\.$/,'')
            + ['b', 'Kb', 'Mb', 'Gb'][pow];
    }
});
