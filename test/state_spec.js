var chai   = require('chai'),
    expect = chai.expect,
    sinon  = require('sinon'),
    jQuery = require('jQuery'),
    jsdom  = require('jsdom').jsdom,

    document = global.document = jsdom('<html><body></body></html>'),
    window   = global.window   = document.defaultView,

    $ = global.jQuery = jQuery(window);

chai.use(require('sinon-chai'));

require('../jquery-state');
describe('state', function () {
    var $elements, $element1, $element2;

    beforeEach(function () {
        $('body').append('<div id="element1"></div><div id="element2"></div>');
        $elements = $('#element1, #element2');
        $element1 = $('#element1');
        $element2 = $('#element2');
    });

    afterEach(function () {
        $('body').empty();
    });

    it('inits and activates the plugin', function () {
        $elements.state({ foo: 'bar' }, 'thud');

        expect($element1.data('plugin_state')).to.equal(true);
        expect($element2.data('plugin_state')).to.equal(true);

        expect(typeof $element1.data('state_instance') !== 'undefined').to.equal(true);
        expect(typeof $element2.data('state_instance') !== 'undefined').to.equal(true);
    });

    it('errors if no args supplied & state has not been set', function () {
        expect($elements.state.bind(null)).to.throw('yet to be initialized');
    });

    it('returns first state, if passed a collection, without args', function () {
        $elements.each(function (index, element) {
            $(element).state({ index: index }, 'xyzzy');
        });

        expect($elements.state().xyzzy[0].index).to.equal(0);
        expect($elements.state().xyzzy[0].index).to.not.equal(1);
    });

    it('accrues to state as it\'s called', function () {
        $element1.state({ foo: 'bar' }, 'plugh');
        $element1.state({ bar: 'baz' }, 'fred');
        $element1.state({ baz: 'qux', qux: 'quux' }, 'plugh');

        expect($element1.state().fred.length).to.equal(1);
        expect($element1.state().plugh.length).to.equal(2);

        expect($element1.state().plugh[0].foo).to.equal('bar');
        expect($element1.state().plugh[1].baz).to.equal('qux');
        expect($element1.state().plugh[1].qux).to.equal('quux');

        expect($element1.state().fred[0].bar).to.equal('baz');
    });

    it('announces state change on the element', function () {
        $element1.on('state:waldo', function (event, full, current) {
            expect(full.waldo[0].foo).to.equal('bar');
            expect(current.foo).to.equal('bar');
        });

        $elements.state({ foo: 'bar' }, 'waldo');
    });
});
