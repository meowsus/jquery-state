const chai   = require('chai');
const expect = chai.expect;
const sinon  = require('sinon');
const jQuery = require('jquery');
const jsdom  = require('jsdom');
const { JSDOM } = jsdom;

const document = global.document = new JSDOM('<html><body></body></html>');
const window   = global.window   = document.window;

const $ = global.jQuery = jQuery(window);

let $collection, $element1, $element2;

chai.use(require('sinon-chai'));

require('../jquery-state');

beforeEach(function () {
    $('body').append('<div id="element1"></div><div id="element2"></div>');
    $collection = $('#element1, #element2');
    $element1 = $('#element1');
    $element2 = $('#element2');
});

afterEach(function () {
    $('body').empty();
    $.state('destroy');
});

describe('$.state()', function () {
    it('$.state() returns raw global state history', function () {
        $element1.state({ foo: 'bar' }, 'thud');
        $element2.state({ bar: 'baz' }, 'xyzzy');

        expect($.state().length).to.equal(2);
        expect($.state()[0].guid.length).to.equal(16);
        expect($.state()[1].guid.length).to.equal(16);
        expect($.state()[0].element instanceof window.HTMLElement).to.equal(true);
        expect($.state()[1].element instanceof window.HTMLElement).to.equal(true);
        expect($.state()[0].state.foo).to.equal('bar');
        expect($.state()[1].state.bar).to.equal('baz');
        expect($.state()[0].namespace).to.equal('thud');
        expect($.state()[1].namespace).to.equal('xyzzy');
    });

    it('$.state("destroy") resets global state history', function () {
        $element1.state({ foo: 'bar' }, 'thud');
        $element2.state({ bar: 'baz' }, 'xyzzy');

        expect($.state('destroy')).to.be.empty;
        expect($.state()).to.be.empty;
    });

    it('$.state("elementsIn") throws an error', function () {
        expect($.state.bind(null, 'elementsIn')).to.throw('second argument');
    });

    it('$.state("elementsIn", x) returns a collection of elements in the x namespace', function () {
        var $elements;

        $collection.state({ foo: 'bar' }, 'thud');

        $elements = $.state('elementsIn', 'thud');

        expect($elements.length).to.equal(2);
        expect($elements.get(0)).to.equal($element1[0]);
        expect($elements.get(1)).to.equal($element2[0]);
    });
});

describe('$(selector).state()', function () {
    it('$(whatever).state(x) throws an error if x is not an Object ', function () {
        expect($collection.state.bind(null, 'String')).to.throw('first argument');
    });

    it('$(whatever).state(x) throws an error if x is the only argument', function () {
        expect($collection.state.bind(null, { foo: 'bar' })).to.throw('second argument');
    });

    it('$(whatever).state() throws an error if not yet initialized', function () {
        expect($collection.state.bind(null)).to.throw('yet to be initialized');
    });

    it('$(element).state() gets the state of the element', function () {
        $element1.state({ foo: 'bar' }, 'thud');
        $element1.state({ bar: 'baz' }, 'thud');
        $element1.state({ baz: 'qux' }, 'thud');

        expect($collection.state().thud.length).to.equal(3);
        expect($element1.state().thud[0].foo).to.equal('bar');
        expect($element1.state().thud[1].bar).to.equal('baz');
        expect($element1.state().thud[2].baz).to.equal('qux');
    });

    it('$(collection).state() get the state of the first element in collection', function () {
        $collection.state({ foo: 'bar' }, 'thud');
        $element1.state({ bar: 'baz' }, 'thud');
        $element2.state({ baz: 'qux' }, 'thud');

        expect($collection.state().thud.length).to.equal(2);
        expect($collection.state().thud[0].foo).to.equal('bar');
        expect($collection.state().thud[1].bar).to.equal('baz');
    });

    it('$(whatever).state(x, y) allows chaining', function () {
        $element1.state({ foo: 'bar' }, 'thud').append('<div id="chain" />');
        expect($('#chain', $element1).length).to.equal(1);
    });

    it('$(collection).state(x, y) inits each element in collection', function () {
        $collection.state({ foo: 'bar' }, 'thud');

        expect($element1.data('plugin_state')).to.equal(true);
        expect($element2.data('plugin_state')).to.equal(true);
    });

    it('$(whatever).state(x, y) adds state to element', function () {
        $collection.state({ foo: 'bar' }, 'thud');
        $element2.state({ bar: 'baz' }, 'thud');
        $element2.state({ baz: 'qux' }, 'thud');
        $collection.state({ qux: 'quux' }, 'xyzzy');

        expect($element1.state().thud[0].foo).to.equal('bar');
        expect($element1.state().xyzzy[0].qux).to.equal('quux');
        expect($element2.state().xyzzy[0].qux).to.equal('quux');
        expect($element2.state().thud[0].foo).to.equal('bar');
        expect($element2.state().thud[1].bar).to.equal('baz');
        expect($element2.state().thud[2].baz).to.equal('qux');
    });

    it('$(collection).state(x, y) announces once per element in collection', function () {
        var testEvent = function (event, full, current) {
                expect(full.thud.length).to.equal(1);
                expect(full.thud[0].foo).to.equal('bar');
                expect(current.foo).to.equal('bar');
            };

        $element1.on('state:thud', testEvent);
        $element2.on('state:thud', testEvent);

        $collection.state({ foo: 'bar' }, 'thud');
    });
});
