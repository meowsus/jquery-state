;(function ($, window, document, undefined) {
    var pluginName = "state",

        stateHistory = [],

        // utilities
        sanitizeArgument = function (arg) {
            return (typeof arg === 'undefined') ? false : arg;
        },

        pluginInactive = function (element) {
            return $.data(element, 'plugin_' + pluginName) !== true;
        },

        seedGUID = function () {
            return Math.floor((1 + Math.random()) * 0x10000)
                   .toString(16)
                   .substring(1);
        },

        getGUID = function () {
            return seedGUID() + seedGUID() + seedGUID() + seedGUID();
        },

        // history helpers
        getElementsInNamespace = function (namespace) {
            var guids = [],
                elements = [];

            $.each(stateHistory, function (index, entry) {
                if (entry.namespace === namespace) {
                    if (guids.indexOf(entry.guid) === -1) {
                        guids.push(entry.guid);
                        elements.push(entry.element);
                    }
                }
            });

            return $(elements);
        };

    function Plugin (element, newState, namespace) {
        this.element = element;
        this.guid = getGUID();

        this.init(newState, namespace);
    }

    Plugin.prototype = {
        announce: function (newState, namespace) {
            $(this.element).trigger('state:' + namespace, [
                this.state,
                newState
            ]);
        },

        addToStateHistory: function (newState, namespace) {
            stateHistory.push({
                guid: this.guid,
                element: this.element,
                state: newState,
                namespace: namespace
            });
        },

        addState: function (newState, namespace) {
            if (typeof this.state[namespace] === 'undefined') {
                this.state[namespace] = [];
            }

            this.state[namespace].push(newState);
        },

        createState: function (newState, namespace) {
            this.state = {};
            this.state[namespace] = [];

            this.state[namespace].push(newState);
        },

        activate: function () {
            $.data(this.element, 'plugin_' + pluginName, true);
        },

        init: function (newState, namespace) {
            this.createState(newState, namespace);
            this.activate();
        }
    };

    $[pluginName] = function (action, namespace) {
        action = sanitizeArgument(action);
        namespace = sanitizeArgument(namespace);

        if (action === 'destroy') {
            stateHistory = [];
            return stateHistory;
        } else if (action === 'elementsIn') {
            if ( ! namespace) {
                throw new Error(
                    '`$.state("elementsIn")` requires a `namespace` String ' +
                    'as its second argument.'
                );
            }
            return getElementsInNamespace(namespace);
        } else {
            return stateHistory;
        }
    };

    $.fn[pluginName] = function (newState, namespace) {
        newState = sanitizeArgument(newState);
        namespace = sanitizeArgument(namespace);

        if (newState && ! $.isPlainObject(newState)) {
            throw new Error(
                'jQuery State requires the first argument be a plain Object.'
            );
        }

        if (newState && ! namespace) {
            throw new Error(
                'jQuery State requires the second argument to be a String.'
            );
        }

        if (newState && namespace) {
            return this.each(function () {
                var instance;

                if (pluginInactive(this)) {
                    instance = new Plugin(this, newState, namespace);
                    $.data(this, pluginName + '_instance', instance);
                } else {
                    instance = $.data(this, pluginName + '_instance');
                    instance.addState(newState, namespace);
                }

                instance.addToStateHistory(newState, namespace);
                instance.announce(newState, namespace);

                return this;
            });
        } else {
            var firstElement = $(this).first()[0];

            if (pluginInactive(firstElement)) {
                throw new Error(
                    'jQuery State has yet to be initialized on this element. ' +
                    'Initialize with `$(element).state(stateObj, namespace)`.'
                );
            }

            return $.data(firstElement, pluginName + '_instance').state;
        }
    };

})(jQuery, window, document);
