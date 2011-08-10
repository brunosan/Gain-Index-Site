var time = Date.now();

routers.App.prototype.send = function(view, options) {
    var options = arguments.length > 1 ? arguments[1] : {};

    // Execute the main view.
    var main = new view(options);
    main.render();
    
    var o = '{el: $("#main"),';
    _.each(options, function(v, k) {
        // Any options that is a model or collection will have it's title
        // declared. Use this to re-hydrate it.
        if (v.constructor.title != undefined) {
            o += JSON.stringify(k) + ': new models.'+ v.constructor.title +'('+ JSON.stringify(options[k]) +'),';
        } else {
            o += JSON.stringify(k) + ':' + JSON.stringify(options[k]) +',';
        }
    });
    o = o.replace(/,$/, '}');

    this.res.send(Bones.plugin.templates.App({
        version: time,
        main: $(main.el).html(),
        startup: 'Bones.initialize(function(models, views, routers, templates) {'+
                 'new views.' + main.constructor.title +'('+ o +').attach()'+
                 '});'
    }));

}
