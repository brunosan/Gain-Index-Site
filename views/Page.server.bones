view = views.Page.extend({
  render: function() {
      $(this.el).empty().append(templates.Page(this.model.renderer()));
      return this;
  }
});
