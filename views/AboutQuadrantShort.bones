view = views.AboutQuadrant.extend({
   initialize: function() {
       _.bind(this, 'render');
       this.templateName = 'AboutQuadrantShort';
       this.render();
   }
});
