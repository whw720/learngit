var db=require("../../db"),
    page = require('../../lib/page'),
    uuid = require('uuid');

exports.loginWeb=function(params,callback){
	var sql="select  * from student s where name=? and password=?";

    if(params.phone!=null&&params.phone!=''){
        sql+=" and s.phone='"+params.phone+"'";
    }
	db.query(sql,[params.username,params.password],callback);
}
exports.loginAdmin=function(params,callback){
    var sql="select  * from user s where username=? and password=?";
    db.query(sql,[params.username,params.password],callback);
}
exports.queryStudentInfo=function(id,callback){
    var sql="select  * from student s where id=?";
    db.query(sql,[id],callback);
}
exports.queryStudentEqualOther=function(params,callback){
    var sql="select  * from student s where name=? and phone=? and id<>?";
    db.query(sql,[params.name,params.phone,params.id],callback);
}
exports.resetStudentpassword=function(id,callback){
    var sql="update student s set s.password='000000' where id=?";
    db.query(sql,[id],callback);
}
exports.queryStudent=function(params,callback){
	var sql="select  * from student s where 1=1 ";
	if(params.name!=null&&params.name!=''){
		sql+=" and s.name like '%"+params.name+"%'";
	}
	if(params.phone!=null&&params.phone!=''){
		sql+=" and s.phone like '%"+params.phone+"%'";
	}
	if(params.school!=null&&params.school!=''){
		sql+=" and s.school like '%"+params.school+"%'";
	}
	if(params.applytime!=null&&params.applytime!=''){
		sql+=" and s.applytime >= '"+params.applytime+"'";
	}
	db.query(sql,callback);
}

exports.queryAllstudent=function(params,callback){
    var sql="select  * from student s where 1=1 ";
    if(params.name!=null&&params.name!=''){
        sql+=" and s.name like '%"+params.name+"%'";
    }
    if(params.phone!=null&&params.phone!=''){
        sql+=" and s.phone like '%"+params.phone+"%'";
    }
    if(params.school!=null&&params.school!=''){
        sql+=" and s.school like '%"+params.school+"%'";
    }
    if(params.compet!=null&&params.compet!=''){
        sql+=" and s.compet ='"+params.compet+"'";
    }
    if(params.starttime!=null&&params.starttime!=''){
        sql+=" and s.applytime >= '"+params.starttime+"'";
    }
    if(params.endtime!=null&&params.endtime!=''){
        sql+=" and s.applytime <= '"+params.endtime.substring(0, 10)+" 23:59:59'";
    }
    var sqlcount='select count(*) all_count from ('+sql+') s';
    sql+=" order by s.applytime desc";
    sql+=" limit "+params.start+","+params.limit;
    db.query(sqlcount,function(all){
        db.query(sql,function(result){
            callback(page.getDatePage(params.start, params.limit, all[0].all_count, result));
        });
    })
}
exports.queryLoginLog=function(params,callback){
    var sql="select s.*,l.MEMO,l.OPERTIME from loginLog l " +
        "inner join student s on s.id=l.userid where 1=1";
    if(params.starttime!=null&&params.starttime!=''){
        sql+=" and l.OPERTIME >= '"+params.starttime+"'";
    }
    if(params.endtime!=null&&params.endtime!=''){
        sql+=" and l.OPERTIME <= '"+params.endtime.substring(0, 10)+" 23:59:59'";
    }
    if(params.name!=null&&params.name!=''){
        sql+=" and s.name like '%"+params.name+"%'";
    }
    if(params.phone!=null&&params.phone!=''){
        sql+=" and s.phone like '%"+params.phone+"%'";
    }
    if(params.school!=null&&params.school!=''){
        sql+=" and s.school like '%"+params.school+"%'";
    }
    if(params.grade!=null&&params.grade!=''){
        sql+=" and s.grade like '%"+params.grade+"%'";
    }
    var sqlcount='select count(*) all_count from ('+sql+') s';
    sql+=" order by l.OPERTIME desc";
    sql+=" limit "+params.start+","+params.limit;
    db.query(sqlcount,function(all){
        db.query(sql,function(result){
            callback(page.getDatePage(params.start, params.limit, all[0].all_count, result));
        });
    })

}
exports.insertStudent=function(params,callback){
	var sql="insert into student(id,name,password,gender,grade,SCHOOL,PHONE,APPLYTIME,COMPET)"+
	" values(?,?,?,?,?,?,?,?,?)";
	db.query(sql,[generate(),params.name,params.password,params.gender,params.grade,params.school,params.phone,new Date(),params.compet],callback);
}
exports.insertLoginLog=function(params){
    var sql="insert into loginLog values(?,?,now(),?)";
    db.query(sql,[params.id,params.oper,params.memo],function(){});
}
exports.updateStudentInfo=function(params,callback){
    var sql="UPDATE student SET ? WHERE id=?";
    var consent = [{
        name: params.name,
        gender: params.gender,
        phone: params.phone,
        grade:params.grade,
        school:params.school,
        compet:params.compet
    },
        params.id
    ];
    db.query(sql,consent,callback);
}
exports.updatePassword=function(params,callback){
    var querysql="select * from student where id=? and password=?";
    var sql="UPDATE student SET ? WHERE id=?";
    db.query(querysql,[params.id,params.oldpassword],function(result){
        if(result.length>0){
            var consent = [{
                password: params.password
            },
                params.id
            ];
            db.query(sql,consent,function(ddd){
                callback({update:true})
            });
        }else{
            callback({update:false})
        }
    });

}
exports.updateStudent=function(paramsList,callback){
	db.trans(function(trans) {
        for(var i=0;i<paramsList.length;i++){
            var params=paramsList[i];
            var scoreObj={updatetime:new Date()};
            if(params.score1){
                scoreObj.SCORE1=params.score1;
            }
            if(params.score2){
                scoreObj.SCORE2=params.score2;
            }
            if(params.score3){
                scoreObj.SCORE3=params.score3;
            }
            var consent = [scoreObj,
                params.name,
                params.phone
            ];
            try{
                trans.queryd('UPDATE student SET ? WHERE name=? and phone=?', consent);
                var insertContent=[
                    params.name,
                    params.grade,
                    params.school,
                    params.phone,
                    params.score1?params.score1:null,
                    params.score2?params.score2:null,
                    params.score3?params.score3:null,
                    params.name,
                    params.phone
                ]
                var sql="INSERT INTO student(id,NAME,PASSWORD,gender,grade,school,phone,compet,applytime,score1,score2,score3) "+
                    " SELECT REPLACE(UUID(),'-',''),?,'000000',1,?,?,?,1,now(),?,?,? FROM USER u WHERE"+
                    " NOT EXISTS(SELECT 1 FROM student s WHERE s.name=? AND s.phone=?) LIMIT 1";
                trans.queryd(sql,insertContent);
            }catch(e){
                console.log(e);
            }

        }



		trans.commit(function() {
			trans.conn.release();
			callback();
		});
	});
}
exports.insertUploadRecord=function(params,callback){
    var sql="insert into uploadLog(filename,filepath,oldname,uploadTime) values(?,?,?,?)";
    db.query(sql,[params.filename,params.filepath,params.oldname,new Date()],callback)
}


function generate() {
	return uuid.v1().replace(/-/g, '');
}