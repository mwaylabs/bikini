(function( scope ) {

    /**
     *
     * M.View inherits from Backbone.View
     *
     * @type {*}
     */
    M.View = Backbone.View.extend({
        constructor: function( options ) {
            this.cid = _.uniqueId('view');
            options || (options = {});
            var viewOptions = ['scope', 'model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events', 'scopeKey', 'computedValue', 'formatter', 'parse'];
            _.extend(this, _.pick(options, viewOptions));
            this._ensureElement();
            this.initialize.apply(this, arguments);
            this.delegateEvents();
        }
    });

    M.View.create = M.create;
    M.View.design = M.design;

    _.extend(M.View.prototype, M.Object, {

        /**
         * The View type
         */
        _type: 'M.View',

        /*
         * define a user template
         */
        template: null,

        /*
         * define a template based on the tmpl template engine
         */
        _template: _.tmpl(M.TemplateManager.get('M.View')),

        /**
         * use this property to define which data are given to the template
         */
        _templateValues: null,

        /**
         * extend the default template with this one. It gets injected into the <%= _value_ %> placeholder
         */
        templateExtend: null,


        _firstRender: YES,

        useElement: NO,

        _hasI18NListener: NO,

        formater: function( value ) {
            return value;
        },


        /**
         * external events for the users
         */
        events: null,


        /**
         * internal framework events
         */
        _events: null,

        /**
         * The Value of the view
         */
        _value_: null,

        _setModel: function( value ) {
            this.model = value;
            return this;
        },

        _getModel: function() {
            return this.model;
        },

        getValue: function() {
            if( this.model ) {
                if( this._value_.hasOwnProperty('attribute') && this._value_.hasOwnProperty('model') ) {
                    return this._value_.model.get(this._value_.attribute);
                }
                return this._getModel().attributes;
            } else {
                return this._value_;
            }
        },

        _getValue: function() {
            return this._value_;
        },

        _setValue: function( value ) {

            this._value_ = value;
        },

        getPropertyValue: function( propertyString, data ) {
            var o = data;
            _.each(propertyString.split('.'), function( key ) {
                if( o[key] ) {
                    o = o[key];
                } else if( M.isModel(o) || M.isCollection(o) ) {
                    //o = o.get(key);
                    o = {
                        model: o,
                        attribute: key
                    }
                } else {
                    o = null;
                }
            });
            return o;
        },

        /**
         * Constructor
         * @returns {*}
         */

        initialize: function( options ) {

            this._assignValue(options);
            this._assignTemplateValues();
            this._runFormatter();
            this._mapEventsToScope(this.scope);
            this._addCustomEvents(this.scope);
            if( !this.useElement ) {
                this._registerEvents();
            }
            this._assignContentBinding();
            //            this._assignComplexView();
            //            this.init();
            return this;
        },

        _assignValue: function( options ) {
            //don't write _value_ in the view definition - write value and here it gets assigned

            if( this.value ) {
                this._setValue(this.value);
            } else if( this.scopeKey ) {
                this._setValue(this.getPropertyValue(this.scopeKey, this.scope));
            } else if( options && options.value ) {
                this._setValue(options.value);
            }

            var _value_ = this._getValue();

            if(_value_) {
                if( M.isModel(_value_.model) ) {
                    this._setModel(_value_.model);
                } else if( M.isModel(_value_) ) {
                    this._setModel(_value_);
                } else if( M.isCollection(_value_) ) {
                    this.collection = _value_;
                }
            }

            if ( this._reactOnLocaleChanged()) {
                M.I18N.on(M.CONST.I18N.LOCALE_CHANGED, function () {
                    this.render();
                }, this);
                this._hasI18NListener = YES;
            }

            return this;
        },

        _reactOnLocaleChanged: function() {
            return (this.value || this.label);
        },

        _runFormatter: function() {
            if(this.formatter) {
                this._templateValues = this.formatter(this._templateValues);
            }
        },

        _assignContentBinding: function() {
            var that = this;
            var _value_ = this._getValue();
            if( this.scopeKey && M.isModel(_value_) ) {
                this.listenTo(this.scope, this.scopeKey, function( model ) {
                    that._setModel(model);
                    that.render();
                });
            } else if( this.scopeKey && _value_ && M.isModel(_value_.model) && _value_.attribute ) {

                this.listenTo(this.scope, this.scopeKey.split('.')[0], function( model ) {
                    //                    that._value_.model.set(that._value_.attribute, model.get(that._value_.attribute));
                });
            }
            return this;
        },

        _mapEventsToScope: function( scope ) {
            if( this.events ) {
                var events = {};
                _.each(this.events, function( value, key ) {
                    if( typeof value === 'string' ) {
                        if( scope && typeof scope[value] === 'function' ) {
                            events[key] = scope[value];
                        }
                    } else {
                        events[key] = value;
                    }
                }, this);

                this._events = events;
                this.originalEvents = this.events;
                //backbone should not bind events so set it to null
                this.events = null;
            }
        },

        _addCustomEvents: function() {
            if( !this._events ) {
                return;
            }
            var that = this;
            var customEvents = {
                enter: {
                    'origin': 'keyup',
                    'callback': function( event ) {
                        if( event.keyCode === 13 ) {
                            that._events['enter'].apply(that.scope, arguments);
                        }

                    }
                }
            };
            for( var event in this._events ) {
                if( customEvents.hasOwnProperty(event) ) {
                    this._events[customEvents[event].origin] = customEvents[event].callback
                }
            }

        },

        _getEventOptions: function() {
            return {
                prevent_default: false, // To prevent the ghost click
                no_mouseevents: true,
                stop_browser_behavior: false
            };
        },

        _registerEvents: function() {
            if( this._events ) {
                var that = this;
                Object.keys(this._events).forEach(function( eventName ) {
                    //                    if( typeof this._events[eventName] === 'function' ) {
                    //                        console.log(that.el);
                    //                    }
                    this.hammertime = Hammer(that.el, that._getEventOptions()).on(eventName, function() {
                        var args = Array.prototype.slice.call(arguments);
                        args.push(that);
                        that._events[eventName].apply(that.scope, args);
                    });

                }, this);


            }
        },

        /**
         * implement render function
         * @returns {this}
         */
        render: function() {
            //this._assignValue();
            this._preRender();
            this._render();
            this._renderChildViews();
            this._postRender();
            return this;
        },

        _preRender: function() {
            this._assignTemplate();
            this._assignTemplateValues();
            this._runFormatter();
            this._extendTemplate();
            this.preRender();
            return this;
        },

        _assignTemplate: function( template ) {
            var template = template || this.template;
            if( template ) {
                if( typeof template === 'function' ) {
                    this._template = template;
                } else if( _.isString(template) ) {
                    this._template = _.tmpl(template);
                } else if( _.isObject(template) ) {
                    this._template = _.tmpl(M.TemplateManager.get.apply(this, ['template']))
                }
            } else if( this._template ) {
                this.template = this._template;
            }
            return this;
        },

        _assignTemplateValues: function() {
            this._templateValues = {};
            var _value_ = this._getValue();

            if( this.model ) {
                if( M.isModel(_value_) ) {
                    this._templateValues = this.formater(this.model.attributes);
                } else {
                    this._templateValues['_value_'] = this.formater(this.model.get(_value_.attribute));
                }
            } else if( M.isI18NItem(_value_) ) {
                this._templateValues['_value_'] = this.formater(M.I18N.l(_value_.key, _value_.placeholder));
            } else if( typeof _value_ === 'string' ) {
                this._templateValues['_value_'] = this.formater(_value_);
            } else if( _value_ !== null && typeof _value_ === 'object' && this._hasI18NListener === NO ) {
                this._templateValues = _value_;
            } else if( this._hasI18NListener && _.isObject(_value_) ) {
                _.each(_value_, function( value, key ) {
                    this._templateValues[key] = M.I18N.l(value.key, value.placeholder);
                }, this);
            }
        },

        _extendTemplate: function() {
            if( this.extendTemplate ) {
                this._template = _.tmpl(this.template({_value_: this.extendTemplate}));
            }
        },

        preRender: function() {

        },

        _render: function() {
            var dom = this._template(this._templateValues);
            if( this.useElement ) {
                this.setElement(dom);
            } else {
                this.$el.html(dom);
            }
            return this;
        },

        _renderChildViews: function() {

            if( !this.childViews ) {
                return;
                //this.childViews = this._getChildViews();
            }
            _.each(this.childViews, function( child, name ) {
                var dom = this.$el;
                //                if( this.$el.find('[data-childviews="' + this.cid + '_' + name + '"]').addBack().length ) {
                //                    dom = this.$el.find('[data-childviews="' + this.cid + '_' + name + '"]').addBack();
                //                }
                if( this.$el.find('[data-childviews="' + name + '"]').length ) {
                    dom = this.$el.find('[data-childviews="' + name + '"]');
                    dom.addClass(name);
                }

                if( typeof child['render'] === 'function' ) {
                    dom.append(child.render().$el);
                    child.delegateEvents();
                } else if( _.isArray(child) ) {
                    _.each(child, function( c ) {
                        dom.append(c.render().$el);
                        c.delegateEvents();
                    })
                }

            }, this);

            return this;
        },

        _postRender: function() {
            //use element can be given from the parent element
            if( this.useElement ) {
                this._registerEvents();
            }
            this._addClassNames();
            if( this.model ) {
                this._assignBinding();
                this.stickit();
            }
            if( this.model && this.useElement ) {
                //console.warn('be aware that stickit only works if you define useElement with NO');
            }
            this.postRender();
            this._firstRender = NO;
            return this;
        },

        _addClassNames: function() {

            this.$el.addClass(this._type.split('.')[1].toLowerCase());
            if( this.cssClass ) {
                this.$el.addClass(this.cssClass);
            }
        },

        _assignBinding: function() {
            var bindings = {};
            var data = this._templateValues;

            var _value_ = this._getValue();

            if( this.model && !M.isModel(_value_) ) {
                var selector = '[data-binding="_value_"]';
                bindings[selector] = {observe: '' + _value_.attribute};
            } else if( this.collection ) {
                var selector = '[data-binding="_value_"]';
                bindings[selector] = {observe: "_value_"};
            } else if( this.model && M.isModel(_value_) ) {
                _.each(this.model.attributes, function( value, key ) {
                    var selector = '[data-binding="' + key + '"]';
                    bindings[selector] = {observe: '' + key};
                }, this);
            } else if( this.templateExtend === null && this.scopeKey ) {
                var selector = '[data-binding="_value_"]';
                bindings[selector] = {observe: '' + this.scopeKey};
            } else {
                _.each(this._templateValues, function( value, key ) {
                    var selector = '[data-binding="' + key + '"]';
                    bindings[selector] = {observe: '' + key};
                }, this);
            }

            this.bindings = bindings;

            return this;
        },

        postRender: function() {

        },

        updateTemplate: function() {
            var template = this.template || M.TemplateManager.get(this._type);
            this._assignTemplate(template);
            this._updateChildViewsTemplate();
            return this;
        },

        _updateChildViewsTemplate: function() {

            if( !this.childViews ) {
                return;
            }
            _.each(this.childViews, function( child, name ) {
                if( typeof child['updateTemplate'] === 'function' ) {
                    child.updateTemplate();
                } else if( _.isArray(child) ) {
                    _.each(child, function( c ) {
                        c.updateTemplate();
                    });
                }

            }, this);
            return this;
        },

        addChildView: function( selector, view ) {
            this.childViews[selector] = view;
        }

    });

    /**
     * extend the Backbone.View extend function with a childViews parameter
     * @param options
     * @param childViews
     * @returns {*}
     */
    M.View.extend = function( options, childViews ) {
        options = options || {};
        if( childViews ) {
            options._childViews = childViews;
        }
        return Backbone.View.extend.apply(this, [options]);
    };

    /**
     *
     * @param scope
     * @returns {this}
     */
    M.View.create = function( scope, childViews, isScope ) {

        var _scope = isScope ? {scope: scope} : scope;
        var f = new this(_scope);
        if( f._childViews ) {
            f.childViews = {};
            _.each(f._childViews, function( childView, name ) {
                var _scope = scope;
                if( f.useAsScope === YES ) {
                    _scope = f;

                }
                f.childViews[name] = childView.create(_scope || f, null, true);
            });
        }
        if( childViews ) {
            f.childViews = f.childViews || {};
            _.each(childViews, function( childView, name ) {
                f.childViews[name] = childView;
            });
        }
        return f;
    };

    M.View.design = M.View.prototype.design = function() {
        return this.extend().create();
    };

})(this);
