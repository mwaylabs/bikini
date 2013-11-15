M.TabLayout = M.Layout.extend({

    _tabMenu: null,

    _type: 'M.TabLayout',

    scrolling: NO,

    smoothScrollAnimation: YES,

    template: '<div id="m-main" class="m-perspective"><div data-childviews="tab-menu"></div><div data-childviews="tab-content"></div></div>',

    initialize: function() {
        this._tabMenu = M.ButtonGroupView.extend({}, {}).create(this, null, YES);
    },

    _render: function() {
        M.Layout.prototype._render.apply(this, arguments);
    },

    _postRender: function() {
        M.Layout.prototype._postRender.apply(this, arguments);
        this.$el.addClass(this.scrolling ? 'scrolling' : '');
        this.$scrollContainer = this.$el.find('[data-childviews=tab-menu]');
        if(this.scrolling){
            var width = M.SassVars['tablayout-menu-scroll-button-width'] * Object.keys(this._tabMenu.childViews).length;
            this.$scrollContainer.children('.buttongroupview').css('width', width + 'px');
        }

    },

    switchToTab: function( index ) {
        if( index < 0 || index >= Object.keys(this._tabMenu.childViews).length ) {
            return;
        }
        this._scrollToTab(index);
        this._tabMenu.setActive(index);
        this.$el.find('.m-tab.m-page-current').removeClass('m-page-current');
        this.childViews['tab-content'][index].$el.addClass('m-page-current');
    },

    _scrollToTab: function( index ) {
        if(!this.$scrollContainer){
            return;
        }
        var buttonWidth = M.SassVars['tablayout-menu-scroll-button-width'];
        var toPos = index * buttonWidth - 50;
        if( this.smoothScrollAnimation ) {

            this.$scrollContainer.animate({
                scrollLeft: toPos
            }, 200);

        } else {
            this.$scrollContainer.scrollLeft(toPos);
        }

    },


    applyViews: function( tabs ) {

        var that = this;

        var contents = [];
        var grid = 'col-xs-' + Math.floor(12 / tabs.length);
        if( this.scrolling ) {
            grid = '';
        }
        for( var t = 0; t < tabs.length; t++ ) {
            var button = this._createButton({
                index: t,
                grid: grid,
                headline: tabs[t].headline,
                icon: tabs[t].icon
            });
            this._tabMenu.addChildView('button' + t, button);
            contents.push(this._extendContent({
                index: t,
                content: tabs[t].content
            }));
        }

        this.addChildView('tab-menu', this._tabMenu);
        this.addChildView('tab-content', contents);
    },

    _createButton: function( options ) {
        var that = this;
        return M.ButtonView.extend({
            value: options.headline,
            index: options.index,
            grid: options.grid,
            icon: options.icon,
            events: {
                tap: function( event, element ) {
                    that.switchToTab(element.index);
                }
            }
        }).create();
    },

    _extendContent: function( options ) {
        var that = this;
        return options.content.extend({
            events: {
                dragleft: function( event, element ) {
                    that.switchToTab(options.index + 1);
                },
                dragright: function( event, element ) {
                    that.switchToTab(options.index - 1);
                }
            }
        }).create();
    }

});