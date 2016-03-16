Ext.define('com.dfsoft.lancet.sys.desktop.StartMenu', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.menu.Menu',
        'Ext.toolbar.Toolbar'
    ],

    ariaRole: 'menu',

    cls: 'x-menu ux-start-menu',

    defaultAlign: 'bl-tl',
    iconCls: 'user',

    floating: true,

    shadow: false,
    bodyCls:'start-panel-body-out-style',
    width: 280,
    border: false,
    initComponent: function() {
        var me = this, menu = me.menu;
        me.menu = new Ext.menu.Menu({
            cls: 'ux-start-menu-body',
            bodyCls:'start-panel-body-style',
            componentCls:'panel-menu-item-style',
            border: false,
            floating: false,
            items: menu
        });
        me.menu.layout.align = 'stretch';

        me.items = [me.menu];
        me.layout = 'fit';

        Ext.menu.Manager.register(me);
        me.callParent();
        // TODO - relay menu events

        me.toolbar = new Ext.toolbar.Toolbar(Ext.apply({
            dock: 'bottom',
            cls: 'ux-start-menu-toolbar',
            //vertical: true,
            height: 30,
            listeners: {
                add: function(tb, c) {
                    c.on({
                        click: function() {
                            me.hide();
                        }
                    });
                }
            }
        }, me.toolConfig));

        me.toolbar.layout.align = 'stretch';
        me.addDocked(me.toolbar);
        me.on('afterrender',function(){

            /* the header is the first div element in a panel.
             * so we have to find it first
             */
            var header = Ext.get(me.getEl().dom.children[0].id);

            /* then we change the styles the element found above */
            header.applyStyles("background-color:transparent;padding-left:15px;padding-top:13px;");
            /*var body = Ext.get(me.getEl().dom.children[1].id);

            body.applyStyles("padding-top:43px;");*/

            var headerTitle = Ext.get(me.getEl().dom.children[0].children[0].children[0].firstChild.lastChild.firstChild.id);
            headerTitle.applyStyles("color:#289f99;font-size:14px;font-family:Microsoft YaHei");
        });
        delete me.toolItems;
    },

    addMenuItem: function() {
        var cmp = this.menu;
        cmp.add.apply(cmp, arguments);
    },

    addToolItem: function() {
        var cmp = this.toolbar;
        cmp.add.apply(cmp, arguments);
    }
});
