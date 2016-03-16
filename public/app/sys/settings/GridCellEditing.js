/**
 * 定义GridCellEditing
 *
 * @author chm
 * @version 2012-7-30
 */

/**
 * 带分组grid单元格可编辑控件解决方案 、 0. 创建普通可编辑Grid，注意在需要在可编辑列添加一个控件（可任意），主要是控制某列可编辑 1.
 * 定义自己的CellEditings，要继承CellEditings，在grid当中引入自定义的CellEditings 2.
 * 重写getEditor方法，根据record动态创建组件 3.
 * 在grid中添加个renderer方法分别控制date和combBox控件在grid当中的显示值，需要根据record的值确定如何处理 4.
 * 在后台grid
 * json中，需要将combox选项值当作一个属性附带到前台，每单元格如果是comboBox控件，都需要动态创建，并动态添加store对应的数据 5.
 * 编辑完成后需要完成提交工作
 */

Ext.define('com.dfsoft.lancet.sys.settings.GridCellEditing', {
	extend: 'Ext.grid.plugin.CellEditing',
	alias: 'plugin.gridcellediting',

	constructor: function() {
		this.callParent(arguments);
	},
	getEditor: function(record, column) {
		var me = this,
			editorClass = record.raw.editor.editorClass,
			// 根据父节点名称和自己的名称区分当前的editor
			editorId = editorClass + "_" +record.parentNode.raw.option + "_" + record.raw.option,
			editors = me.editors,
			editor = editors.getByKey(editorId),
			// Add to top level grid if we are editing one side of a locking system
			editorOwner = me.grid.ownerLockable || me.grid;
        //为了保证每次都执行getInnerTpl，对于图示编辑器每次都重新生成
		if (!editor || (editorClass === 'COMBOBOX' && record.raw.option === '图示') ) {
			if (editorClass === 'TEXT') {
				editor = new Ext.form.field.Text({
					selectOnFocus: true,
					allowBlank: true,
					regex: eval(record.raw.validatorRegexp),
					regexText: record.raw.regexpInfo
					// 验证错误之后的提示信息,
				});
			} else if (editorClass === 'COMBOBOX') {
				var fields = eval(record.raw.selectFields);
				editor = new Ext.form.field.ComboBox({
					editable: false,
					valueField: 'selValue',
					displayField: 'disValue',
					store: Ext.create('Ext.data.Store', {
						fields: fields,
						data: eval(record.raw.selectItems)
					})
				});
				if (fields.length === 3) {
                    if (record.raw.option === '图示') {
                        editor.listConfig = {
                            getInnerTpl: function() {
                                // here you place the images in your combo
                                var color = record.previousSibling.data.settings;

//                                var tpl = '<div>' +
//                                    '<iframe frameborder="0" scrolling="no" width="17" height="17" src="/app/nws/LegendDraw.html?icon={icon}&color='
//                                    + color + '"></iframe>' +
//                                    '<span style="padding-left: 18px;">{disValue}</span></div>';
                                var treepanel = column.up('treepanel');
                                var tpl = '<div style="width: 16px; height:16px; float: left;" icon="{icon}" color="' + color + '"><canvas width="22px" height="16px"></canvas>'
                                    + '<iframe frameborder="0" scrolling="no" width="0" height="0" src="" onLoad="Ext.getCmp(\''
                                    + treepanel.getId() + '\').drawLegend(this);"></iframe></div><span style="padding-left: 18px; ">{disValue}</span>';
                                return tpl;
                            }
                        }
                    } else {
                        editor.listConfig = {
                            getInnerTpl: function() {
                                // here you place the images in your combo
                                var tpl = '<div>' +
                                    '<div class="{icon}" style="width: 16px; height: 16px; position: absolute; margin-top: 2px;"></div>' +
                                    '<span style="padding-left: 18px;">{disValue}</span></div>';
                                return tpl;
                            }
                        }
                    }
				}
			} else if (editorClass === 'NUMBER') {
				editor = new Ext.form.field.Number(record.raw.validRex?record.raw.validRex:{

				});
			}
			if (!editor) {
				return false;
			}

			// Allow them to specify a CellEditor in the Column
			if (editor instanceof Ext.grid.CellEditor) {
				editor.floating = true;
			}
			// But if it's just a Field, wrap it.
			else {
				editor = new Ext.grid.CellEditor({
					floating: true,
					editorId: editorId,
					field: editor
				});
			}
			// Add the Editor as a floating child of the grid
			editorOwner.add(editor);
			editor.on({
				scope: me,
				specialkey: me.onSpecialKey,
				complete: me.onEditComplete,
				canceledit: me.cancelEdit
			});
			column.on('removed', me.cancelActiveEdit, me);
			editors.add(editor);
		}

		if (column.isTreeColumn) {
			editor.isForTree = column.isTreeColumn;
			editor.addCls(Ext.baseCSSPrefix + 'tree-cell-editor')
		}
		editor.grid = me.grid;

		// Keep upward pointer correct for each use - editors are shared between locking sides
		editor.editingPlugin = me;
		return editor;
	}
});