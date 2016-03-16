/**
 * 评分通用窗口设置
 * @author:whw
 * @date:2014-3-5.
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.commonset.AutoSetWindow', {
    extend: 'Ext.window.Window',
    layout: 'fit',
    title:'化验日期',
    iconCls:'recycle',
    width: 610,
    height: 418,

    border: false,
    initComponent: function() {
        var me = this;
        me.recycleGrid=me.createRequestForm();
        me.buttons = [{
            text: '确定',
            iconCls: 'save',
            handler: me.onOK,
            scope: me
        }, {
            text: '取消',
            iconCls: 'cancel',
            handler: me.close,
            scope: me
        }];
        Ext.apply(me,{
            items : [me.recycleGrid]
        });
        me.callParent();
    },
    createRequestForm:function(){
        var form = Ext.create('com.dfsoft.icu.nws.nursingscores.commonset.AutoSetPanel', {
            parent: this
        });
        return form;
    },
    onOK:function(){
        var me=this;
        var panel=me.recycleGrid;
        var store=panel.getStore();
        var len=store.getCount(),apsData={};
        for(var i=0;i<len;i++){
            var st=store.getAt(i);
            var itemArr=st.get('ITEM_NAME').split(',');
            if(itemArr.length>1){
                var valueArr=[];
                if((st.get('USE_VALUE')+'').indexOf(',')>0){
                    valueArr=st.get('USE_VALUE').split(',');
                }else{
                    valueArr[0]=st.get('USE_VALUE');
                }

                for(var j=0;j<itemArr.length;j++){
                    apsData[itemArr[j]]=valueArr[j]?valueArr[j]:'';
                }
            }else{
                apsData[st.get('ITEM_NAME')]=st.get('USE_VALUE');
            }
        }
        me.parent.ppubfun.setApsValue(me.toppanel,apsData);

        var ageStr=me.parent.patientInfo.AGE;
        me.parent.ppubfun.setNameValue(me.toppanel,ageStr);

        var ende=me.parent.patientInfo.GENDER;
        if(ende&&ende!=""){
            if(me.toppanel.getForm().findField('sex')){
                me.toppanel.getForm().findField('sex').setValue(ende);
            }
        }
        me.parent.ppubfun.setGcsValue(me.toppanel,me.registerId,me.startTime,me.endTime);

        me.close();
    }
})