// Map
// -------
model = Backbone.Model.extend({
    initialize: function(attr, options) {
        _.bindAll(this, 'tilejson', 'updateMap');

        var mm = com.modestmaps,
            tilejson = this.tilejson(),
            tooltip = wax.tooltip;


        // Setup the map and add it to the model.
        var m = new mm.Map('map', new wax.mm.connector(tilejson), new mm.Point(640,490));
        this.set({map: m}, {silent: true});

        // Add fullscreen laters...
        //wax.mm.fullscreen(m, tilejson).appendTo(m.parent);

        var that = this;
        tooltip.prototype.click = function(feature, context, index) {
            that.featureClick(feature, context, index);
        };
        wax.mm.interaction(m, tilejson, {callbacks: new tooltip });

        m.setCenterZoom(new mm.Location(39, -98), 2);

        // Bind to the change event of the map model so that any time the year
        // or indicator is changed we automatically update the map.
        this.bind('change', this.updateMap);
    },
    tilejson: function() {
        var ind = this.get('indicator'),
            y = this.get('year');

        return tilejson = {
            tilejson: '1.0.0',
            scheme: 'tms',
            tiles: ['http://'+ location.hostname +':3001/1.0.0/'+ ind +'-'+ y +'/{z}/{x}/{y}.png'],
            grids: ['http://'+ location.hostname +':3001/1.0.0/'+ ind +'-'+ y +'/{z}/{x}/{y}.grid.json'],
            formatter: function(options, data) {
                return '<span data-iso="' + data.iso_a3 + '">' + data.admin + '</span>';
            }
        };
    },
    updateMap: function() {
        var tilejson = this.tilejson();
            m = this.get('map');

        m.setProvider(new wax.mm.connector(tilejson));
    },
    featureClick: function(feature, context, index) {
        // no-op.
        //return view.openDrawer($(feature).data('iso'));
    }
});
