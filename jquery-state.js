;(function ($, window, document, undefined) {
    var pluginName = "state",

        // utilities
        sanitizeArgument = function (arg) {
            return (typeof arg === 'undefined') ? false : arg;
        },

        activatePlugin = function (instance) {
            $.data(instance.element, 'plugin_' + pluginName, true);
        },

        pluginInactive = function (element) {
            return $.data(element, 'plugin_' + pluginName) !== true;
        },

        throwInitializeError = function () {
            throw new Error(
                'jQuery State has yet to be initialized on this element. ' +
                'Initialize with `$(element).state(stateObj, namespace)`.'
            );
        };

    function Plugin (element, newState, namespace) {
        this.element = element;

        this.init(newState, namespace);
    }

    Plugin.prototype = {
        announce: function (newState, namespace) {
            $(this.element).trigger('state:' + namespace, [
                this.state,
                newState
            ]);
        },

        addState: function (newState, namespace) {
            if (typeof this.state[namespace] === 'undefined') {
                this.state[namespace] = [];
            }

            this.state[namespace].push(newState);
            this.announce(newState, namespace);
        },

        createState: function (newState, namespace) {
            this.state = {};
            this.state[namespace] = [];
            this.state[namespace].push(newState);
            this.announce(newState, namespace);
        },

        init: function (newState, namespace) {
            this.createState(newState, namespace);
            activatePlugin(this);
        }
    };

    $.fn[pluginName] = function (newState, namespace) {
        newState = sanitizeArgument(newState);
        namespace = sanitizeArgument(namespace);

        if (newState && namespace) {
            return this.each(function () {
                var instance;

                if (pluginInactive(this)) {
                    instance = new Plugin(this, newState, namespace);

                    $.data(this, pluginName + '_instance', instance);

                    return instance;
                } else {
                    instance = $.data(this, pluginName + '_instance');

                    instance.addState(newState, namespace);

                    return instance;
                }
            });
        } else {
            var firstElement = $(this).first()[0];

            if (pluginInactive(firstElement)) { throwInitializeError(); }

            return $.data(firstElement, pluginName + '_instance').state;
        }
    };

})( jQuery, window, document );
