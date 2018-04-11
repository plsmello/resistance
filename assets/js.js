var socket = io.connect("http://10.100.80.204:3000");
console.log('oi');
fetch({
	json
})
$(document).ready(function () {
	var ready = false;

	$("#submit").submit(function (e) {
		e.preventDefault();
		$(document).ready(function () {
			url = "/mesa.html";
			$(location).attr("href", url);
		});
		var name = $("#nickname").val();
		var time = new Date();
		$("#name").html(name);
		$("#time").html('First login: ' + time.getHours() + ':' + time.getMinutes());

		ready = true;
		console.log(ready);
		socket.emit("join", name);

	});

	$("#textarea").keypress(function (e) {
		if (e.which == 13) {
			var text = $("#textarea").val();
			$("#textarea").val('');
			var time = new Date();
			$(".chat").append('<li class="self"><div class="msg"><span>' + $("#nickname").val() + ':</span><p>' + text + '</p><time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
			socket.emit("send", text);

		}
	});


	socket.on("update", function (msg) {
		if (ready) {
			$('.chat').append('<li class="info">' + msg + '</li>')
		}
	});

	socket.on("chat", function (client, msg) {
		if (ready) {
			var time = new Date();
			$(".chat").append('<li class="other"><div class="msg"><span>' + client + ':</span><p>' + msg + '</p><time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
		}
	});

	socket.on("mesa", function (clients) {
			console.log('cara');
			console.log(clients);
		if (ready) {
			console.log(clients);
			var data_length = clients.length;
			for (var i = 0; i < data_length; i++) {
				alert(clients[i]);
				$('p'+i).html(clients[i]);
			}
		}
	});




});

