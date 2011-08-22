// Map
// -------
model = Backbone.Model.extend({
    initialize: function(attr, options) {
        _.bindAll(this, 'tilejson', 'updateMap');

        var mm = com.modestmaps,
            tilejson = this.tilejson(),
            tooltip = wax.tooltip;


        // Setup the map and add it to the model.
        // NOTE: the maps default element, width and height, etc.. can be overridden.
        var elem = options.el || 'map',
            width = options.width || 640,
            height = options.height || 490,
            lat = options.lat || -98,
            lon = options.lon || 39,
            z = options.z || 2;

        var m = new mm.Map(elem, new wax.mm.connector(tilejson), new mm.Point(width, height));
        this.set({map: m}, {silent: true});

        // Add fullscreen laters...
        //wax.mm.fullscreen(m, tilejson).appendTo(m.parent);

        var that = this;
        tooltip.prototype.click = function(feature, context, index) {
            that.featureClick(feature, context, index);
        };
        wax.mm.interaction(m, tilejson, {callbacks: new tooltip });

        m.setCenterZoom(new mm.Location(lon, lat), z);

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
