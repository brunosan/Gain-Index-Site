var time = Date.now();

views['App'].augment({
    // Server specific setup:
    // wrap Layout._ into App._ to deliver the full HTML page.
    render: function() {
        this.el = templates.App({
            version: time,
            layout: $(this.el).html()
        });
        return this;
    }
});
