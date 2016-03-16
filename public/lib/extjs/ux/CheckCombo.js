Ext.define('Ext.ux.CheckCombo',{ 
    extend: 'Ext.form.field.ComboBox', 
    alias: 'widget.checkcombo', 
    multiSelect: true, 
    allSelector: false, 
    addAllSelector: false, 
    allText: 'All', 
    createPicker: function() { 
       var me = this, 
           picker, 
           menuCls = Ext.baseCSSPrefix + 'menu', 
           opts = Ext.apply({ 
               pickerField: me, 
               selModel: { 
                   mode: me.multiSelect ? 'SIMPLE' : 'SINGLE' 
               }, 
               floating: true, 
               hidden: true, 
               ownerCt: me.ownerCt, 
               cls: me.el.up('.' + menuCls) ? menuCls : '', 
               store: me.store, 
               displayField: me.displayField, 
               focusOnToFront: false, 
               pageSize: me.pageSize, 
               tpl:  
            [ 
                '<ul><tpl for=".">', 
                    '<li style="left:-30px;list-style-type: none;" role="option" class="' + Ext.baseCSSPrefix + 'boundlist-item"><span class="x-combo-checker">&nbsp;</span> {' + me.displayField + '}</li>', 
                '</tpl></ul>' 
            ] 
           }, me.listConfig, me.defaultListConfig); 

       picker = me.picker = Ext.create('Ext.view.BoundList', opts); 
       if (me.pageSize) { 
           picker.pagingToolbar.on('beforechange', me.onPageChange, me); 
       }         

       me.mon(picker, { 
           itemclick: me.onItemClick, 
           refresh: me.onListRefresh, 
           scope: me 
       }); 

       me.mon(picker.getSelectionModel(), { 
           'beforeselect': me.onBeforeSelect, 
           'beforedeselect': me.onBeforeDeselect, 
           'selectionchange': me.onListSelectionChange, 
           scope: me 
       }); 

       return picker; 
    }, 
    getValue: function() 
    { 
      return this.value.join(','); 
    }, 
    getSubmitValue: function() 
    { 
        return this.getValue(); 
    }, 
    setValue: function(value, doSelect) {
        var me = this,
            valueNotFoundText = me.valueNotFoundText,
            inputEl = me.inputEl,
            i, len, record,
            dataObj,
            matchedRecords = [],
            displayTplData = [],
            processedValue = [];

        if (me.store.loading) {
            // Called while the Store is loading. Ensure it is processed by the onLoad method.
            me.value = value;
            me.setHiddenValue(me.value);
            return me;
        }

        // This method processes multi-values, so ensure value is an array.
        if(typeof(value) == "string"){
        	value = value.split(",");
        }else{
        	 value = Ext.Array.from(value);
        }
        // Loop through values, matching each from the Store, and collecting matched records
        for (i = 0, len = value.length; i < len; i++) {
            record = value[i];
            if (!record || !record.isModel) {
                record = me.findRecordByValue(record);
            }
            // record found, select it.
            if (record) {
                matchedRecords.push(record);
                displayTplData.push(record.data);
                processedValue.push(record.get(me.valueField));
            }
            // record was not found, this could happen because
            // store is not loaded or they set a value not in the store
            else {
                // If we are allowing insertion of values not represented in the Store, then push the value and
                // create a fake record data object to push as a display value for use by the displayTpl
                if (!me.forceSelection) {
                    processedValue.push(value[i]);
                    dataObj = {};
                    dataObj[me.displayField] = value[i];
                    displayTplData.push(dataObj);
                    // TODO: Add config to create new records on selection of a value that has no match in the Store
                }
                // Else, if valueNotFoundText is defined, display it, otherwise display nothing for this value
                else if (Ext.isDefined(valueNotFoundText)) {
                    displayTplData.push(valueNotFoundText);
                }
            }
        }

        // Set the value of this field. If we are multiselecting, then that is an array.
        me.setHiddenValue(processedValue);
        me.value = me.multiSelect ? processedValue : processedValue[0];
        if (!Ext.isDefined(me.value)) {
            me.value = null;
        }
        me.displayTplData = displayTplData; //store for getDisplayValue method
        me.lastSelection = me.valueModels = matchedRecords;

        if (inputEl && me.emptyText && !Ext.isEmpty(value)) {
            inputEl.removeCls(me.emptyCls);
        }

        // Calculate raw value from the collection of Model data
        me.setRawValue(me.getDisplayValue());
        me.checkChange();

        if (doSelect !== false) {
            me.syncSelection();
        }
        me.applyEmptyText();

        return me;
    },

    expand: function() 
    { 
       var me = this, 
           bodyEl, picker, collapseIf; 

       if (me.rendered && !me.isExpanded && !me.isDestroyed) { 
           bodyEl = me.bodyEl; 
           picker = me.getPicker(); 
           collapseIf = me.collapseIf; 

           //显示 
           picker.show(); 
           me.isExpanded = true; 
           me.alignPicker(); 
           bodyEl.addCls(me.openCls); 

            if(me.addAllSelector == true && me.allSelector == false) 
            { 
                me.allSelector = picker.getEl().insertHtml('afterBegin', '<div class="x-boundlist-item" role="option"><span class="x-combo-checker">&nbsp;</span> '+me.allText+'</div>', true); 
                me.allSelector.on('click', function(e) 
                { 
                    if(me.allSelector.hasCls('x-boundlist-selected')) 
                    { 
                        me.allSelector.removeCls('x-boundlist-selected'); 
                        me.setValue(''); 
                        me.fireEvent('select', me, []); 
                    } 
                    else 
                    { 
                        var records = []; 
                        me.store.each(function(record) 
                        { 
                            records.push(record); 
                        }); 
                        me.allSelector.addCls('x-boundlist-selected'); 
                        me.select(records); 
                        me.fireEvent('select', me, records);  
                    } 
                }); 
            } 
           // 监听 
           me.mon(Ext.getDoc(), { 
               mousewheel: collapseIf, 
               mousedown: collapseIf, 
               scope: me 
           }); 
           Ext.EventManager.onWindowResize(me.alignPicker, me); 
           me.fireEvent('expand', me); 
           me.onExpand(); 
           
           if(me.getValue() != ""){
        	   var records = []; 
        	   me.store.each(function(record) { 
        		   if(me.getValue().indexOf(record.get(me.valueField)) != -1){
        			   records.push(record); 
        		   }
               }); 
        	   me.select(records); 
               me.fireEvent('select', me, records);  
           }
            
           
       } 
    }, 
    onListSelectionChange: function(list, selectedRecords)  
    { 
       var me = this, 
           isMulti = me.multiSelect, 
           hasRecords = selectedRecords.length > 0; 
        
       if (me.isExpanded) { 
           if (!isMulti) { 
               Ext.defer(me.collapse, 1, me); 
           } 
           
     
           if (isMulti || hasRecords) { 
               me.setValue(selectedRecords, false); 
           } 
           if (hasRecords) { 
               me.fireEvent('select', me, selectedRecords); 
           } 
           me.inputEl.focus(); 
       } 
        
        if(me.addAllSelector == true && me.allSelector != false) 
        { 
            if(selectedRecords.length == me.store.getTotalCount()) me.allSelector.addCls('x-boundlist-selected'); 
            else me.allSelector.removeCls('x-boundlist-selected');  
        }     
    } 
}); 
