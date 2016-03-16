
var isRmoveDiv = false;

//禁止冒泡事件
function doSomething(obj, evt) {
    //alert(obj.id);
    var e = (evt) ? evt : window.event;
    if (window.event) {
        e.cancelBubble = true;
    } else {
        //e.preventDefault();
        e.stopPropagation();
    }
}
function fireDatePickerBlurEvent(event) {
    var datePicker = Ext.getCmp("datePanel"),
        tagName = event.target.tagName,
        isFire = true,
        pickElementId = event.target.id,
        pickElementClass = event.target.className;
    if (datePicker == undefined) {
        if (pickElementId.indexOf('ext') != -1 || pickElementId.indexOf('inputEl') != -1 || pickElementId.indexOf('splitbutton') != -1 || pickElementId.match(/\d\d\d\d+/g) || pickElementClass.indexOf('x-tree-expander') != -1 || pickElementClass.indexOf('boundlist') != -1) {

        } else {
            removeDiv('divc');
        }
        return;
    }
    datePicker.lastEventTargetId = datePicker.eventTargetId;
    datePicker.eventTargetId = pickElementId;
    //如果事件对象是datePicker的子元素不触发事件
    if (pickElementId.indexOf('ext') != -1 || pickElementId.indexOf('inputEl') != -1 || pickElementId.indexOf('splitbutton') != -1 || pickElementId.match(/\d\d\d\d+/g) || pickElementId.indexOf('datePanel') != -1) {
        isFire = false;
    } else if (datePicker.lastEventTargetId != datePicker.eventTargetId) {
        isFire = true;
    }
    if (isFire) {
        datePicker.fireEvent("blur", datePicker);
    }
}
function getLeft(value) {
    var newvalue = value.replace(/[^\x00-\xff]/g, "**");
    if (newvalue.length > 0 && newvalue.length < 10) {
        return 0;
    } else {
        return newvalue.length * 6 + 20;
    }
}
//手动触发事件
function fireEvents(eventStr, targetElement) {
    var evt;
    if (document.createEvent) { // DOM Level 2 standard
        evt = document.createEvent("MouseEvents");
        evt.initMouseEvent(eventStr, true, true, window,
            0, 0, 0, 0, 0, false, false, false, false, 0, null);
        targetElement.dispatchEvent(evt);
    } else if (el.fireEvent) { // IE
        targetElement.fireEvent('on' + eventStr);
    }
}

function createDiv(divId) {
    var elementDiv = document.createElement(divId);
    elementDiv.id = divId;
    document.body.appendChild(elementDiv);
}

function removeDiv(divId) {
    isRmoveDiv = true;
    var elementDiv = document.getElementById(divId);
    var elementList = document.getElementById("divclist");
    if (elementList) {
        elementDiv.removeChild(elementList);
    }
    var elementToolbar = document.getElementById("toolBar");
    if (elementToolbar) {
        elementDiv.removeChild(elementToolbar);
    }
    if (elementDiv) {
        document.body.removeChild(elementDiv);
    }
    isRmoveDiv = false;
}

function setDivBaseStyle(divId, height,zIndex) {
    var elementDiv = document.getElementById(divId);
    elementDiv.style.visibility = "hidden";
    elementDiv.style.position = "absolute";
    elementDiv.style.zIndex = zIndex?zIndex:"9999";
    //elementDiv.style.overflow = "auto";
    //elementDiv.style.overflowX = "hidden";
    //elementDiv.style.overflowY = "hidden";
    elementDiv.scroll = false;
    elementDiv.style.height = height + "px";
}

function setDivDisplayStyle(divId, targetId, width, left, top) {
    var elementDiv = document.getElementById(divId);
    var elementTarget = document.getElementById(targetId);
    elementDiv.style.left = left + "px";
    elementDiv.style.width = width + "px";
    //elementDiv.style.top = (elementTarget.offsetTop + elementTarget.offsetHeight)+"px";
    elementDiv.style.top = (top == null ? (elementTarget.offsetTop + elementTarget.offsetHeight) : top) + "px";
    elementDiv.style.visibility = "visible";
}

function createTreePanel(targetId, renderDivId, url, width, height) {
    var treeModel = Ext.define('DirectoryTreeModel', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'text',
            type: 'string'
        }, {
            name: 'id',
            type: 'string'
        }, {
            name: 'iconCls',
            type: 'string',
            defaultValue: 'settings-dept',
            persist: true
        }]
    });
    var treeStore = Ext.create('Ext.data.TreeStore', {
        model: 'treeModel',
        autoLoad: false,
        root: {
            text: "root",
            expanded: true
        },
        proxy: {
            type: "ajax",
            url: url,
            reader: {
                type: 'json',
                root: 'children'
            }
        }
    });
    var treePanel = Ext.create('Ext.tree.Panel', {
        id: 'treePanel',
        rootVisible: false,
        useArrows: true,
        border: 0,
        margin: '0 0 0 0',
        height: height,
        store: treeStore,
        renderTo: renderDivId,
        listeners: {
            select: function(view, recore, index, e) {
                setTimeout(function() {
                    var elementTarget = document.getElementById(targetId);
                    elementTarget.value = recore.get('text');
                    elementTarget.focus();
                    removeDiv(renderDivId);
                }, 300);
            }
        }
    });
}

function createTreePanelDiv(targetId, url, width, height, left, top) {
    var divId = 'divc';
    var elementDiv = document.getElementById(divId);
    if (elementDiv) {
        removeDiv(divId);
        elementDiv = null;
    }
    createDiv(divId);
    elementDiv = document.getElementById(divId);
    setDivBaseStyle(divId, height);
    setDivDisplayStyle(divId, targetId, width, left, top);
    createTreePanel(targetId, divId, url, width, height);
}

function createDateField(targetId, renderDivId, dateArray,dateData) {
    var format = 'Y-m-d';
    var currentValue = "";
    if(dateData){
        currentValue = new Date(dateData);
    }else{
        currentValue = null;
    }
    var targetIds = null;
    if (dateArray) {
        format = dateArray.format;
        targetIds = dateArray.targetIds;
    }
    Ext.create('Ext.picker.Date', {
        format: format,
        renderTo: renderDivId,
        value:currentValue,
        id: 'datePanel',
        handler: function(picker, date) {
            var dateText = Ext.util.Format.date(date, format);
            if (targetIds != null) {
                for (var i = 0; i < targetIds.length; i++) {
                    format = targetIds[i][0];
                    var tempid = targetIds[i][1];
                    var elementTarget = document.getElementById(tempid);
                    dateText = Ext.util.Format.date(date, format);
                    elementTarget.value = dateText;
                }
            } else {
                //将时间格式化成字符串赋值给input
                var elementTarget = document.getElementById(targetId);
                elementTarget.value = dateText;
            }
            elementTarget.focus();
            //销毁div
            removeDiv(renderDivId);
        },
        listeners:{
            blur: function(_this, e, eOpts) {
                removeDiv(renderDivId);
            },
            boxready: function (_this, _width, _height, eOpts) {
                var d = document.getElementById(targetId).value.replace('-', '/').replace('-', '/');
                d = d.trim();
if (d && d != '') {
                    d = new Date(d);
                    this.setValue(d);
                }

            }
        }
    });
}

function createDateFieldDiv(targetId, left, top, dateArray,dateData) {

    var divId = 'divc';
    var elementDiv = document.getElementById(divId);
    if (elementDiv) {
        removeDiv(divId);
        elementDiv = null;
    }
    var height = 238;
    var width = 212;
    createDiv(divId);
    elementDiv = document.getElementById(divId);
    setDivBaseStyle(divId, height);
    setDivDisplayStyle(divId, targetId, width, left, top);
    createDateField(targetId, divId, dateArray,dateData);
}

//queryMode:localhost 或 remote ,如果是 remote 传入一个数组
function createBoundList(targetId, renderDivId, width, height, url, limit, queryMode, localArray, MultiSelect, isPlaceholder) {
    var store = getBoundListStore(limit, queryMode, url, localArray);
    var oldList = Ext.getCmp('boundlist');
    oldList && oldList.destroy();
    var boundList = Ext.create('Ext.view.BoundList', {
        id: 'boundlist',
        width: width,
        height: height,
        store: store,
        renderTo: renderDivId,
        displayField: 'text',
        pageSize: limit,
        listeners: {
            beforerender: {
                fn: function() {
                    if (limit <= 0) return;
                    var preDiagnosisPagTar = this.pagingToolbar;
                    preDiagnosisPagTar.baseCls = 'my-toolbar';
                    preDiagnosisPagTar.itemCls = 'my-toolbar-item';
                    preDiagnosisPagTar.afterPageText = '页/{0}';
                }
            },
            select: {
                fn: function() {
                    var record = this.getSelectionModel().getSelection()[0];
                    var res = record.get('text');
                    if (res == '没有找到相匹配的数据' || res == '无该记录，请重新输入' || res == '没有找到相匹配的人员') {
                        return;
                    }
                    //麻醉记录单新增
                    //根据ID存放数据到麻醉记录单，如果ID重复，则直接跳出
                    /*if (res.length > 0) {
                     //判断是否存在resData对象
                     if (typeof(resData) != 'undefined') {
                     var id = record.get('id'); //获取人员ID（后加）
                     if (typeof(id) != 'undefined') {
                     if (id.length > 0) {
                     //判断是否存在person对象
                     if (typeof(resData.person) != 'undefined') {
                     if (targetId === 'teamEquipmentNurses' && typeof(resData.person.teamEquipmentNurses) != 'undefined') { //器械护士
                     var EquipmentNurses_LEN = resData.person.teamEquipmentNurses.length;
                     if (EquipmentNurses_LEN > 0) {
                     for (var EquipmentNurses_I = 0; EquipmentNurses_I < EquipmentNurses_LEN; EquipmentNurses_I++) {
                     if (resData.person.teamEquipmentNurses[EquipmentNurses_I].ID != id) {
                     resData.person.teamEquipmentNurses.push({
                     ID: id,
                     NAME: res
                     });
                     } else {
                     return;
                     }
                     }
                     } else {
                     resData.person.teamEquipmentNurses.push({
                     ID: id,
                     NAME: res
                     });
                     }
                     } else if (targetId === 'teamItineracyNurses' && typeof(resData.person.teamItineracyNurses) != 'undefined') { //巡回护士
                     var ItineracyNurses_LEN = resData.person.teamItineracyNurses.length;
                     if (ItineracyNurses_LEN > 0) {
                     for (var ItineracyNurses_I = 0; ItineracyNurses_I < ItineracyNurses_LEN; ItineracyNurses_I++) {
                     if (resData.person.teamItineracyNurses[ItineracyNurses_I].ID != id) {
                     resData.person.teamItineracyNurses.push({
                     ID: id,
                     NAME: res
                     });
                     } else {
                     return;
                     }
                     }
                     } else {
                     resData.person.teamItineracyNurses.push({
                     ID: id,
                     NAME: res
                     });
                     }
                     } else if (targetId === 'teamAnesthesiaDoctor' && resData.person.teamAnesthesiaDoctor != undefined) { //麻醉者
                     var AnesthesiaDoctor_LEN = resData.person.teamAnesthesiaDoctor.length;
                     if (AnesthesiaDoctor_LEN > 0) {
                     for (var AnesthesiaDoctor_I = 0; AnesthesiaDoctor_I < AnesthesiaDoctor_LEN; AnesthesiaDoctor_I++) {
                     if (resData.person.teamAnesthesiaDoctor[AnesthesiaDoctor_I].ID != id) {
                     resData.person.teamAnesthesiaDoctor.push({
                     ID: id,
                     NAME: res
                     });
                     } else {
                     return;
                     }
                     }
                     } else {
                     resData.person.teamAnesthesiaDoctor.push({
                     ID: id,
                     NAME: res
                     });
                     }
                     }
                     }
                     }
                     }
                     }
                     }*/
                    var targetElement = document.getElementById(targetId);
                    if (MultiSelect && MultiSelect === '1') {
                        res = record.get('value');
                        if (res) {} else {
                            res = record.get('text');
                            if (res == '没有找到相匹配的数据' || res == '无该记录，请重新输入' || res == '没有找到相匹配的人员') {
                                res = '';
                            }
                        }
                        if (isPlaceholder) {
                            /*targetElement.value = null;
                             targetElement.placeholder = res;*/
                            targetElement.value = res;
                        } else {
                            targetElement.value = res;
                        }
                        fireEvents('change', targetElement);
                        removeDiv('divc');
                    } else if (MultiSelect && MultiSelect === '2') {
                        /*if (targetElement.value.length > 1) {
                         targetElement.value = targetElement.value + ',' + res;
                         } else if (targetElement.value.length = 1) {
                         targetElement.value = targetElement.value + res;
                         } else {
                         targetElement.value = res + ',';
                         }*/
                        targetElement.value = multiSelectGetValue(targetElement.value, res);
                        fireEvents('change', targetElement);
                        targetElement.focus();
                    } else if (MultiSelect && MultiSelect === '3') {
                        if (res == '没有找到相匹配的数据' || res == '无该记录，请重新输入' || res == '没有找到相匹配的人员') {
                            res = '';
                            targetElement.value = targetElement.value;
                        } else {
                            targetElement.value = (targetElement.value).substring(0, targetElement.value.lastIndexOf(',') + 1) + res;
                        }

                        /*if (res.length > 0 && resData != undefined && typeof(resData) != undefined) {
                         var code = record.get('surgery_code');
                         if (code != undefined && typeof(code) != undefined) {
                         if (code.length > 0) {
                         //判断是否存在finalSurgeryName对象
                         if (typeof(resData.finalSurgeryName) != 'undefined' && targetId === 'preSurgery2') {
                         var surgeryArr = resData.finalSurgeryName.length;
                         if (surgeryArr > 0) {
                         for (var i = 0; i < surgeryArr; i++) {
                         if (code != null && resData.finalSurgeryName[i].SURGERY_CODE != code) {
                         resData.finalSurgeryName.push({
                         ID: null,
                         SURGERY_ID: resData.records.SURGERY_ID,
                         SURGERY_CODE: code,
                         SURGERY_NAME: res,
                         SURGERY_LEVEL_CODE: null,
                         SORT_NUMBER: surgeryArr + 1
                         });
                         } else {
                         return;
                         }
                         }
                         } else {
                         resData.finalSurgeryName.push({
                         ID: null,
                         SURGERY_ID: resData.records.SURGERY_ID,
                         SURGERY_CODE: code,
                         SURGERY_NAME: res,
                         SURGERY_LEVEL_CODE: null,
                         SORT_NUMBER: 1
                         });
                         }
                         }
                         if (typeof(resData.finalDiagnosisName) != 'undefined' && targetId === 'afterDiagnosis') {
                         var diagnosisArr = resData.finalDiagnosisName.length;
                         if (diagnosisArr > 0) {
                         for (var i = 0; i < diagnosisArr; i++) {
                         if (code != null && resData.finalDiagnosisName[i].DIAGNOSIS_CODE != code) {
                         resData.finalDiagnosisName.push({
                         ID: null,
                         SURGERY_ID: resData.records.SURGERY_ID,
                         DIAGNOSIS_CODE: code,
                         DIAGNOSIS_NAME: res,
                         SORT_NUMBER: diagnosisArr + 1
                         });
                         } else {
                         return;
                         }
                         }
                         } else {
                         resData.finalDiagnosisName.push({
                         ID: null,
                         SURGERY_ID: resData.records.SURGERY_ID,
                         DIAGNOSIS_CODE: code,
                         DIAGNOSIS_NAME: res,
                         SORT_NUMBER: 1
                         });
                         }
                         }
                         }
                         }
                         }*/

                        //Code的保存
                        var codeElement = document.getElementById(targetId + 'Code');
                        if (codeElement) {
                            codeElement.value = (codeElement.value).substring(0, codeElement.value.lastIndexOf('},') + 2) + ('{"code":"' + record.get('surgery_code') + '","name":"' + res + '"},');
                        }

                        fireEvents('change', targetElement);
                        removeDiv('divc');
                    } else if (MultiSelect && MultiSelect === '4') {
                        res = record.get('text');
                        if (isPlaceholder) {
                            targetElement.value = res;
                        } else {
                            targetElement.value = res;
                        }
                        fireEvents('change', targetElement);
                        removeDiv('divc');
                    }
                    if (isPlaceholder) {
                        moveCursorToStart(targetElement);
                    } else {
                        targetElement.focus();
                    }
                }
            }
        }
    });

    //鼠标滚轮事件阻止冒泡，王小伟 2014-05-12
    var view = boundList.getEl().dom.firstElementChild;
    view.onmousewheel = function(e) {
        view.scrollTop -= e.wheelDelta;
        e = e || window.event;
        if (e.preventDefault)
            e.preventDefault();
        e.returnValue = false;
    }
}

//将input框中光标移到最前面
function moveCursorToStart(obj) {
    obj.focus();
    if (obj.createTextRange) {
        var rtextRange = obj.createTextRange();
        rtextRange.moveStart('character', 0);
        rtextRange.moveEnd('character', 0);
        rtextRange.collapse(true);
        rtextRange.select();
    } else if (obj.selectionStart) {
        obj.selectionStart = 0;
        obj.selectionEnd = 0;
    }
}

//多选时,多次点击判断当前input中是否有此值,如果有去掉,没有加上
function multiSelectGetValue(value, res) {
    var flag = false;
    if (res) {
        var tempValue = '';
        if (value && value.length > 0) {
            var values = value.split(',');
            for (var i = 0; i < values.length; i++) {
                if (values[i] === res) {
                    flag = true;
                }
                tempValue += values[i] + ',';
            }
        } else {
            tempValue = res + ',';
            flag = true;
        }
        if (!flag) {
            tempValue = value + ',' + res + ',';
        }
    }
    return tempValue.substring(0, tempValue.length - 1);
}
function createBoundListDiv(targetId, width, height, left, url, value, limit, queryMode, localArray, MultiSelect, top, isPlaceholder,zIndex) {
    if (queryMode && queryMode === 'remote') { //远程是拼接url
        var paramStr = getBoundListParamStr(value);
        if (paramStr === null) {
            removeDiv('divc');
            return;
        } else {
            url = url + '?query=' + paramStr;
        }
    }
    var divId = 'divc';
    var elementDiv = document.getElementById(divId);
    if (elementDiv) {
        removeDiv(divId);
        elementDiv = null;
    }
    createDiv(divId);
    elementDiv = document.getElementById(divId);
    setDivBaseStyle(divId, height,zIndex);
    setDivDisplayStyle(divId, targetId, width, left, top);
    createBoundList(targetId, divId, width, height, url, limit, queryMode, localArray, MultiSelect, isPlaceholder);
}

function getBoundListStore(limit, queryMode, url, localArray) {
    var store = null;
    var root = null;
    var totalProperty = null;
    if (limit > 0) {
        root = 'data.data';
        totalProperty = 'data.totalCount';
    } else {
        root = 'data';
        totalProperty = 'totalCount';
    }

    if (queryMode) {
        if (queryMode === 'remote') {
            store = Ext.create('Ext.data.Store', {
                pageSize: limit,
                fields: ['text', 'surgery_code'],
                autoLoad: true,
                proxy: {
                    type: 'ajax',
                    url: url,
                    reader: {
                        type: 'json',
                        root: root,
                        totalProperty: totalProperty
                    }
                },
                listeners: {
                    load: function(_this, records, successful, eOpts) {
                        var size = _this.getCount();
                        if (size <= 0) {
                            removeDiv('divc');
                        }
                    }
                }
            });
        } else if (queryMode === 'localhost') {
            store = Ext.create('Ext.data.Store', {
                pageSize: 0,
                fields: ['text', 'value'],
                data: localArray
            });
        }
    }
    return store;
}

function getBoundListParamStr(value) {
    var paramStr = 'all';
    if (value != null) {
        if (Ext.util.Format.trim(value) != '') {
            paramStr = Ext.util.Format.trim(value);
        } else {
            paramStr = null;
        }
        if (paramStr && paramStr.indexOf(",") > 0) {
            var valueArr = paramStr.split(',');
            paramStr = valueArr[valueArr.length - 1];
            if (paramStr === null || Ext.util.Format.trim(paramStr) === '') {
                paramStr = null;
            }
        }
    } else {
        return null;
    }
    var reg = /[\u4E00-\u9FA5]/g;
    if (!reg.test(paramStr)) {
        paramStr = paramStr;
    } else {
        paramStr = null;
    }
    return paramStr;
}

function createOnlyDiv(targetId, width, height, left, top) {
    var divId = 'divc';
    var elementDiv = document.getElementById(divId);
    if (elementDiv) {
        removeDiv(divId);
        elementDiv = null;
    }
    createDiv(divId);
    elementDiv = document.getElementById(divId);
    setDivBaseStyle(divId, height);
    setDivDisplayStyle(divId, targetId, width, left, top);
}

/*
 type : treePanel、datePanel、comboboxPanel、onlyDiv,都要用
 targetId : 使用控件的元素的id,都要用
 url : 对于comboboxPanel和treePanel需要数据url
 width : 控件的宽treePanel和comboboxPanel、onlyDiv可以设置
 left :　控件显示的横坐标数值,treePanel、datePanel、onlyDiv可以设置
 top : 控件显示的纵坐标数值,都可以设置
 height : 控件的高度treePanel和comboboxPanel、onlyDiv可以设置
 value : 使用控件的元素的value,只有comboboxPanel有用
 event : 使用控件的元素的event,只有comboboxPanel有用
 limit : 只有comboboxPanel有用,设置显示的条数
 queryMode : localhost 或 remote ,如果是 remote 传入一个数组
 localArray : 本地数组,要求每个元素中有text对象
 MultiSelect : 单选 : '1' ,多选 : '2',多值搜索 : '3'
 dateArray : 日期组件当时赋值给多个input时使用,//var dateArray = {format:'Y-m-d',targetIds:[['Y','recordYear'],['m','recordMonth'],['d','recordDay']]};
 */
function createFloatDiv(type, targetId, url, width, left, top, height, value, limit, queryMode, localArray, MultiSelect, dateArray, isPlaceholder,zIndex) {
    console.log(type);
    console.log(targetId);
    console.log(url);
    console.log(width);
    console.log(left);
    console.log(top);
    console.log(height);
    console.log(value);
    console.log(limit);
    console.log(queryMode);
    console.log(localArray);
    console.log(MultiSelect);
    console.log(dateArray);
    console.log(isPlaceholder);
    console.log(zIndex);

   // dateArray = new Date("2015-12-12");
  // console.log(dateArray);

    var divId = 'divc';
    if (type === 'treePanel') {
        createTreePanelDiv(targetId, url, width, height, left, top);
    } else if (type === 'datePanel') {
        createDateFieldDiv(targetId, left, top, dateArray);
    } else if (type === 'comboboxPanel') {
        elementOnChange(value, targetId, event, url, limit, width);
    } else if (type === 'onlyDiv') {
        activeElementId = 'divc';
        createOnlyDiv(targetId, width, height, left, top); //创建空白div
    } else if (type === 'boundListPanel') {
        createBoundListDiv(targetId, width, height, left, url, value, limit, queryMode, localArray, MultiSelect, top, isPlaceholder,zIndex);
    } else if (type === 'dateTimePickerPanel') {
        createDateTimeFieldDiv(targetId, left, top, dateArray, value, true);
    }
    return divId;
}
/**
 * 带时间的日期控件
 * @param targetId
 * @param left
 * @param top
 * @param dateArray
 * @param dateData
 * @param isHideCancle
 */
function createDateTimeFieldDiv(targetId, left, top, dateArray, dateData, isHideCancle) {
    var divId = 'divc';
    var elementDiv = document.getElementById(divId);
    if (elementDiv) {
        removeDiv(divId);
        elementDiv = null;
    }
    var height = 255;
    var width = 212;
    createDiv(divId);
    elementDiv = document.getElementById(divId);
    setDivBaseStyle(divId, height);
    setDivDisplayStyle(divId, targetId, width, left, top);
    console.log(dateData);
    createDateTimeField(targetId, divId, dateArray, dateData, isHideCancle);
}

function removeFolatDiv(type, event, id){
    if (type && type === 'datePanel') {
        if (isRmoveDiv) {

        } else {
            var res = getDivcElement(event.relatedTarget, 'divc');

            if (res == '2') {
                // removeDiv('divc');
                // console.log("啥也没干００００");
            } else if (res == '1') {
                var targetElement = event.srcElement;
                targetElement.focus();
            }
        }
    } else {
        if (event && event.relatedTarget) {
            var res = getDivcElement(event.relatedTarget, 'divc');
            if (res == '2') {
                removeDiv('divc');
            } else if (res == '1') {
                var targetElement = event.srcElement;
                targetElement.focus();
            }
        } else {
            removeDiv('divc');
        }
    }
}
/*function removeFolatDiv(type, event, id) {
 if (type && type === 'datePanel') {
 setTimeout(function() {
 var res = getDivcElement(event.relatedTarget, 'divc');
 if (res == '2') {
 removeDiv('divc');
 }
 }, 300);
 } else {
 if (event && event.relatedTarget) {
 var res = getDivcElement(event.relatedTarget, 'divc');
 if (res == '2') {
 removeDiv('divc');
 } else if (res == '1') {
 var targetElement = event.srcElement;
 targetElement.focus();
 }
 } else {
 removeDiv('divc');
 }

 }
 *//*if (type === 'treePanel') {
 if (event.relatedTarget && (event.relatedTarget.id === 'treePanel' || event.relatedTarget.parentElement.id.indexOf('treePanel') > -1)) {} else {
 removeDiv('divc');
 }
 } else if (type === 'datePanel') {
 setTimeout(function() {
 if (event.relatedTarget && event.relatedTarget.id === 'datePanel') {} else {
 removeDiv('divc');
 }
 }, 300);
 }*//*
 *//*else if(type === 'comboboxPanel'){
 setTimeout(function(){
 if(activeElementId){
 activeElementId = null;
 return;
 }else{
 removeFolatDiv();
 }
 }, 200);
 }*//*
 *//*else if (type === 'onlyDiv') {
 removeDiv('divc');
 } else if (type === 'boundListPanel') {
 if (event.relatedTarget && (event.relatedTarget.id === 'boundlist' || event.relatedTarget.parentElement.id.indexOf('boundlist') > -1)) {} else {
 removeDiv('divc');
 }
 }*//*
 }*/

//获取
function getDivcElement(relatedElement, id) {
    var res = 0;
    var flag = true;
    if (!relatedElement) { //直到最外层，relatedElement为null了
        flag = false;
        res = 2; //不是divc中的元素
    }
    while (flag) {
        relatedElement = relatedElement.parentElement;
        if (!relatedElement) { //直到最外层，relatedElement为null了
            flag = false;
            res = 2; //不是divc中的元素
            break;
        }
        if (relatedElement.id === id) {
            flag = false;
            res = 1; //是divc中的元素
        }
    }
    if (!flag) {
        return res;
    }
}

//测试例子
function departmentsOnClick(deptId) {
    var url = parent.webRoot + '/sys/tree/dept';
    createFloatDiv('treePanel', deptId, url, 350, document.getElementById(deptId).offsetLeft, 200);
}

function dateOnClick(id) {
    createFloatDiv('datePanel', id, null, null, document.getElementById(id).offsetLeft - document.getElementById(id).offsetWidth);
}

function preDiagnosisOnChange(value, id, event) {
    var url = parent.webRoot + '/dic/disease_category/';
    var localArray = [{
        text: '男'
    }, {
        text: '女'
    }];
    createFloatDiv('boundListPanel', id, url, 250, document.getElementById(id).offsetLeft, 300, value, 10, 'localhost', localArray, '3');
}

/**
 * 带时间的日期控件
 * @param targetId
 * @param renderDivId
 * @param dateArray
 * @param dateData
 * @param isHideCancle
 */
function createDateTimeField(targetId, renderDivId, dateArray, dateData, isHideCancle) {
    // {format:'Y-m-d',targetIds:[['Y','recordYear'],['m','recordMonth'],['d','recordDay']]};
    var format = 'Y-m-d';
    var targetIds = null;
    if (dateArray) {
        format = dateArray.format;
        targetIds = dateArray.targetIds;
    }
    var value = null;
    if (dateData == null) {
        value = new Date();
    } else {
        value = new Date(dateData);
    }

    var isCancle = false;
    if (isHideCancle != null) {
        isCancle = isHideCancle;
    }
    /*com.dfsoft.lancet.plugin.DateTimeControls*/
    Ext.create(/*'Ext.ux.datetime.DateTime'*/ 'com.dfsoft.lancet.plugin.DateTimeControls', {
        id: 'dateTimePickerPanel_'+targetId.split('_')[1],
        format: format,
        renderTo: renderDivId,
        showTime: false,
        showToday: true,
        border: true,
        hideResetBtn: isCancle,
        onDestroy: function() {
            removeDiv(renderDivId);
        },
        listeners: {
            select: function(_picker, _date, eOpts) {
                var dateText = Ext.util.Format.date(_date, format);
                if (targetIds != null) {
                    for (var i = 0; i < targetIds.length; i++) {
                        format = targetIds[i][0];
                        var tempid = targetIds[i][1];
                        var elementTarget = document.getElementById(tempid);
                        dateText = Ext.util.Format.date(_date, format);
                        elementTarget.value = dateText;
                    }
                } else {
                    //将时间格式化成字符串赋值给input
                    var elementTarget = document.getElementById(targetId);
                    elementTarget.value = dateText;
                }
                elementTarget.focus();
            },
            boxready: function(_this, _width, _height, eOpts) {
                _this.setValue(value);
                if (format == 'Y-m-d H'|| format == 'Y/m/d H'||format == 'm-d H'|| format == 'm/d H') {
                    _this.hour.setValue(value.getHours());
                } else if (format == 'Y-m-d H:i'||format == 'Y/m/d H:i'||format == 'm-d H:i'||format == 'm/d H:i'||format == 'm/dH:i') {
                    _this.hour.setValue(value.getHours());
                    _this.minute.setValue(value.getMinutes());
                } else if (format == 'Y-m-d H:i:s'||format == 'Y/m/d H:i:s'||ormat == 'm-d H:i:s'||format == 'm/d H:i:s') {
                    _this.hour.setValue(value.getHours());
                    _this.minute.setValue(value.getMinutes());
                    _this.second.setValue(value.getSeconds());
                }
            },
            blur: function(_this, e, eOpts) {
                removeDiv(renderDivId);
            }

        }
    });
}