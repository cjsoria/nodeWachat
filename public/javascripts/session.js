var nick=prompt('Type your nick');

var socket = io();

$('form').submit(function(e){
	e.preventDefault();
	socket.emit('chat message',nick, $('#to-send').val());
	$('#to-send').val('');
});

$('input').keydown(function(){
	socket.emit('typing', nick);
});

socket.on('chat message', function(nick, msg){
	$('#message').append($('<h3 class="msg-author">').text(nick));
	$('#message').append($('<div class="msg-text">').text(msg));
	$('#message').append($('<div class="bubble-arrow">'));
});

socket.on('user in', function(msg, count){
	$('#chat-content').append($('<span>').text(msg+`. There are ${count} users`));
});

socket.on('user out', function(msg, count){
	$('#chat-content').append($('<span>').text(msg+`. Remains ${count} users`));
});

socket.on('user typing', function(msg){
	$('#w').replaceWith(msg);
})