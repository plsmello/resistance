console.log('oi');

$(document).ready(function () {
	var ready = false;

	$("#submit").submit(function (e) {
		e.preventDefault();
		localStorage.setItem("RTnick", $("#nickname").val());

		$(document).ready(function () {
			url = "/mesa.html";
			$(location).attr("href", url);
		});
/*
		var name = $("#nickname").val();
		var time = new Date();
		$("#name").html(name);
		$("#time").html('First login: ' + time.getHours() + ':' + time.getMinutes());

		ready = true;
		console.log(ready);
		socket.emit("join", name);
 */
	});





});

