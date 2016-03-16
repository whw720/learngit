/**
 * 功能说明: 待入科患者 store
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.patientdetails.surgeryStore', {
	extend		: 'Ext.data.Store',
    requires	: ['com.dfsoft.icu.nws.patientdetails.surgeryModel'],
    model		: 'com.dfsoft.icu.nws.patientdetails.surgeryModel',
    autoLoad	:  false,
    proxy	: {
        type: 'ajax',
        url: webRoot + '/nws/icu_patient/getsurgery_record',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});