{
	function stripscript(s) {
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
        var rs = "";
        for (var i = 0; i < s.length; i++) {
            rs = rs + s.substr(i, 1).replace(pattern,"null");
        }
        return rs;
    }
	function rembername(value){
		if(value==0){
			document.getElementById('rembername').innerHTML='<img onclick="rembername(1)" value=1 src=\'/app/sys/desktop/images/login_Choose_1.png\'/>';
		}else{
			document.getElementById('rembername').innerHTML='<img onclick="rembername(0)" value=0 src=\'/app/sys/desktop/images/login_Choose_0.png\'/>';
		}
	}
	function remberrole(value){
		if(value==0){
			document.getElementById('remberrole').innerHTML='<img onclick="remberrole(1)" value=1 src=\'/app/sys/desktop/images/login_Choose_1.png\'/>';
		}else{
			document.getElementById('remberrole').innerHTML='<img onclick="remberrole(0)" value=0 src=\'/app/sys/desktop/images/login_Choose_0.png\'/>';
		}
	}
Ext.define('com.dfsoft.lancet.sys.desktop.LoginForm', {
	extend: 'Ext.form.Panel',
	id: 'login-form',
	initComponent: function() {
		var me = this;
		me.on('afterrender', me.onafterrender);
		me.callParent();
	},
	defaults: {
		allowBlank: false,
		xtype: 'textfield',
		lableWidth:50,
		padding: '0 0 0 4',
		labelAlign:'center',
		msgTarget: 'qtip'
	},
	items: [{
		xtype: 'combo',
		id: 'userName',
		fieldLabel: '',
		name: 'NAME',
		width:302,
		height:37,
		emptyText: '用户名',
		blankText: '请输入用户名',
		value: Ext.util.Cookies.get('icuname'),
		hideTrigger: true,
        grow: true,
		typeAhead: false,
		queryDelay: 1000,
		valueField: 'text',
		displayField: 'text',
		minChars: 0,
		fieldCls:'login-user-cls',
        store: new Ext.data.Store({
		fields: ['text', 'text'],
		proxy: {
			type: 'ajax',
			url: webRoot + '/sys/searchUser/' + 'all/all/all',
			reader: {
				type: 'json',
				root: 'data.data'
			}
		}
	}),
		listeners: {
			blur: function(_this, _the, eOpts) {
				if (mode != 'standard') {
					var user = _this.getValue(),
						role = Ext.getCmp('role');
					if (user != null && user.length>1) {
							user=user.replace("'","");
							user=stripscript(user);
								role.getStore().proxy.url = webRoot + '/sys/roleByUser/' + user;
								role.clearValue();
								role.getStore().load();
					}
				}
			},
			change: function(_this, newValue, oldValue) {
				var name = Ext.util.Cookies.get('icuname');
				if (newValue != name) {
					Ext.util.Cookies.clear('icurole');
				}
				if (mode != 'standard') {
					var user = _this.getValue(),
						role = Ext.getCmp('role');
					if (user != null && user.length>1) {
						user=user.replace("'","");
						user=stripscript(user);
						role.getStore().proxy.url = webRoot + '/sys/roleByUser/' + user;
						role.clearValue();
						role.getStore().load();
						
					}
				}
			}
		}
	},{
		xtype: 'fieldcontainer',
		height:3,
		layout: {
			type: 'hbox',
			align: 'middle'
		},
	},{
		fieldLabel: '',
		name: 'PASSWORD',
		width:302,
		height:37,
		emptyText: '密码',
		inputType: 'password',
		blankText: '请输入密码',
		fieldCls:'login-password-cls',
	},{
		xtype: 'fieldcontainer',
		height:3,
		layout: {
			type: 'hbox',
			align: 'middle'
		},
	},{
		xtype: 'combo',
		id: 'role',
		emptyText: '角色',
		style:'text-align:left;',
		width:302,
		height:37,
		name: 'ROLE',
		fieldCls:'login-role-cls',
		triggerCls:'login-roletrigger-cls',
		emptyText: '请选择角色',
		blankText: '必须选择一个角色',
		editable: false,
		valueField: 'id',
		displayField: 'name',
		value: Ext.util.Cookies.get('icurole'),
		store: new Ext.data.Store({
			fields: ['id', 'name'],
			proxy: {
				type: 'ajax',
				url: '',
				reader: {
					type: 'json',
					root: 'data'
				}
			},
			listeners: {
				load: function(_this, records, successful, eOpts) {
					if (records != null && records.length > 0) {
						var roleValue = Ext.util.Cookies.get('icurole');
						if (roleValue != null) {
							var curr = _this.getById(roleValue);
							if (curr == null) {
								Ext.getCmp('role').select(records[0]);
							} else {
								Ext.getCmp('role').select(curr);
							}
						} else {
							if(userInfo=='undefined'){
								Ext.getCmp('role').select(records[0]);
							}else{
								Ext.getCmp('role').select(userInfo.roleId);
							}
						}
					}
				}
			}
		}),
		listConfig: {
			loadingText: 'Loading...',
			emptyText: '该用户没有角色...'
		},
		listeners: {
			beforerender: function(_this, eOpts) {
				if (mode == 'standard') {
					_this.setValue('标准版');
					_this.setDisabled(true);
				}
			}
		}
	},
	{
		xtype: 'fieldcontainer',
		height:3,
		layout: {
			type: 'hbox',
			align: 'middle'
		},
	},
	{
		xtype: 'fieldcontainer',
		height:38,
		layout: {
			type: 'hbox',
			align: 'left'
		},
		items: [
		{
			xtype: 'label',
			id:'rembername',
			margins: '10 0 0 0',
			width:21,
			height:22,
			html:'<img onclick="rembername(1)" value=1 src=\'/app/sys/desktop/images/login_Choose_1.png\'/>'
		},    
		{
			xtype: 'label',
			margins: '15 0 0 5',
			name: 'REMEMBER_NAME',
			text: '记住用户名',
			labelWidth: 70
		},{
			xtype: 'label',
			id:'remberrole',
			margins: '10 0 0 20',
			width:21,
			height:22,
			html:'<img onclick="remberrole(1)" value=1 src=\'/app/sys/desktop/images/login_Choose_1.png\'/>'
		},{
			xtype: 'label',
			margins: '15 0 0 5',
			name: 'REMEMBER_ROLE',
			text: '记住角色',
			labelWidth: 58
		},
//		{
//			xtype: 'checkbox',
//			name: 'REMEMBER_NAME',
//			margins: '10 0 0 0',
//			fieldLabel: '记住用户名',
//			labelWidth: 70,
//			checked: true
//		}, {
//			xtype: 'checkbox',
//			name: 'REMEMBER_ROLE',
//			margins: '10 0 0 0',
//			fieldLabel: '记住角色',
//			checked: true,
//			labelWidth: 58
//		},
		{
			xtype: 'label',
			html:'<span style="cursor: pointer;"><img src=\'/app/sys/desktop/images/login_Push button.png\'/></span>',
			width:92,
			margins: '3 0 0 23',
		    height:35,
		    listeners : {
		         render : function() {//渲染后添加click事件
		          Ext.fly(this.el).on('click',
		            function(e, t) {
		      	  var form = Ext.getCmp('login-form').getForm();
		      		var name = form.findField('NAME').getValue();
		      		var remember_name;
		      		var remember_role;
		      		if(document.getElementById('rembername').innerHTML.indexOf(1)>0){
		      			remember_name=1
		      		}else{
		      			remember_name=0;
		      		}
		      		if(document.getElementById('remberrole').innerHTML.indexOf(1)>0){
		      			remember_role=1
		      		}else{
		      			remember_role=0;
		      		}
		      		//var remember_name = form.findField('REMEMBER_NAME').checked;
		      		//var remember_role = form.findField('REMEMBER_ROLE').checked;
		      		
		      		var role = form.findField('ROLE').getValue();
		      		if (role.length != 32) {
		      			role = '10ca83a1089d11e396021b9f5cdf5948';
		      		}
		      		if (remember_name) {
		      			//设置cookie 过期时间
		      			var expiry = new Date(new Date().getTime() + (1000 * 60 * 7 * 24 * 60)); //一周
		      			Ext.util.Cookies.set("icuname", name, expiry);
		      		} else {
		      			Ext.util.Cookies.clear("icuname");
		      		}
		      		if (remember_role) {
		      			var expiry = new Date(new Date().getTime() + (1000 * 60 * 7 * 24 * 60)); //一周
		      			Ext.util.Cookies.set("icurole", role, expiry);
		      		} else {
		      			Ext.util.Cookies.clear("icurole");
		      		}
		      		if (form.isValid()) {
		      			//Ext.getCmp('login-button').setDisabled(true);
		      			var params;
		      			if (mode == 'standard') {
		      				params = {
		      					role_name: form.findField('ROLE').getRawValue(),
		      					ROLE: role
		      				}
		      			} else {
		      				params = {
		      					role_name: form.findField('ROLE').getRawValue()
		      				}
		      			}
		      			form.submit({
		      				url: webRoot + '/sys/login/',
		      				method: 'POST',
		      				params: params,
		      				success: function(form, action) {
		      					if (action.result.data.flag == true) {
		      						userInfo = action.result.data;
		      						if (myDesktopApp === undefined) {
		      							myDesktopApp = new MyDesktop.App();
		      						}
		      						Ext.getCmp('loginWindow').close();
									//var logo01div=document.getElementById('login_logo01');
									//if(logodiv!=null){
									//	logodiv.parentNode.removeChild(logodiv);
									//}
		      						//var logodiv=document.getElementById('login_logo');
		      						//if(logodiv!=null){
		      						//	logodiv.parentNode.removeChild(logodiv);
		      						//}
		      						//var copyrightdiv=document.getElementById('login_copyright');
		      						//if(copyrightdiv!=null){
		      						//	copyrightdiv.parentNode.removeChild(copyrightdiv);
		      						//}
									document.getElementById("login_logo01").style.display="none";
									document.getElementById("login_logo").style.display="none";
									document.getElementById("login_copyright").style.display="none";

		      					} else {
		      						form.findField('ERRORMSG').setValue(action.result.data.msg);
		      						//Ext.getCmp('login-button').setDisabled(false);
		      					}
		      				},
		      				failure: function(form, action) {
		      					form.findField('ERRORMSG').setValue('请求超时或网络故障!');
		      					Ext.getCmp('login-button').setDisabled(false);
		      				}
		      			});
		      		}
		            });
		         },
			}
//			handler:function (){
//      	  var form = Ext.getCmp('login-form').getForm();
//    		var name = form.findField('NAME').getValue();
//    		var remember_name = form.findField('REMEMBER_NAME').checked;
//    		var remember_role = form.findField('REMEMBER_ROLE').checked;
//    		var role = form.findField('ROLE').getValue();
//    		if (role.length != 32) {
//    			role = '10ca83a1089d11e396021b9f5cdf5948';
//    		}
//    		if (remember_name) {
//    			//设置cookie 过期时间
//    			var expiry = new Date(new Date().getTime() + (1000 * 60 * 7 * 24 * 60)); //一周
//    			Ext.util.Cookies.set("icuname", name, expiry);
//    		} else {
//    			Ext.util.Cookies.clear("icuname");
//    		}
//    		if (remember_role) {
//    			var expiry = new Date(new Date().getTime() + (1000 * 60 * 7 * 24 * 60)); //一周
//    			Ext.util.Cookies.set("icurole", role, expiry);
//    		} else {
//    			Ext.util.Cookies.clear("icurole");
//    		}
//    		if (form.isValid()) {
//    			//Ext.getCmp('login-button').setDisabled(true);
//    			var params;
//    			if (mode == 'standard') {
//    				params = {
//    					role_name: form.findField('ROLE').getRawValue(),
//    					ROLE: role
//    				}
//    			} else {
//    				params = {
//    					role_name: form.findField('ROLE').getRawValue()
//    				}
//    			}
//    			form.submit({
//    				url: webRoot + '/sys/login/',
//    				method: 'POST',
//    				params: params,
//    				success: function(form, action) {
//    					if (action.result.data.flag == true) {
//    						userInfo = action.result.data;
//    						if (myDesktopApp === undefined) {
//    							myDesktopApp = new MyDesktop.App();
//    						}
//    						Ext.getCmp('loginWindow').close();
//    						var logodiv=document.getElementById('login_logo');
//    						if(logodiv!=null){
//    							logodiv.parentNode.removeChild(logodiv);
//    						}
//    						var copyrightdiv=document.getElementById('login_copyright');
//    						if(copyrightdiv!=null){
//    							copyrightdiv.parentNode.removeChild(copyrightdiv);
//    						}
//    						
//    					} else {
//    						form.findField('ERRORMSG').setValue(action.result.data.msg);
//    						//Ext.getCmp('login-button').setDisabled(false);
//    					}
//    				},
//    				failure: function(form, action) {
//    					form.findField('ERRORMSG').setValue('请求超时或网络故障!');
//    					Ext.getCmp('login-button').setDisabled(false);
//    				}
//    			});
//    		}
//      	  
//        }
		}]
	}],
	onafterrender: function(_this, eOpts) {
		if (mode != 'standard') {
			var user = Ext.util.Cookies.get('icuname'),
				roleValue = Ext.util.Cookies.get('icurole'),
				role = Ext.getCmp('role');
			if (user != null && user.length > 0) {
					role.getStore().proxy.url = webRoot + '/sys/roleByUser/' + user;
					role.getStore().load();
			}
			if(user==null){
				document.getElementById('rembername').innerHTML='<img onclick="rembername(0)" value=0 src=\'/app/sys/desktop/images/login_Choose_0.png\'/>';
			}
			if(roleValue==null){
				document.getElementById('remberrole').innerHTML='<img onclick="remberrole(0)" value=0 src=\'/app/sys/desktop/images/login_Choose_0.png\'/>';
			}
		}
		window.setTimeout(focusPassword, 500);

		function focusPassword() {
			var form = _this.getForm();
			var nameInput = form.findField('NAME'),
				passInput = form.findField('PASSWORD');
			if (nameInput.getValue() == null || nameInput.getValue().length == 0) {
				nameInput.focus();
			} else passInput.focus();
		}
	}
});
}