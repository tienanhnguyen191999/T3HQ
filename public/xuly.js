//var socket = io('http://localhost:3000');
var socket = io('https://t3hq.herokuapp.com/');
var user_now;

socket.on('server-send-fail',function(){
    alert('wrong!');
});

socket.on('server-send-success-own',function(data){
    //setcooke to remember login
    $.cookie('name',data,{expires:1/24 }); // 1 hour Time-life
    user_now = $.cookie('name');
    $('#name').html('Welcome ' + data);
    $('#login').hide(1000);
    $('#main').show(2000);
});
socket.on('server-send-user',function(data){
    $('#list').html('');
    //alert(data.mang);
    data.forEach(element => {
        if (element != user_now){
            $('#list').append('<div class="member">'+ element +'</div>');
        }
        else{
            $('#list').append('<div class="member" style="color:red">'+ element +'</div>');
        }
    });
    $('#total').html('('+data.length+')');
});

socket.on('server-send-logout',function(){
    $('#login').show();
    $('#main').hide();
});

socket.on('server-send-loading',function(data){
    $('#content').html('');
    data.message.forEach(value => {
        $('#content').append("<div class='txt'>"+ value +"</div>");
    });

    data.typing.forEach(value => {
        $('#content').append("<div class='txt'>"+ value +"</div>");
    });
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

socket.on('server-send-typing',function(data){
    data.forEach(value => {
        $('#content').append("<div class='txt'>"+ value +"</div>");
    });
})
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

    $('#credential').keypress(function (e) { // handle enter 
        var key = e.which; // return value of key
        //alert(key);
        if(key == 13)  // the enter key code
        {
            socket.emit('client-send-credential',$('#credential').val());
            $('#credential').val('');
            return false;  
        }
    }); 
    $('#btnCredential').click(function(){
        socket.emit('client-send-credential',$('#credential').val());
    });


    // SEND MESSAGE
    $('#message').keypress(function (e) { // handle enter 
        var key = e.which; // return value of key
        //alert(key);
        if(key == 13)  // the enter key code
        {
            socket.emit('client-send-message',$('#message').val());  
            $('#message').val('');
            return false;  
        }
    }); 
    $('#btnMessage').click(function(){
        socket.emit('client-send-message',$('#message').val());
        $('#message').val('');
    });
    // end SEND MESSAGE

    $('#btnlogout').click(function(){
        $.removeCookie("name");
        socket.emit('client-send-logout');
    });

    $('#message').focusin(function(){
        socket.emit('client-send-loading');
    });

    $('#message').focusout(function(){
        socket.emit('client-send-end-loading');
    })

});

