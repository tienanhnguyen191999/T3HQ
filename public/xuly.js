//var socket = io('http://localhost:3000');
var socket = io('https://t3hq.herokuapp.com/');


socket.on('server-send-fail',function(){
    alert('wrong!');
});

socket.on('server-send-success-own',function(data){
    //setcooke to remember login
    $.cookie('name',data,{expires:1/24 }); // 1 hour Time-life
    $('#name').html('Welcome ' + data);
    $('#login').hide(1000);
    $('#main').show(2000);
});
socket.on('server-send-user',function(data){
    $('#list').html('');
    data.forEach(element => {
        $('#list').append('<div class="member">'+element +'</div>');
    });
    $('#total').html('('+data.length+')');
});

socket.on('server-send-logout',function(){
    $('#login').show();
    $('#main').hide();
});

socket.on('server-send-chat-history',function(data){
    $('#content').html('');
    data.forEach(value => {
        $('#content').append("<div class='txt'>"+ value +"</div>");
    });
})

socket.on('server-send-message',function(data){
    $('#content').html('');
    data.forEach(value => {
        $('#content').append("<div class='txt'>"+ value +"</div>");
    });
});
$(document).ready(function(){
    if(!$.cookie('name')){
        $('#login').show();
        $('#main').hide();
    }
    else{ // if press F5
        $('#login').hide();
        $('#main').show();
        socket.emit('client-send-credential',$.cookie('name'));
    }
    $('#btnCredential').click(function(){
        socket.emit('client-send-credential',$('#credential').val());
    });

    $('#btnMessage').click(function(){
        socket.emit('client-send-message',$('#message').val());
    });

    $('#btnlogout').click(function(){
        $.removeCookie("name");
        socket.emit('client-send-logout');
    });
});