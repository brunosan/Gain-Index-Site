$(function() {
    // Global tracking of pressed keys.
    $(document).keydown(function(ev) {
        window.currentKeys = window.currentKeys || {};
        window.currentKeys[ev.keyCode] = ev;
    });
    $(document).keyup(function(ev) {
        window.currentKeys = window.currentKeys || {};
        if (window.currentKeys[ev.keyCode]) {
            delete window.currentKeys[ev.keyCode];
        }
    });

});
