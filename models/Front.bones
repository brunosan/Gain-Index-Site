model = models.Document.extend({
    /*parse: function(resp) {
        resp.company = new models.Company(resp.company);
        return resp;
    },
    validateAttributes: function(attr) {
        // Validate non-standard maxWords schema attribute.
        var properties = this.schema.properties;
        var errors = [];
        var that = this;
        _(attr).each(function(v, k) {
            if (!properties[k]) return;
            if (properties[k].maxWords) {
                if (that.countWords(v) > properties[k].maxWords) {
                    errors.push((properties[k].title || k) + ' must contain less than ' + properties[k].maxWords + ' words');
                }
            }
        });
        if (errors.length) {
            return errors.shift();
        }
        return models.Document.prototype.validateAttributes.apply(this, arguments);
    },
    autocomplete: function(attribute, callback) {
        if (attribute == 'tags') {
            (new models.ProjectSearch({size: 0})).fetch({
                success: function(model, resp) {
                    var result = model.get('resultFacets');
                    var facets = _.detect(result, function(e) {
                        return e.options.facet == 'tags';
                    });
                    var terms = _.map(facets.models, function(e) {
                        return e.get('term');
                    });
                    terms.sort(function(a, b) {
                        return a > b;
                    });
                    callback(terms);
                },
                error: function() { callback([]); }
            });
        }
    },
    renderers: _.extend({
        'location': function(value) {
            return 'location';
        },
        'category': function(value) {
            // Copy from freetags renderer. How can we reuse better?
            return _.isArray(value) ? _.map(value, this.esc).join(', ') : '';
        },
        'markdownLimited': function(value) {
            return models.Document.prototype.renderers.markdown.apply(this, arguments);
        }
    }, models.Document.prototype.renderers),
    editors: _.extend({
        'location': {
            form: function(el, attribute) {
                var locations = this.get(attribute);
                var map_id = 'map-' + attribute;
                el.empty().append($("<input type='hidden' id='input-" + map_id +"' /><div id='" + map_id + "' class='input-map'></div>"));
                $('#input-' + map_id).val('[]');
                var mm = com.modestmaps;
                var m = new mm.Map(map_id,
                    new wax.mm.provider({
                      baseUrl: 'http://a.tiles.mapbox.com/mapbox/',
                      layerName: 'world-light'}), new mm.Point(430,200));
                wax.mm.zoomer(m);
                var pointselector = wax.mm.pointselector(m, function(coords) {
                    $('#input-' + map_id).val(JSON.stringify(coords));
                });
                if (locations) {
                    for (var i = 0; i < locations.length; i++) {
                        pointselector.addLocation(new mm.Location(locations[i].lat, locations[i].lon));
                    }
                }
                m.setCenterZoom(
                  new com.modestmaps.Location(58.539595,-39.726563), 2);
            },
            value: function(el, attribute) {
                var map_id = 'map-' + attribute;
                var val = JSON.parse($('#input-' + map_id).val());
                val = _.map(val, function(l) {

                    // Our widget allows longitudes to get recorded beyond
                    // +/-180 so we need to correct them.
                    l.lon = l.lon % 360;
                    if (l.lon < -180) l.lon += 360; else if (l.lon > 180) l.lon -= 360;

                    return l;
                });
                return val;
            }
        },
        'category': {
            form: function(el, attribute) {
                var that = this;
                var selected = this.get(attribute) || [];
                el.empty();
                _.each(this.schema.properties[attribute].items['enum'], function(v) {
                    var checkbox = $('<input>')
                        .attr('type', 'checkbox')
                        .attr('name', attribute)
                        .attr('value', v);
                    if (_.indexOf(selected, v) != -1) {
                        checkbox.attr('checked', 'checked');
                    }
                    el.append($('<div class="checkbox"></div>')
                        .append(checkbox)
                        .append('<label>' + that.esc(v) + '</label>'));
                });
            },
            value: function(el, attribute) {
                var categories = [];
                $("input", el).each(function(i, checkbox) {
                    $(checkbox).attr('checked') && categories.push($(checkbox).attr('value'));
                });
                return categories;
            }
        },
        'company': {
            form: function(el, attribute) {
                var company = this.get('company') || {};
                var companies = new models.CompanySearch({}, {size: 200});
                var select = $('<select></select>');
                companies.fetch({
                    success: function() {
                        select.append('<option>Select a company</option>');
                        companies.get('resultHits').each(function(v) {
                            var option = $('<option></option>')
                                .html(v.escape('name') || v.escape('id'))
                                .attr('name', v.get('id'));
                            (v.get('id') == company.id) &&
                                option.attr('selected', 'selected');
                            select.append(option);
                        });
                        el.empty().append(select);
                    },
                    error: function() {
                        select.append('<option>Error</option>');
                        el.empty().append(select);
                    }
                });
            },
            value: function(el, attribute) {
                var result = '';
                $("option", el).each(function(i, option) {
                    if ($(option).attr('selected')) {
                        result = $(option).attr('name');
                        return false;
                    }
                });
                return result;
            }
        },
        // TODO: Find a better way to extend behavior of existing formatters.
        'markdownLimited': {
            form: function(el, attribute) {
                models.Document.prototype.editors.markdown.form.apply(this, arguments);

                // Attach a word counter.
                var textarea = $('.attribute.' + attribute + ' textarea');
                var remaining = $('.attribute.' + attribute + ' .remaining');
                var maxLength = this.schema.properties[attribute].maxWords;
                var that = this;
                var updateCounter = function() {
                    var count = maxLength - that.countWords(textarea.val());
                    remaining.empty().append(count + ' words remaining');
                    remaining.removeClass('negative');
                    if (count < 0) {
                        remaining.addClass('negative');
                    }
                };
                textarea
                    .bind('keyup', updateCounter);
                updateCounter.call(textarea);
            },
            value: function(el, attribute) {
                return models.Document.prototype.editors.markdown.value.apply(this, arguments);
            }
        }
    }, models.Document.prototype.editors),
    countWords: function(str) {
        return !str.length ? str.length : str.split(' ').length;
    },
    // Experimental. Needs discussion and comparison to User.acl() approach.
    access: {
        'GET': function(req) {
            if (this.get('published')) return true;
            if (!req.session || !req.session.user) return false;
            if (req.session.user.hasGroup('admin')) return true;
            if (this.get('author') == req.session.user.id) return true;
            return false;
        },
        'DELETE': function(req) {
            if (!req.session || !req.session.user) return false;
            return req.session.user.hasGroup('admin');
        },
        'PUT POST': function(req) {
            if (!req.session || !req.session.user) return false;
            if (req.session.user.hasGroup('admin')) return true;
            if (req.query.featured) return false;
            if (this.get('author') == req.session.user.id) return true;
            return false;
        }
    },
*/
    schema: {
        id: 'Front',
        type: 'object',
        //errorMessages: {
        //    'required': '%title is required',
        //    'minLength': '%title is required',
        //    'pattern': '%title: only lower case letters, dashes and underscores are allowed'
        //},
        properties: {
            'id': {
                'type': 'string',
                'title': 'Path',
                'required': true,
                'minlength': 1,
                'pattern': '^[a-z0-9\-_]+$'
            },
            'featuredFirst': {
                'type': 'string',
                'title': 'Featured',
                'required': true,
                'minlength': 1,
            },
            'featuredSecond': {
                'type': 'string',
                'title': 'Featured',
                'required': true,
                'minlength': 1,
            }
        }
    },
    url: function() {
        return '/api/Front/' + encodeURIComponent(this.id);
    },
    link: function() {
        return '/front/' + encodeURIComponent(this.id);
    }
});
