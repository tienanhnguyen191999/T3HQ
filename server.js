var express = require('express');
var app = express();
var server = require('http').Server(app);
server.listen(3000);

app.use(express.static('./public'));
app.set('view engine','ejs');
app.set('views','./views');

var io = require('socket.io')(server);
var mang_root = ['tien','trieu','toan','hien','quan']; // Account
var message = [];
var mang_now = [];

io.on('connection',function(socket){
    socket.emit('server-send-chat-history',message);
    console.log(socket.id + " online");
    
    socket.on('disconnect',function(){
        mang_now.splice(mang_now.indexOf(socket.name),1);
        io.sockets.emit('server-send-user',mang_now);
    });

    socket.on('client-send-credential',function(data){
        if (mang_root.indexOf(data) >= 0){
            //Cookie.set('name',data);
            mang_now.push(data);
            socket.name = data;
            socket.emit('server-send-success-own',data);
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
    });

    socket.on('client-send-logout',function(){
        mang_now.splice(mang_now.indexOf(socket.name),1);
        socket.emit('server-send-logout');
        io.sockets.emit('server-send-user',mang_now);
    });
});





app.get('/',function(req,res){
    res.render('index');
    
});