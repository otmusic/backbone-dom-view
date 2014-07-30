// Generated by LiveScript 1.2.0
(function(){
  var slice$ = [].slice;
  function def(modules, module){
    if (typeof define === 'function' && define.amd) {
      return define(modules, module);
    } else {
      return module(Backbone);
    }
  }
  def(['backbone'], function(Backbone){
    var DOMView, helpers, dividedField, fieldEvent, viewEvent, argSelector;
    DOMView = Backbone.DOMView = Backbone.View.extend({
      constructor: function(ops){
        var rest, selector, ref$, helps, helper, options, own$ = {}.hasOwnProperty;
        rest = slice$.call(arguments, 1);
        if (ops instanceof Backbone.Model || ops instanceof Backbone.Collection) {
          Backbone.View.apply(this, [{
            model: ops
          }].concat(rest));
        } else {
          Backbone.View.apply(this, arguments);
        }
        if (typeof this.template === 'object') {
          this.template = Backbone.$.extend(true, {}, parentTemplate(this) || {}, this.template);
          for (selector in ref$ = this.template) if (own$.call(ref$, selector)) {
            helps = ref$[selector];
            for (helper in helps) if (own$.call(helps, helper)) {
              options = helps[helper];
              helpers[helper].call(this, selector, options);
            }
          }
          this.trigger('template-ready');
        }
      },
      find: function(selector){
        if (selector) {
          return this.$el.find(selector);
        } else {
          return this.$el;
        }
      }
    });
    helpers = DOMView.helpers = {
      'class': classHelper,
      attr: attrHelper,
      prop: propHelper,
      style: styleHelper,
      html: htmlHelper,
      text: textHelper,
      on: onHelper,
      connect: connectHelper,
      each: eachHelper
    };
    function classHelper(selector, options){
      callJquerySetterMethod.call(this, {
        node: this.find(selector),
        method: 'toggleClass',
        options: options,
        wrapper: function(v){
          return !!v;
        }
      });
    }
    function attrHelper(selector, options){
      callJquerySetterMethod.call(this, {
        node: this.find(selector),
        method: 'attr',
        options: options
      });
    }
    function propHelper(selector, options){
      callJquerySetterMethod.call(this, {
        node: this.find(selector),
        method: 'prop',
        options: options
      });
    }
    function styleHelper(selector, options){
      callJquerySetterMethod.call(this, {
        node: this.find(selector),
        method: 'css',
        options: options
      });
    }
    function htmlHelper(selector, options){
      callJqueryMethod.call(this, {
        node: this.find(selector),
        method: 'html',
        options: options
      });
    }
    function textHelper(selector, options){
      callJqueryMethod.call(this, {
        node: this.find(selector),
        method: 'text',
        options: options
      });
    }
    function onHelper(selector, options){
      var node, i$, own$ = {}.hasOwnProperty;
      node = this.find(selector);
      for (i$ in options) if (own$.call(options, i$)) {
        (fn$.call(this, i$, options[i$]));
      }
      function fn$(event, func){
        var this$ = this;
        node.on(event, function(){
          return func.apply(this$, arguments);
        });
      }
    }
    function connectHelper(selector, options){
      var node, i$, own$ = {}.hasOwnProperty;
      node = this.find(selector);
      for (i$ in options) if (own$.call(options, i$)) {
        (fn$.call(this, i$, options[i$]));
      }
      function fn$(prop, field){
        var event, propEvent, x, this$ = this;
        event = 'change';
        if (propEvent = prop.match(dividedField)) {
          x = propEvent[0], prop = propEvent[1], event = propEvent[2];
        }
        node.on(event, function(){
          return this$.model.set(field, node.prop(prop));
        });
        this.listenTo(this.model, 'change:' + field, function(model, value){
          if (value !== node.prop(prop)) {
            return node.prop(prop, value);
          }
        });
        node.prop(prop, this.model.get(field));
      }
    }
    dividedField = /^(.+)\|(.+)/;
    fieldEvent = /@([\w-]+)/;
    viewEvent = /#([\w-:\.]+)/;
    argSelector = /\|arg\((\d+)\)/;
    function callJqueryMethod(ops){
      var node, method, options, wrapper, fieldName, model, view, i$, value, own$ = {}.hasOwnProperty;
      node = ops.node, method = ops.method, options = ops.options, wrapper = ops.wrapper, fieldName = ops.fieldName;
      model = this.model;
      view = this;
      ops = Backbone.$.extend({}, ops);
      ops.view = view;
      ops.model = view.model;
      switch (typeof options) {
      case 'string':
        ops.events = options.split(/\s+/);
        convertEvents(ops);
        break;
      case 'object':
        for (i$ in options) if (own$.call(options, i$)) {
          (fn$.call(this, i$, options[i$]));
        }
        break;
      case 'function':
        value = options.apply(view, arguments);
        ops.value = value;
        applyJqueryMethod(ops);
      }
      function fn$(events, func){
        ops.events = events.split(/\s+/);
        ops.func = func;
        convertEvents(ops);
      }
    }
    function convertEvents(ops){
      var node, method, events, wrapper, fieldName, func, view, model, i$, len$;
      node = ops.node, method = ops.method, events = ops.events, wrapper = ops.wrapper, fieldName = ops.fieldName, func = ops.func, view = ops.view, model = ops.model;
      for (i$ = 0, len$ = events.length; i$ < len$; ++i$) {
        (fn$.call(this, events[i$]));
      }
      function fn$(event){
        var target, argNum;
        target = model;
        argNum = 0;
        event = event.replace(argSelector, function(x, num){
          argNum = num;
          return '';
        });
        event = event.replace(fieldEvent, function(x, field){
          target = model;
          argNum = 1;
          helperHandler(target, model.get(field));
          return 'change:' + field;
        });
        event = event.replace(viewEvent, function(x, event){
          target = view;
          return event;
        });
        if (target === model) {
          view.listenTo(model, event, helperHandler);
        } else {
          view.on(event, helperHandler);
        }
        function helperHandler(){
          var value;
          if (func) {
            value = func.apply(view, arguments);
          } else {
            value = arguments[argNum];
          }
          ops.value = value;
          applyJqueryMethod(ops);
        }
      }
    }
    function applyJqueryMethod(ops){
      var node, method, fieldName, wrapper, value;
      node = ops.node, method = ops.method, fieldName = ops.fieldName, wrapper = ops.wrapper, value = ops.value;
      if (wrapper) {
        value = wrapper(value);
      }
      if (fieldName) {
        node[method](fieldName, value);
      } else {
        node[method](value);
      }
    }
    function callJquerySetterMethod(ops){
      var options, name, value, own$ = {}.hasOwnProperty;
      options = ops.options;
      for (name in options) if (own$.call(options, name)) {
        value = options[name];
        ops.fieldName = name;
        ops.options = value;
        callJqueryMethod.call(this, ops);
      }
    }
    function eachHelper(selector, options){
      var view, holder, itemTpl, list, field;
      view = this;
      holder = this.find(selector);
      itemTpl = options.el ? holder.find(options.el).detach() : false;
      list = (field = options.field)
        ? this.model.get(field)
        : this.model;
      options.viewList = {};
      options.addHandler == null && (options.addHandler = 'append');
      options.delHandler == null && (options.delHandler = 'remove');
      if (typeof options.addHandler === 'string') {
        options.addHandler = eachHelper.addHandlers[options.addHandler];
      }
      if (typeof options.delHandler === 'string') {
        options.delHandler = eachHelper.delHandlers[options.delHandler];
      }
      view.listenTo(list, 'add', eachAddListener);
      view.listenTo(list, 'remove', eachRemoveListener);
      list.each(eachAddListener);
      function eachAddListener(model){
        var View, instOps, viewInst;
        View = isClass(options.view)
          ? options.view
          : options.view.call(view, model);
        if (isClass(View)) {
          instOps = {
            model: model
          };
          if (itemTpl) {
            instOps.el = itemTpl.clone();
          }
          viewInst = new View(instOps);
        } else {
          viewInst = View;
        }
        viewInst.parent == null && (viewInst.parent = view);
        options.viewList[model.cid] = viewInst;
        options.addHandler.call(view, holder, viewInst);
      }
      function eachRemoveListener(model){
        var subView, ref$, key$, ref1$;
        subView = (ref1$ = (ref$ = options.viewList)[key$ = model.cid], delete ref$[key$], ref1$);
        if (subView.parent === view) {
          delete subView.parent;
        }
        options.delHandler.call(view, holder, subView);
      }
    }
    eachHelper.addHandlers = {
      append: function(ul, view){
        ul.append(view.$el);
      },
      prepend: function(ul, view){
        ul.prepend(view.$el);
      },
      fadeIn: function(ul, view){
        view.$el.hide().appendTo(ul).fadeIn();
      },
      slideIn: function(ul, view){
        view.$el.hide().appendTo(ul).slideIn();
      }
    };
    eachHelper.delHandlers = {
      remove: function(ul, view){
        view.$el.remove();
      },
      fadeOut: function(ul, view){
        view.$el.fadeOut(function(){
          return view.$el.remove();
        });
      },
      slideOut: function(ul, view){
        view.$el.slideOut(function(){
          return view.$el.remove();
        });
      }
    };
    function isClass(func){
      return func.hasOwnProperty('__super__');
    }
    function parentTemplate(view){
      var ref$, ref1$;
      return (ref$ = view.constructor) != null ? (ref1$ = ref$.__super__) != null ? (ref$ = ref1$.constructor) != null ? (ref1$ = ref$.prototype) != null ? ref1$.template : void 8 : void 8 : void 8 : void 8;
    }
    return DOMView;
  });
}).call(this);
