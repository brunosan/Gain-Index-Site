var time = Date.now();

routers.App.prototype.send = function(view, options) {
    var options = arguments.length > 1 ? arguments[1] : {};
    var main = new view(options);

    this.res.send(Bones.plugin.templates.App({
        version: time,
        main: $(main.el).html(),
        startup: 'Bones.initialize(function(models, views, routers, templates) {'+
                 '  new views.' + main.constructor.title +'('+ JSON.stringify(options) +')'+
                 '});'
    }));

}
