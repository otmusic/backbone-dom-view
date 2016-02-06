// Generated by CoffeeScript 1.8.0
(function() {
  define(['chai', 'backbone', 'backbone-dom-view', 'jquery'], function(_arg, Backbone, DomView, $) {
    var expect, model;
    expect = _arg.expect;
    model = null;
    beforeEach(function() {
      return model = new Backbone.Model();
    });
    return describe('template helper', function() {
      return it('should combine parent selector and children selectors', function() {
        var View, view;
        View = DomView.extend({
          el: '<div>\n    <div data-item>\n        <div data-name></div>\n        <div data-count>\n            <div data-value></div>\n        </div>\n    </div>\n    <div data-title></div>\n    <div data-test>\n        <div data-name></div>\n    </div>\n</div>',
          ui: {
            test: '[data-test]'
          },
          template: {
            '[data-item]': {
              template: {
                '[data-name]': {
                  text: function() {
                    return 1;
                  }
                },
                '[data-count]': {
                  template: {
                    '[data-value]': {
                      text: function() {
                        return 2;
                      }
                    }
                  }
                }
              }
            },
            '[data-title]': {
              text: function() {
                return 3;
              }
            },
            'test': {
              template: {
                '[data-name]': {
                  text: function() {
                    return 4;
                  }
                }
              }
            }
          }
        });
        view = new View();
        expect(view.$('[data-item] [data-name]')).to.have.text('1');
        expect(view.$('[data-item] [data-count] [data-value]')).to.have.text('2');
        expect(view.$('[data-title]')).to.have.text('3');
        return expect(view.$('[data-test] [data-name]')).to.have.text('4');
      });
    });
  });

}).call(this);