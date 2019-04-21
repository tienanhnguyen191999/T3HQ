var express = require('express');
var app = express();
var server = require('http').Server(app);
server.listen(process.env.PORT || 3000);

app.use(express.static('./public'));
app.set('view engine','ejs');
app.set('views','./views');

var io = require('socket.io')(server);
var mang_root = ['TIEN','TRIEU','TOAN','HIEN','QUAN']; // Account
var message = [];  
var mang_now = []; // user now
var typing = [];
io.on('connection',function(socket){
    socket.emit('server-send-chat-history',message);
    console.log(socket.id + " online");
    
    socket.on('disconnect',function(){
        mang_now.splice(mang_now.indexOf(socket.name),1);
        io.sockets.emit('server-send-user',mang_now);
    });

    socket.on('client-send-credential',function(data){
        if (mang_root.indexOf(data.toUpperCase()) >= 0){
            //Cookie.set('name',data);
            mang_now.push(data.toUpperCase());
            socket.name = data.toUpperCase();
            socket.emit('server-send-success-own',data.toUpperCase());
            io.sockets.emit('server-send-user',mang_now);
        }
        else{
            socket.emit('server-send-fail');
        }
    });


    socket.on('client-send-message',function(data){
        tmp = socket.name + ": " + data;
        message.push(tmp);
        io.sockets.emit('server-send-message',message);
        socket.broadcast.emit('server-send-typing',typing);
    });

    socket.on('client-send-logout',function(){
        mang_now.splice(mang_now.indexOf(socket.name),1);
        socket.emit('server-send-logout');
        io.sockets.emit('server-send-user',mang_now);
    });

    socket.on('client-send-loading',function(){
        tmp = socket.name + ': <img src="comment-loading.gif" style="width:30px;height:30px;position:relative;top:7px;"> ';
        socket.typing = tmp;
        typing.push(tmp);
        socket.broadcast.emit('server-send-typing',typing);
    });

    socket.on('client-send-end-loading',function(){
        typing.splice(typing.indexOf(socket.typing));
        io.sockets.emit('server-send-message',message);
        socket.broadcast.emit('server-send-typing',typing);
    })
});





app.get('/',function(   req,res){
    res.render('index');
    
});