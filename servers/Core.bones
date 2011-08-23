server = servers.Core.augment({
    initialize: function(parent, app) {
        parent.call(this, app);
        this.enable('jsonp callback');
    }
});
