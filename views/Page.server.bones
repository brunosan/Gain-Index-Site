view = views.Page.extend({
  render: function() {
      console.warn('backend');
      $(this.el).empty().append(templates.Page(this.model.renderer()));
      return this;
  }
});
