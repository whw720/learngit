/**
 * 回收站window
 * @author:whw
 * @date:2014-3-5.
 */
Ext.define('com.dfsoft.icu.nws.doctorordermanagement.DoctorRecycleWindow', {
    extend: 'Ext.window.Window',
    layout: 'fit',
    title:'回收站',
    iconCls:'recycle',
    width: 620,
    height: 418,

    border: false,
    initComponent: function() {
        var me = this;
        me.recycleGrid=me.createRequestForm();
        Ext.apply(me,{
            dockedItems:[{
                xtype: 'toolbar',
                dock: 'top',
                style:{
                    'padding-bottom':'0px'
                },
                items:[ '->',{
                    action : 'back_button',
                    iconCls : 'order-back',
                    labelAlign:'right',
                    tooltip:'还原',
                    handler:function(btn){
                        me.recycleHandler();
                    }
                }
                ]
            }],
            items : [me.recycleGrid]
        });
        me.callParent();
    },
    createRequestForm:function(){
        var form = Ext.create('com.dfsoft.icu.nws.doctorordermanagement.DoctorRecyclePanel', {
            parent: this
        });
        return form;
    },
    recycleHandler:function(){
        var me=this;
        var treePanel=me.recycleGrid;
        var node=treePanel.getRootNode();
        var childnodes = node.childNodes;
        var str='';
        for(var i=0;i<childnodes.length;i++){  //从节点中取出子节点依次遍历
            var nd = childnodes[i];
            if(nd.get('IS_SELECTED')){
                str+='"'+nd.get('ID')+'",';
            }
        }
        if(str.length>1){
            str=str.substr(0,str.length-1);
            Ext.Ajax.request({
                url : webRoot + '/nws/doctorordermanagement/delete_orders',
                method: 'POST',
                params:{
                    ids:str,
                    flag:1
                },
                success : function(response){
                    me.close();
                    me.parent.queryOrder();
                }
            });
        }else{
            Ext.MessageBox.show({
                title:'提示',
                msg:'请选择要还原的医嘱!',
                width:200,
                modal:true,
                buttons:Ext.MessageBox.OK,
                icon:Ext.MessageBox.WARNING
            });
        }

    }
})