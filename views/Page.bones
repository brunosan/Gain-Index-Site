view = views.Document.extend({
    render: function(options) {
        // Approach the cabinet.
        $(this.el).empty().append(templates.Cabinet({klass: 'page'}));
        var renderer = this.model.renderer()
        $('.top', this.el).empty().append(templates.Page(renderer));

        // download page has an additional dynamic block associated with it.
        if (this.options.download && this.model.id == 'download') {
            var dl = $('#downloadlink', this.el);
            dl.length && $(dl).empty().append(
                templates.Download({model: this.options.download})
            );
        }

        // Add overview video to the about page.
        if (this.model.id == 'overview') {
            var video = $('#overviewvideo', this.el);
            video.innerHTML = '<iframe width="640" height="360" src="http://www.youtube.com/embed/N-SCq634Y2g?feature=player_detailpage" frameborder="0" allowfullscreen></iframe>';
        }

        // Some things fall on the floor.
        $('.floor', this.el).empty().append(templates.AboutFloor());
        this.pageTitle = renderer.render('name');
        return this;
    }
});
