/**
 * 质量检测指标统计弹出窗口
 * Created by max on 14-8-12.
 */
Ext.define('com.dfsoft.icu.nws.criticalcare.zzszxyy.PrintInfoWindow', {
    extend: 'Ext.window.Window',
    layout: 'fit',
    region: 'center',
    border: true,
    padding: '5 5 5 5',
    autoScroll: true,
    indexType: null,//指标类型
    printInfo: [
        {}
    ],
    initComponent: function (config) {
        Ext.apply(this, config);
        var contentTemplate = new Ext.XTemplate('<div style="text-align:center"><h3>已经超过可打印次数，护士长或管理员不限制打印次数！</h3></div>',

            '<table table  style="border:1px black solid;width:100%;border-collapse:collapse; "cellpadding=0 cellspacing=0 >',
            '<tr><td colspan="3" align="center"><b>打印日志</b></td></tr>',
            '<tr><td style="border:1px black solid;" align="center" width="30%" >护理日期</td>',
            '<td style="border:1px black solid;" align="center" width="30%">打印人员</td>',
            '<td style="border:1px black solid;" align="center" width="40%" >打印时间</td></tr>',
            '<tpl for="data">',
            '<tr>',
            '<td style="border:1px black solid;" align="center" >{CARE_DATE:this.getDateStr}</td>',
            '<td style="border:1px black solid;" align="center" >{NAME}</td>',
            '<td style="border:1px black solid;" align="center"  >{PRINT_TIME}</td>',
            '</tr>',
            '</tpl>',
            '</table>',
            {
                getDateStr: function (datetime) {
                    if (datetime == null) return '';
                    return datetime.substring(0, 10);
                }

            });
        this.html = contentTemplate.apply({data: this.printInfo});
        this.callParent();
    }
});