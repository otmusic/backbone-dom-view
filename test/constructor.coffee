define ['chai', 'backbone', 'backbone-dom-view'], ({expect}, Backbone, DomView) ->

    model = null

    beforeEach ->
        model = new Backbone.Model()

    describe 'constructor', ->
        it 'should extend parent template:', ->
            View = DomView.extend
                template: '':
                    html: '@name'

            XView = View.extend
                template: '':
                    prop: "test": '@name'

            YView = XView.extend
                template: '':
                    attr: "test": '@name'

            view = new View model: model
            el1 = view.$el
            xView = new XView model: model
            el2 = xView.$el
            yView = new YView model: model
            el3 = yView.$el

            model.set('name', 'Jack')

            expect(el1).to.have.text 'Jack'
            expect(el2).to.have.text 'Jack'
            expect(el3).to.have.text 'Jack'
            expect(el1).not.to.have.prop 'test'
            expect(el2).to.have.prop 'test', 'Jack'
            expect(el3).to.have.prop 'test', 'Jack'
            expect(el1).not.to.have.attr 'test'
            expect(el2).not.to.have.attr 'test'
            expect(el3).to.have.attr 'test', 'Jack'

            ZView = YView.extend
                template: '':
                    attr: "test": '@age'

            zView = new ZView model: model

            model.set('age', 20)

            expect(zView.$el).to.have.attr 'test', '20'

        it 'should extend parent ui:', ->
            View = DomView.extend
                el: '<li><span></span><a href="#"><i></i></a></li>'
                ui:
                    root: ''
                template:
                    root: prop: 'test': '@name'

            XView = View.extend
                ui: ->
                    expect(this).instanceOf XView
                    return {deleteButton: 'a'}

                template:
                    deleteButton: html: '@name'

            YView = XView.extend
                ui:
                    name: 'span'
                template:
                    name: html: '@name'

            view = new View model: model
            el1 = view.$el
            xView = new XView model: model
            el2 = xView.$el
            yView = new YView model: model
            el3 = yView.$el

            model.set('name', 'Jack')

            expect(el1).to.have.prop 'test', 'Jack'
            expect(view.ui.root).to.have.prop 'test', 'Jack'
            expect(el2).to.have.prop 'test', 'Jack'
            expect(xView.ui.root).to.have.prop 'test', 'Jack'
            expect(el3).to.have.prop 'test', 'Jack'
            expect(yView.ui.root).to.have.prop 'test', 'Jack'

            expect(el1.find('a')).not.to.have.text 'Jack'
            expect(view.ui.deleteButton).to.be.undefined
            expect(el2.find('a')).to.have.text 'Jack'
            expect(xView.ui.deleteButton).to.have.text 'Jack'
            expect(el3.find('a')).to.have.text 'Jack'
            expect(yView.ui.deleteButton).to.have.text 'Jack'

            expect(el1.find('span')).not.to.have.text 'Jack'
            expect(view.ui.name).to.be.undefined
            expect(el2.find('span')).not.to.have.text 'Jack'
            expect(xView.ui.name).to.be.undefined
            expect(el3.find('span')).to.have.text 'Jack'
            expect(yView.ui.name).to.have.text 'Jack'

        it 'should trigger elementEvent on setElement', ->
            x = 0
            View = DomView.extend
                tagName: 'li'
                constructor: ->
                    this.on DomView.elementEvent, ->
                        x = 1
                        expect(this.$el).instanceOf jQuery
                        expect(this.$el).to.match 'li'

                    DomView.apply(this, arguments)

            view = new View

            expect(x).to.equal 1

    describe 'find()', ->

        it 'should return root node', ->
            View = DomView.extend
                tagName: 'li'

            view = new View

            expect(view.find()).to.equal view.$el

        it 'should return ui element', ->
            View = DomView.extend
                el: '<li><span></span></li>'
                ui:
                    test: 'span'

            view = new View

            expect(view.find('test')).to.match 'span'

        it 'should replace "{name}" on ui element selector', ->
            node = $('<div><li><span></span> <i></i></li></div>')

            View = DomView.extend
                el: node.find('li')
                ui:
                    test: 'span'
                    comb: '{test} + i'

            view = new View

            expect(view.find('{test} ~ i')).to.match 'i'
            expect(view.find('{comb}')).to.match 'i'
            expect(view.find('comb')).to.match 'i'
