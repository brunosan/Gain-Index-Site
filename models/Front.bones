model = models.Document.extend({
    schema: {
        id: 'Front',
        type: 'object',
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
                'minlength': 1
            },
            'featuredSecond': {
                'type': 'string',
                'title': 'Featured',
                'required': true,
                'minlength': 1
            }
        }
    },
    url: function() {
        return '/api/Front/' + encodeURIComponent(this.id);
    }
});
