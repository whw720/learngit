var loginDao=require("../models/login/login-dao"),
	fs=require('fs'),
    uploadDir="../public/upload/",
    xlsx = require('node-xlsx');
/**
* 登录页面
*/
exports.login=function(req,res){
	loginDao.loginWeb(req.body,function(result){
        if(result.length>0){
            if(result.length==1){
                loginDao.insertLoginLog({id:result[0].ID,oper:'login',memo:'登录操作'});
                setUserinfoSession(req,result[0]);
                res.sendResult({
                    title: '阳光优乐杯报名系统',
                    userInfo:req.session.userInfo,
                    webRoot:req.session.baseUrl,
                    login:true,
                    repeat:false
                });
            }else{
                res.sendResult({
                    title: '阳光优乐杯报名系统',
                    userInfo:req.session.userInfo,
                    webRoot:req.session.baseUrl,
                    login:true,
                    repeat:true
                });
            }

        }else{
            res.sendResult({
                title: '阳光优乐杯报名系统',
                webRoot:req.session.baseUrl,
                login:false
            });
        }
    });
}
exports.loginadmin=function(req,res){
    loginDao.loginAdmin(req.body,function(result){
        if(result.length>0){
            req.session.adminInfo=JSON.stringify(result[0]);
            res.sendResult({
                title: '阳光优乐杯报名系统',
                webRoot:req.session.baseUrl,
                adminInfo:req.session.adminInfo,
                login:true
            });
        }else{
            res.sendResult({
                title: '阳光优乐杯报名系统',
                webRoot:req.session.baseUrl,
                login:false
            });
        }
    });
}
exports.loginother=function(req,res){
    loginDao.queryStudent(req.body,function(result){
        if(result.length>0){
            loginDao.resetStudentpassword(result[0].ID,function(dd){
                res.sendResult({
                    title: '阳光优乐杯报名系统',
                    webRoot:req.session.baseUrl,
                    login:true
                });
            });
        }else{
            res.sendResult({
                title: '阳光优乐杯报名系统',
                webRoot:req.session.baseUrl,
                login:false
            });
        }
    });
}
function setUserinfoSession(req,data){
    var params={
        id:data.ID,
        name:data.NAME,
        password:data.PASSWORD,
        gender:data.GENDER,
        grade:data.GRADE,
        school:data.SCHOOL,
        phone:data.PHONE,
        compet:data.COMPET,
        score1:data.SCORE1,
        score2:data.SCORE2,
        score3:data.SCORE3
    };
    req.session.userInfo=JSON.stringify(params);
}

exports.insertStudent=function(req,res){
    var params={
        name:req.body.name,
        phone:req.body.phone
    };
    loginDao.queryStudent(params,function(result){
        if(result.length>0){
            res.sendResult({
                sign:false
            });
        }else{
            loginDao.insertStudent(req.body,function(resultss){
                loginDao.queryStudent(params,function(result){
                    if(result.length>0){
                        loginDao.insertLoginLog({id:result[0].ID,oper:'sign',memo:'报名操作'});
                        setUserinfoSession(req,result[0]);
                    }
                    res.sendResult({
                        sign:true
                    });
                });
            });
        }
    });

}
//登出
exports.logout = function(req, res) {
    req.session.destroy();
    var baseUrl=req.protocol + '://' + req.get('Host');
    if(req.query.admin){
        res.render('loginadmin', {
            title: '阳光优乐杯报名系统',
            webRoot:baseUrl
        });
    }else{
        res.render('login', {
            title: '阳光优乐杯报名系统',
            webRoot:baseUrl
        });
    }

}
exports.queryscore=function(req,res){
    var userInfo=JSON.parse(req.session.userInfo);
    var params={name:userInfo.name,phone:userInfo.phone};
    loginDao.queryStudent(params,function(result){
        res.sendResult(result);
    });
}
exports.queryloginlog=function(req,res){
    loginDao.queryLoginLog(req.body,function(result){
        res.sendPageResult(result);
    });
}
exports.querystudent=function(req,res){
    loginDao.queryAllstudent(req.body,function(result){
        res.sendPageResult(result);
    });
}
exports.updateStudent=function(req,res){
	loginDao.updateStudent(req.body,function(result){
        res.sendResult(result);
    });
}
exports.updateStudentInfo=function(req,res){
    var params={
        name:req.body.name,
        phone:req.body.phone,
        id:req.body.id
    };
    loginDao.queryStudentEqualOther(params,function(result){
        if(result.length>0){
            res.sendResult({
                update:false
            })
        }else{
            loginDao.updateStudentInfo(req.body,function(resultss){
                loginDao.queryStudentInfo(req.body.id,function(result){
                    if(result.length>0){
                        setUserinfoSession(req,result[0]);
                    }
                    res.sendResult({update:true});
                });
            });
        }
    });
}

exports.updatePassword=function(req,res){
    loginDao.updatePassword(req.body,function(resultss){
        res.sendResult(resultss);
    });
}
exports.uploadFile=function(req,res){
	var oldname=req.files.document.name;
    var type=req.files.document.type;
    var path=req.files.document.path;
    var extName=oldname.substr(oldname.lastIndexOf('.'));
    var fileName=oldname.substring(0,oldname.lastIndexOf('.'));
    var avatarName =fileName+ Math.random()  + extName;
    var newPath = uploadDir + avatarName;


    fs.renameSync(path, newPath);  //重命名
    insertUploadRecord({filename:avatarName,filepath:newPath,oldname:oldname});
    parseExcel(newPath);
    res.render('admin', {
        title: '阳光优乐杯报名系统'
    });
}
exports.downloadExcel=function(req,res){
    buildExcel(function(path,filename){
        var pdf = fs.createReadStream(path);

        res.writeHead(200, {
            'Content-Type': 'application/force-download',
            'Content-Disposition': 'attachment; filename='+filename
        });

        pdf.pipe(res);
    });
}
function buildExcel(callback){
    loginDao.queryStudent({},function(result){
        var obj= [
                [ '序号', '学生姓名', '年级', '在读学校', '联系方式', '分数1', '分数2', '分数3']
            ]
        if(result.length>0){
            for(var i=0;i<result.length;i++){
                var re=result[i];
                var tmp=[ (i+1), re.NAME, re.GRADE, re.SCHOOL, re.PHONE, re.SCORE1, re.SCORE2, re.SCORE3 ];
                obj.push(tmp);
            }
        }
        var file = xlsx.build([{name: "学生信息", data: obj}]);
        var filename=(new Date().Format('yyyyMMdd'))+'-'+ Math.round(Math.random()*10000)+'-'+'student.xlsx';
        var downPath=uploadDir+filename;
        fs.writeFileSync(downPath, file, 'binary');
        callback(downPath,filename);
    });

}
/**
 * 解析EXCEL
 * @param path
 */
function parseExcel(path){
    var obj = xlsx.parse(path);
    //行数
    var maxRow = obj[0].data.length;
    var resultList=[];
    for(var i=0;i<maxRow;i++) {
        var row=obj[0].data[i];
        if(i>0&&row.length>0&&row[1]){
            if(typeof row[1] =='string'){
                var stu={name:row[1],grade:row[2],school:row[3],phone:row[4]};
                if(row[5]){
                    stu.score1=row[5];
                }
                if(row[6]){
                    stu.score2=row[6];
                }
                if(row[7]){
                    stu.score3=row[7];
                }
                resultList.push(stu);
            }
        }
    }
    loginDao.updateStudent(resultList,function(result){

    });
}
function insertUploadRecord(params){
    loginDao.insertUploadRecord(params,function(result){
    });
}