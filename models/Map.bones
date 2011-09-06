// Map
// Apologies are due here. This 'model' is very tightly tied to the DOM which
// renders the map. It needs to be refactors into a view and model.
// -------
model = Backbone.Model.extend({
    initialize: function(attr, options) {
        _.bindAll(this, 'tilejson', 'updateMap', 'featureHover');

        options = options || {};

        // Setup the map and add it to the model.
        // NOTE: the maps default element, width and height, etc.. can be overridden.
        var el = options.el || document.getElementById('map'),
            width = options.width || 640,
            height = options.height || 490,
            lat = options.lat || 15,
            lon = options.lon || -8,
            z = options.z || 2,
            extent = options.extent || false;

        this.controls = options.controls || ['interaction'],
        this.el = el; // Sorry mom!

        var mm = com.modestmaps,
            tilejson = this.tilejson();

        var mapEl= $("<div></div>").addClass('map');
        $(el).append(mapEl);

        var m = new mm.Map(mapEl[0], new wax.mm.connector(tilejson), new mm.Point(width, height), [
            new mm.DragHandler,
            new mm.DoubleClickHandler,
            new mm.MouseWheelHandler,
            new mm.TouchHandler
        ]);
        this.set({
            width: width,
            height: height
        }, {silent: true});
        this.m = m; // Not using set/get to avoid needless comparisons;

        // Add fullscreen laters...
        //wax.mm.fullscreen(m, tilejson).appendTo(m.parent);

        // Setup our tool tip.
        this.tooltip = new wax.tooltip();
        var that = this;
        this.tooltip.click = function(feature, context, index) {
            that.featureClick(feature, context, index);
        };
        this.addControls();

        if (!extent) {
            m.setCenterZoom(new mm.Location(lat, lon), z);
        } else {
            m.setExtent([
                new mm.Location(extent[1], extent[0]),
                new mm.Location(extent[3], extent[2])
            ]);
        }

        // Bind to the change event of the map model so that any time the year
        // or indicator is changed we automatically update the map.
        this.bind('change', this.updateMap);
    },
    addControls: function() {
        var model = this;
        var controls = {
            interaction: function() {
                wax.mm.interaction(model.m, model.tilejson(), {callbacks: model.tooltip });
            },
            zoomer: function() {
                if ($('.zoom-control', model.el).length == 0) {
                    $(model.el).append("<div class='zoom-control'></div>");
                }
                wax.mm.zoomer(model.m).appendTo($('.zoom-control', model.el).empty().get(0));
            }
        };
        _.each(this.controls, function(v) {
            controls[v]();
        });
    },
    tilejson: function() {
        var ind = this.get('indicator'),
            y = this.get('year');

        return tilejson = {
            tilejson: '1.0.0',
            scheme: 'tms',
            tiles: ['http://'+ location.host+'/tiles/1.0.0/'+ ind +'-'+ y +'/{z}/{x}/{y}.png'],
            grids: ['http://'+ location.host+'/tiles/1.0.0/'+ ind +'-'+ y +'/{z}/{x}/{y}.grid.json'],
            formatter: this.featureHover,
            minzoom: 1,
            maxzoom: 6
        };
    },
    updateMap: function() {
        var mm = com.modestmaps,
            tilejson = this.tilejson(),
            coord = this.m.coordinate;
            el = this.el,
            width = this.get('width'),
            height = this.get('height');

        // Remove old map.
        $('.map.obsolete', el).remove();

        // Mark existing map div for removal.
        $('.map', el).addClass('obsolete');

        // Add new element
        mapEl= $("<div></div>").addClass('map');
        $('.map:last', el).after(mapEl);

        // Setup new map in new div.
        var m = new mm.Map(mapEl[0], new wax.mm.connector(tilejson), new mm.Point(width, height), [
            new mm.DragHandler,
            new mm.DoubleClickHandler,
            new mm.MouseWheelHandler,
            new mm.TouchHandler
        ]);

        // Link panning and zooming for old and new maps.
        var om = this.m;
        m.addCallback('panned', function(map, coords) { om.panBy(coords[0], coords[1]); });
        m.addCallback('zoomed', function(map, offset) { om.zoomBy(offset); });

        this.m = m;
        this.addControls();
        m.coordinate = coord;
        m.draw();
    },
    featureHover: function(options, data) {
        var inlineData= '',
            val = '';
        if (data.factor_raw === undefined) {
            val = "Not evaluated";
        } else if (data.factor_raw === 0) {
            val = "No GaIn&trade; score";
            inlineData = ' data-iso="' + data.iso_a3 + '"';
        } else {
            var ind = this.get('indicator');
            val = models.Indicator.format(data.factor_raw, ind);
            inlineData = ' data-iso="' + data.iso_a3 + '"';
        }
        
        return '<span'+ inlineData +'>' + data.admin + ': '+ val +'</span>';
    },
    featureClick: function(feature, context, index) {
        // no-op.
    }
});
