/**
 * 功能说明: 麻醉方法 treemodel
 * @author: jikui
 */
Ext.define('com.dfsoft.icu.nws.specialevent.SpecialEventModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'ID',
            type: 'string',
            mapping:'ID'
        },
        {
            name: 'CODE',
            type: 'string',
            mapping:'CODE'
        },
        {
            name: 'TYPE',
            type: 'string',
            mapping:'TYPE'
        },
        {
            name: 'NAME',
            type: 'string',
            mapping:'NAME'
        },
        {
            name: 'RESULT',
            type: 'string',
            mapping:'RESULT'
        },
        {
            name: 'OCCURRENCE_TIME',
            type: 'string',
            mapping:'OCCURRENCE_TIME'
        },
        {
            name: 'DESCRIPTION',
            type: 'string',
            mapping:'DESCRIPTION'
        },
        {
            name: 'IS_2011',
            type: 'string',
            mapping:'IS_2011'
        },
        {
            name: 'IS_2015',
            type: 'string',
            mapping:'IS_2015'
        }

    ]
});