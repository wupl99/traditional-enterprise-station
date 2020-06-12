var express = require('express');//node的一个框架
var bodyParser = require('body-parser');//express的插件，数据整理
var http = require('http');//http对象，node内置对象
var path = require('path');//路径对象，node内置对象
var fs = require('fs');//内置对象
var mysql = require('mysql');//引入mysql
var moment = require('moment');//修改时间格式
var multipart = require('connect-multiparty');//文件上传插件

var app = express();

//建立静态资源访问
app.use(express.static(path.join(__dirname,'src')));

app.use(bodyParser.json());//使用此插件
app.use(bodyParser.urlencoded({extended: true}));

var hostname = 'http://localhost:8089';

var pool = mysql.createPool({//创建链接MySQL的连接池
  host: 'localhost',
  user: 'root',
  password: 'wupl110800',
  port: 3306,
  database: 'qyz'
});

function mysqlQuery(sql,callback){
  pool.getConnection((err,connection)=>{
    if(err){
      console.log(`数据库错误${err}`);
    }
    else{
      connection.query(sql,(err,result)=>{
        connection.release();//释放连接
        if(typeof callback == 'function'){
          callback(result);
        }
      });
    }
  });
}

/*mysqlQuery('select * from qyz_news',(result)=>{
  // console.log(result);
});*/

app.post('/post/news/add',(req,res) =>{
  var title = req.body.title;
  var content = req.body.content;
  var createDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');//format转换
  //console.log(title,content,createDate);
  mysqlQuery(`insert into qyz_news (title,content,createDate) value ("${title.replace(/\"/g,"\\\"")}","${content.replace(/\"/g,"\\\"")}","${createDate}")`,(result)=>{
    console.log(result);
    if(result){
      res.json({ code: 0, msg: 'success', data: true });
    }
    else{
      res.json({ code: -1, msg: 'failed', data: false });
    }
  });
});

app.delete('/delete/news',(req,res) =>{
  var id = req.query.id;
  mysqlQuery(`delete from qyz_news where id=${id}`,(result)=>{
    if(result){
      res.json({ code: 0, msg: 'success', data: true });
    }
    else{
      res.json({ code: -1, msg: 'failed', data: false });
    }
  })
});

app.put('/put/news',(req,res) =>{  
  var id = req.body.id;
  var title = req.body.title;
  var content = req.body.content;
  var createDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  mysqlQuery(`update qyz_news set title="${title.replace(/\"/g,"\\\"")}",content="${content.replace(/\"/g,"\\\"")}",createDate="${createDate}" where id=${id}`,(result)=>{
    //console.log(result);
    if(result){
      res.json({ code: 0, msg: 'success', data: true });
    }
    else{
      res.json({ code: -1, msg: 'failed', data: false });
    }
  });
});

/*上传图片接口*/
var multipartMiddleware = multipart();
app.put('/put/news/img',multipartMiddleware,(req,res) =>{  
  var id = req.body.id;
  var frontPath = req.files.file.path;//前端文件地址
  var newPath = path.resolve(__dirname,'./src/upload',req.files.file.originalFilename);
  fs.readFile(frontPath,function(err,data){
    if(err){
      res.json({ code: -1, msg: 'failed', data: false
        });
      return;
    };
    console.log('File read!');
    fs.writeFile(newPath,data,function(err){
      if(err){
        res.json({ code: -1, msg: 'failed', data: false
        });
      }
      else{
        mysqlQuery(`update qyz_news set imgUrl="${'/upload/'+req.files.file.originalFilename}" where id=${id}`,(result)=>{
          if(result){
            res.json({ code: 0, msg: 'success', data: true });
          }
          else{
            res.json({ code: -1, msg: 'failed', data: false });
          }
        });
      }
    });
    /*删除临时文件*/
    fs.unlink(frontPath,function(err){
      if(err) throw err;
      console.log('File deleted!');
    });
  });
});

app.get('/get/news',function(require,response){
  //console.log(typeof require.query,require.query);
  var page = require.query.page;
  /*select * from  表名 limit 跳过的数据,取几条*/
  mysqlQuery(`select * from qyz_news limit ${(page-1)*10},10`,(result)=>{
    if(result){
      var data = result.map(item => {
        return {
          id: item.id,
          title: item.title,
          createDate: item.createDate.getTime(),
          imgUrl: item.imgUrl == null ? null : hostname+item.imgUrl,
        }
      });

      mysqlQuery(`select id from qyz_news`,(idArr)=>{
        if(idArr){
          var total = idArr.length;
          response.json({
            code: 0,//错误码
            msg: 'success',//错误消息
            total,//数据总量
            page,//当前页,
            pageNum: 10,//每页是10个
            data,
          });
        }
        else{
          response.json({ code: -1, msg: 'failed', data: [] });
        }
      });   
    }
    else{
      response.json({ code: -1, msg: 'failed', data: [] });
    }  
  });
});

app.get('/get/img/news',function(require,response){
  mysqlQuery(`select * from qyz_news`,(result)=>{
    if(result){
      var data = result.map(item => {
        return {
          id: item.id,
          title: item.title,
          createDate: item.createDate.getTime(),
          imgUrl: item.imgUrl == null ? null : hostname+item.imgUrl,
        };
      });
      mysqlQuery(`select id from qyz_news`,(idArr)=>{
        if(idArr){
          response.json({
            code: 0,//错误码
            msg: 'success',//错误消息
            data,
          });
        }
        else{
          response.json({ code: -1, msg: 'failed', data: [] });
        }
      });
    }
    else{
      response.json({ code: -1, msg: 'failed', data: {} });
    }
  });
});

/*获取新闻详情*/
app.get('/get/news/detail',function(require,response){
  //console.log(typeof require.query,require.query);
  var id = require.query.id;
  mysqlQuery(`select * from qyz_news where id=${id}`,(result)=>{    
    if(result){
      var data = result.map(item => {
        return {
          id: item.id,
          title: item.title,
          content: item.content,
          createDate: item.createDate.getTime(),
          imgUrl: item.imgUrl == null ? null : hostname+item.imgUrl,
        }
      })[0];
      response.json({
        code: 0,//错误码
        msg: 'success',//错误消息
        data,
      });
    }
    else{
      response.json({ code: -1, msg: 'failed', data: null });
    }    
  });
});

/*后台公司产品*/
app.get('/get/product',function(require,response){
  //console.log(typeof require.query,require.query);
  var page = require.query.page;
  /*select * from  表名 limit 跳过的数据,取几条*/
  mysqlQuery(`select * from qyz_product limit ${(page-1)*8},8`,(result)=>{
    if(result){
      var data = result.map(item => {
        return {
          id: item.id,
          title: item.title,
          content: item.content,
          createDate: item.createDate.getTime(),
          imgUrl: item.imgUrl == null ? null : hostname+item.imgUrl,
        }
      });

      mysqlQuery(`select id from qyz_product`,(idArr)=>{
        if(idArr){
          var total = idArr.length;
          response.json({
            code: 0,//错误码
            msg: 'success',//错误消息
            total,//数据总量
            page,//当前页,
            pageNum: 8,//每页是8个
            data,
          });
        }
        else{
          response.json({ code: -1, msg: 'failed', data: [] });
        }
      });   
    }
    else{
      response.json({ code: -1, msg: 'failed', data: [] });
    }  
  });
});

app.get('/get/img/product',function(require,response){
  mysqlQuery(`select * from qyz_product`,(result)=>{
    if(result){
      var data = result.map(item => {
        return {
          id: item.id,
          title: item.title,
          content: item.content,
          createDate: item.createDate.getTime(),
          imgUrl: item.imgUrl == null ? null : hostname+item.imgUrl,
        }
      });
      mysqlQuery(`select id from qyz_product`,(idArr)=>{
        if(idArr){
          response.json({
            code: 0,//错误码
            msg: 'success',//错误消息
            data,
          });
        }
        else{
          response.json({ code: -1, msg: 'failed', data: [] });
        }
      });      
    }
    else{
      response.json({ code: -1, msg: 'failed', data: {} });
    }
  });
});

/*获取产品详情*/
app.get('/get/product/detail',function(require,response){
  //console.log(typeof require.query,require.query);
  var id = require.query.id;
  mysqlQuery(`select * from qyz_product where id=${id}`,(result)=>{    
    if(result){
      var data = result.map(item => {
        return {
          id: item.id,
          title: item.title,
          content: item.content,
          createDate: item.createDate.getTime(),
          imgUrl: item.imgUrl == null ? null : hostname+item.imgUrl,
        }
      })[0];
      response.json({
        code: 0,//错误码
        msg: 'success',//错误消息
        data,
      });
    }
    else{
      response.json({ code: -1, msg: 'failed', data: null });
    }    
  });
});

app.post('/post/product/add',(req,res) =>{
  var title = req.body.title;
  var content = req.body.content;
  var createDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');//format转换
  //console.log(title,content,createDate);
  mysqlQuery(`insert into qyz_product (title,content,createDate) value ("${title.replace(/\"/g,"\\\"")}","${content.replace(/\"/g,"\\\"")}","${createDate}")`,(result)=>{
    console.log(result);
    if(result){
      res.json({ code: 0, msg: 'success', data: true });
    }
    else{
      res.json({ code: -1, msg: 'failed', data: false });
    }
  });
});

app.delete('/delete/product',(req,res) =>{
  var id = req.query.id;
  mysqlQuery(`delete from qyz_product where id=${id}`,(result)=>{
    if(result){
      res.json({ code: 0, msg: 'success', data: true });
    }
    else{
      res.json({ code: -1, msg: 'failed', data: false });
    }
  })
});

app.put('/put/product',(req,res) =>{  
  var id = req.body.id;
  var title = req.body.title;
  var content = req.body.content;
  var createDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  mysqlQuery(`update qyz_product set title="${title.replace(/\"/g,"\\\"")}",content="${content.replace(/\"/g,"\\\"")}",createDate="${createDate}" where id=${id}`,(result)=>{
    //console.log(result);
    if(result){
      res.json({ code: 0, msg: 'success', data: true });
    }
    else{
      res.json({ code: -1, msg: 'failed', data: false });
    }
  });
});

/*上传图片接口*/
var multipartMiddleware = multipart();
app.put('/put/product/img',multipartMiddleware,(req,res) =>{  
  var id = req.body.id;
  var frontPath = req.files.file.path;//前端文件地址
  var newPath = path.resolve(__dirname,'./src/upload',req.files.file.originalFilename);
  fs.readFile(frontPath,function(err,data){
    if(err){
      res.json({ code: -1, msg: 'failed', data: false
        });
      return;
    };
    fs.writeFile(newPath,data,function(err){
      if(err){
        res.json({ code: -1, msg: 'failed', data: false
        });
      }
      else{
        mysqlQuery(`update qyz_product set imgUrl="${'/upload/'+req.files.file.originalFilename}" where id=${id}`,(result)=>{
          if(result){
            res.json({ code: 0, msg: 'success', data: true });
          }
          else{
            res.json({ code: -1, msg: 'failed', data: false });
          }
        });
      }
    });
    /*删除临时文件*/
    fs.unlink(frontPath,function(err){
      if(err) throw err;
    });
  });
});

/*后台联系我们*/
/*获取联系地址*/
app.get('/get/contact',function(require,response){
  mysqlQuery(`select * from qyz_contact where id=1`,(result)=>{
    if(result){
      var data = result.map(item => {
        return {
          imgUrl: hostname+item.imgUrl,
          address: item.address,
          officeTel: item.officeTel,
          contactTel: item.contactTel,
          postcode: item.postcode,
          email: item.email,
        };
      })[0];
      response.json({
        code: 0,//错误码
        msg: 'success',//错误消息
        data,
      });
    }
    else{
      response.json({ code: -1, msg: 'failed', data: {} });
    }
  });
});

app.put('/put/contact',multipartMiddleware,(req,res) =>{  
  var address = req.body.address;
  var officeTel = req.body.officeTel;
  var contactTel = req.body.contactTel;
  var postcode = req.body.postcode;
  var email = req.body.email;
  var frontPath = req.files.file.path;//从后端拿到的临时地址
  var newPath = path.resolve(__dirname,'./src/upload',req.files.file.originalFilename);
  fs.readFile(frontPath, function (err, data) {
      if (err){
        res.json({ code: -1, msg: 'failed', data: false });
        return;
      };
      //console.log('File read!');
      // Write the file-写入后台的地址
      fs.writeFile(newPath, data, function (err) {//data是buffer缓冲区二进制数据
          if (err){
            res.json({ code: -1, msg: 'failed', data: false });
          }
          else{
            mysqlQuery(`update qyz_contact set imgUrl="${'/upload/'+req.files.file.originalFilename}",address="${address.replace(/\"/g,"\\\"")}",officeTel="${officeTel}",contactTel="${contactTel}",postcode="${postcode}",email="${email}" where id=1`,(result,err)=>{
              console.log(result,err);
              if(result){
                res.json({ code: 0, msg: 'success', data: true });//给前端响应信息
              }
              else{
                res.json({ code: -1, msg: 'failed', data: false });//给前端响应信息
              }
            });
          }
      });
      // Delete the file临时文件地址
      fs.unlink(frontPath, function (err) {
          if (err) throw err;
          //console.log('File deleted!');
      });
  });
});

/*后台公司简介*/
app.get('/get/profile',function(require,response){
  mysqlQuery(`select * from qyz_profile where id=1`,(result)=>{
    if(result){
      var data = result.map(item => {
        return {
          imgUrl: hostname+item.imgUrl,
          title: item.title,
          description: item.description,
          content: item.content,
          createDate: item.createDate.getTime(),
        };
      })[0];
      response.json({
        code: 0,//错误码
        msg: 'success',//错误消息
        data,
      });
    }
    else{
      response.json({ code: -1, msg: 'failed', data: {} });
    }
  });
});

app.put('/put/profile',multipartMiddleware,(req,res) =>{  
  var title = req.body.title;
  var description = req.body.description;
  var content = req.body.content;
  var createDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  var frontPath = req.files.file.path;//从后端拿到的临时地址
  var newPath = path.resolve(__dirname,'./src/upload',req.files.file.originalFilename);
  fs.readFile(frontPath, function (err, data) {
      if (err){
        res.json({ code: -1, msg: 'failed', data: false });
        return;
      };
      //console.log('File read!');
      // Write the file-写入后台的地址
      fs.writeFile(newPath, data, function (err) {//data是buffer缓冲区二进制数据
          if (err){
            res.json({ code: -1, msg: 'failed', data: false });
          }
          else{
            mysqlQuery(`update qyz_profile set imgUrl="${'/upload/'+req.files.file.originalFilename}",title="${title.replace(/\"/g,"\\\"")}",description="${description.replace(/\"/g,"\\\"")}",content="${content.replace(/\"/g,"\\\"")}",createDate="${createDate}" where id=1`,(result,err)=>{
              console.log(result,err);
              if(result){
                res.json({ code: 0, msg: 'success', data: true });//给前端响应信息
              }
              else{
                res.json({ code: -1, msg: 'failed', data: false });//给前端响应信息
              }
            });
          }
      });
      // Delete the file临时文件地址
      fs.unlink(frontPath, function (err) {
          if (err) throw err;
          //console.log('File deleted!');
      });
  });
});


/*app.get('/get/index/introduce',function(require,response){
  //console.log(typeof require.query,require.query);
  response.json({
    code: 0,//错误码
    msg: 'success',//错误消息
    data: {
      imgUrl: 'http://localhost:8089/upload/intr.jpg',
      description: '大余县xxxxxx公司城里于2002年9月，大余县xxxxxx公司城里于2002年9月，大余县xxxxxx公司城里于2002年9月，大余县xxxxxx公司城里于2002年9月，大余县xxxxxx公司城里于2002年9月，大余县xxxxxx公司城里于2002年9月，大余县xxxxxx公司城里于2002年9月，大余县xxxxxx公司城里于2002年9月，大余县xxxxxx公司城里于2002年9月大余县xxxxxx公司城里于2002年9月，大余县xxxxxx公司城里于2002年9月，大余县xxxxxx公司城里于2002年9月'
    },
  });
});

app.get('/get/index/product',function(require,response){
  //console.log(typeof require.query,require.query);
  response.json({
    code: 0,//错误码
    msg: 'success',//错误消息
    data: [
      { id: 1, title: '产品电器F0000001', createDate: 1583547371000, imgUrl: 'http://localhost:8089/upload/1.jpg'},
      { id: 2, title: '产品电器F0000002', createDate: 1583547371000, imgUrl: 'http://localhost:8089/upload/1.jpg'},
      { id: 3, title: '产品电器F0000002', createDate: 1583547371000, imgUrl: 'http://localhost:8089/upload/1.jpg'},
      { id: 4, title: '产品电器F0000002', createDate: 1583547371000, imgUrl: 'http://localhost:8089/upload/1.jpg'},
      { id: 5, title: '产品电器F0000002', createDate: 1583547371000, imgUrl: 'http://localhost:8089/upload/1.jpg'},
    ],
  });
});

app.get('/get/index/img/news',function(require,response){
  //console.log(typeof require.query,require.query);
  response.json({
    code: 0,//错误码
    msg: 'success',//错误消息
    data: [
      { id: 1, createDate: 1583547371000, imgUrl: 'http://localhost:8089/upload/1.jpg', title: 'news1'},
      { id: 2, createDate: 1583547371000, imgUrl: 'http://localhost:8089/upload/intr.jpg', title: 'news2'},
      { id: 3, createDate: 1583547371000, imgUrl: 'http://localhost:8089/upload/map.jpg', title: 'news3'},
    ],
  });
});

app.get('/get/index/news',function(require,response){
  //console.log(typeof require.query,require.query);
  response.json({
    code: 0,//错误码
    msg: 'success',//错误消息
    data: [
      { id: 1, createDate: 1583547371000, title: '的说法撒旦发射撒旦撒旦飒沓1'},
      { id: 2, createDate: 1583547371000, title: '的说法撒旦发射撒旦撒旦飒沓2'},
      { id: 3, createDate: 1583547371000, title: '的说法撒旦发射撒旦撒旦飒沓3'},
      { id: 4, createDate: 1583547371000, title: '的说法撒旦发射撒旦撒旦飒沓4'},
      { id: 5, createDate: 1583547371000, title: '的说法撒旦发射撒旦撒旦飒沓5'},
      { id: 6, createDate: 1583547371000, title: '的说法撒旦发射撒旦撒旦飒沓6'},
    ],
  });
});
*/


http.createServer(app).listen(8089,function(){
  console.log('8089启动成功');
});
