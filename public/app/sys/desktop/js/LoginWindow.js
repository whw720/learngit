Ext.define('com.dfsoft.lancet.sys.desktop.LoginWindow', {
	extend: 'Ext.window.Window',
	requires: [
		'Ext.layout.container.VBox'
	],
	uses: [
		'com.dfsoft.lancet.sys.desktop.LoginForm'
	],
	id: 'loginWindow',
	//title: '用户登录',
	//modal: true,
	width: 341,
	height: 308,
	border: false,
	closable: false,

	bodyStyle:"background-image:url('/app/sys/desktop/images/login_Login_Background.png');padding:85px 15px 0",
	layout:'form',
	lableWidth:50,
	frame:true,
	draggable : false,
	baseCls: '',          //  这个很关键 背景透明
    shadow: false,
    frame: false,
    hideMode: 'offsets',
    constrain: false,
	//html:'<div style="background-image:url(\'/app/sys/desktop/images/login_Login_Background.png\');position:absolute; left:0px; top:0px; width:100%; height:100%"><table align="center"><tr><td colspan=2><img src="/app/sys/desktop/images/login_Logo.png" width="440" height="42" /></td></tr><tr height=80></tr><tr align="center"><td></td><td><input type="text" placeholder="用户名:" name="NAME" class="textbg" style="border:0px;"></td></tr><tr align="center"><td></td><td><input type="text" placeholder="密码:" name="PASSWORD" class="textbg" style="border:0px;"></td></tr><tr align="center"><td></td><td><input type="text" placeholder="角色:" name="ROLE" class="textbg" style="border:0px;"></td></tr><tr height=10></tr><tr><td colspan=2><label style="width:150px;margin-right:5px;"></label>记住用户名:<input type="checkbox" checked=true/>记住角色:<input type="checkbox" checked=true/></td></tr><tr></tr><tr><td></td><td align="right"><input type="button" class="bg"/><label style="width:150px;margin-right:10px;"></td></tr></table></div>',
    maximizable: false,
    resizable: false,

	initComponent: function() {
		var me = this;
//		me.buttons = [{
//			text: '登录',
//			id: 'login-button',
//			handler: me.onLogin,
//			scope: me
//		}, {
//			text: '重置',
//			handler: me.onResetForm,
//			scope: me
//		}];
		me.items = [{
			anchor: '100%',
			border: false,
			items: [
				me.createLoginForm()
			]
		}];
		me.on('afterrender', me.onKeyPress);
		me.callParent();
	},
	onLogin: function() {
		var me = this;
		var form = Ext.getCmp('login-form').getForm();
		var name = form.findField('NAME').getValue();
		//var remember_name = form.findField('REMEMBER_NAME').checked;
		//var remember_role = form.findField('REMEMBER_ROLE').checked;
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
		var role = form.findField('ROLE').getValue();
		if (role.length != 32) {
			role = '10ca83a1089d11e396021b9f5cdf5948';
		}
		if (remember_name==1) {
			//设置cookie 过期时间
			var expiry = new Date(new Date().getTime() + (1000 * 60 * 7 * 24 * 60)); //一周
			Ext.util.Cookies.set("icuname", name, expiry);
		} else {
			Ext.util.Cookies.clear("icuname");
		}
		if (remember_role==1) {
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
						document.getElementById("login_logo01").style.display="none";
						document.getElementById("login_logo").style.display="none";
			    		document.getElementById("login_copyright").style.display="none";
					} else {
						form.findField('ERRORMSG').setValue(action.result.data.msg);
						Ext.getCmp('login-button').setDisabled(false);
					}
				},
				failure: function(form, action) {
					form.findField('ERRORMSG').setValue('请求超时或网络故障!');
					Ext.getCmp('login-button').setDisabled(false);
				}
			});
		}
	},
	onResetForm: function() {
		Ext.getCmp('login-form').getForm().reset();
		Ext.getCmp('login-form').getForm().setValues({
			'NAME': '',
			'PASSWORD': '',
			'ROLE': ''
		});
	},
	createLoginForm: function() {
		var me = this;
		var form = Ext.create('com.dfsoft.lancet.sys.desktop.LoginForm', {
			parent: this
		});

		//锁定状态下只有密码输入框可编辑
		if (me.locked) {
			var fieldItemArray = form.getForm().getFields().items;
			fieldItemArray[0].setValue(userInfo.name);
			for (var m = 0; m < fieldItemArray.length; m++) {
				if (fieldItemArray[m].name != 'PASSWORD') {
					fieldItemArray[m].readOnly = true;
				}
			}
			//me.buttons[1].disabled = true;
		}
		return form;
	},
	onKeyPress: function(_this, eOpts) {
		var loginWindow = _this.getEl();
		loginWindow.on('keydown', function(e, t, eOpts) {
			//锁定后屏蔽F5和Ctrl + R
			if (_this.locked) {
				if (e.getKey() == 116 || ((event.ctrlKey) && (event.keyCode == 82))) {
					e.preventDefault();
					e.stopEvent();
				}
			}
			if (e.getKey() == 13) {
				_this.onLogin();
			}
		});
	}
});
