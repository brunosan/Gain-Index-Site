env = process.env.NODE_ENV || 'development';

server = Bones.Server.extend();

server.prototype.initialize = function(app) {
    if (env == 'production') {
        this.config = app.config;
        this.config.maxAge = this.config.maxAge;
        this.use(this.expiry.bind(this));
    }
};

// Set Cache-Control header from setting, except for certain endpoints.
server.prototype.expiry = function(req, res, next) {
    var url = req.url;
    if (!res.header('Cache-Control')) {
        //  Don't cache /api/Page/* and /api/Front/*
        if (url.search(/(^\/api\/(Page|Front)).*/i) > -1) {
            res.header('Cache-Control', 'max-age=0');
        } else {
            res.header('Cache-Control', 'max-age=' + this.config.maxAge); 
        }
    }
    next();
};
