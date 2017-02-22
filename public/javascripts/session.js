var nick=prompt('Type your nick');

var socket = io();

var counter = 0;

socket.emit('user in', nick);

$('form').submit(function(e){
	e.preventDefault();
	var msg = $('#to-send').val();
	var d = new Date();
	var min = ('0'+d.getMinutes()).slice(-2);
	$('.speech-wrapper').append($(`<div id="message${counter}" class="bubbles">`));
	$(`#message${counter}`).append($('<h3 class="msg-author">').text(nick));
	$(`#message${counter}`).append($('<div class="msg-text">').text(msg));
	$(`#message${counter}`).append($('<div class="bubbles-arrow">'));
	$(`#message${counter}`).append($(' <span class="timestamp">').text(d.getHours()+':'+min));
	animateScroll();
	socket.emit('chat message',nick, $('#to-send').val());
	$('#to-send').val('');
	++counter
});

$('input').keyup(function(){
	socket.emit('typing', nick);
});

socket.on('chat message', function(nick, msg, counter){
	var d = new Date();
	var min = ('0'+d.getMinutes()).slice(-2);
	$('.speech-wrapper').append($(`<div id="message${counter}" class="bubble">`));
	$(`#message${counter}`).append($('<h3 class="msg-author">').text(nick));
	$(`#message${counter}`).append($('<div class="msg-text">').text(msg));
	$(`#message${counter}`).append($('<div class="bubble-arrow">'));
	$(`#message${counter}`).append($(' <span class="timestamp">').text(d.getHours()+':'+min));
	animateScroll();
});

socket.on('user in', function(msg, count, counter){
	$('#chat-content').append($('<span class="not">').text(msg+`. There are ${count} users`));
	animation();

	$('#list').append($(`<div id="user${counter}" class="chat-pan-content">`));
	$(`#user${counter}`).append($('<img class="circle avatar" src="images/no-avatar.png">'));
	$(`#user${counter}`).append($('<h5 class="user-name">').text(nick));
});

socket.on('user out', function(msg, count){
	$('#chat-content').append($('<span class="not">').text(msg+`. Remains ${count} users`));
	animation();
});

socket.on('user typing', function(msg){
	$('#chat-content').append($('<span class="not">').text(msg));
	animation();
})

function animation() {
	setTimeout(function(){
		$(".not").fadeOut(1000)
	}, 1000);
}

function animateScroll(){
    var container = $('#chat-content');
    container.animate({"scrollTop": container[0].scrollHeight}, "fast");
}
