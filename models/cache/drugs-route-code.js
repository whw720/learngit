/**
 * 用药途径缓存生成表
 * @author:whw
 * @date:2014-3-11.
 */
var routeCodes=[],
    drugsCategory=[],
    unit=[],
    consumable=[],
    shedulType=[];

var dao = require('../dao/nws/doctor-order-dao'),
    consumDao = require('../dao/dtm/dtm-accessibility-dao');  //数据库查询组件
var isLoad=false;

exports.getRouteCode=function(){
    return routeCodes;
}
exports.getDrugsCategory=function(){
    return drugsCategory;
}
exports.getUnit=function(){
    return unit;
}
exports.getConsumable=function(){
    return consumable;
}
exports.getShedulType=function(){
    return shedulType;
}
exports.getRouteName=function(code){
    for(var i=0;i<routeCodes.length;i++){
        var route=routeCodes[i];
        if(route.code==code){
            return route.name;
        }
    }
    return '';
}
exports.getDrugsCategoryName=function(code){
    for(var i=0;i<drugsCategory.length;i++){
        var route=drugsCategory[i];
        if(route.code==code){
            return route.name;
        }
    }
    return '';
}
exports.load=function(){
    if(isLoad||routeCodes.length!=0){
        return;
    }
    loadRoute();
    loadDrugs();
    loadUnit();
    loadConsumable();
    loadShedulType();
    isLoad=true;
}
//加载用药途径
function loadRoute(){
    dao.queryDrugsRoute('DIC_DRUGS_ROUTE',function(res){
        routeCodes=res;
    });
}
//加载用户分类字典表
function loadDrugs(){
    dao.queryDrugsRoute('dic_drugs_category',function(res){
        drugsCategory=res;
    });
}
//加载单位字典表
function loadUnit(){
    dao.queryDrugsRoute('dic_unit',function(res){
        unit=res;
    });
}
//加载耗材字典表
function loadConsumable(){
    dao.queryDrugsRoute('dic_consumables',function(res){
        consumable=res;
    });
}
//加载耗材字典表
function loadShedulType(){
    consumDao.queryShedulType(null,function(res){
        shedulType=res;
    });
}
exports.loadConsumable=loadConsumable;
