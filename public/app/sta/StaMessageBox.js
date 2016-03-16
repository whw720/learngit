/**
 * 弹出框
 * Created by max on 14-8-12.
 */
Ext.define('com.dfsoft.icu.sta.StaMessageBox', {
    extend: 'Ext.window.MessageBox',
    initComponent: function(config){
        Ext.apply(this,config);
        var me=this;
        var msg=me.msg+'';
        this.callParent();
        me.buttonText={no:"否",yes: "是"};
            me.confirm('提示信息', msg, function(btn) {
                if (btn === 'yes') {
                    Ext.Ajax.request({
                        url: me.url.split('?')[0],
                        method: 'post',
                        params : {
                            REGISTER_ID:me.params.register_id,
                            STATUS_CODE:'a34df80078fd11e39fd9cb7044fca372'
                        },
                        scope: this,
                        success: function(response) {
                            me.remoteObj.reloadData();
                        },
                        failure: function(response, options) {
                            Ext.MessageBox.alert('提示', '删除失败,请求超时或网络故障!');
                        }
                    });
                }
            });
    }
});