/*-------------------------------- S I G N U P -------------------------------*/

var forgotLock = false;

function forgotStatus(status, newColor) {
	$("#forgot-status").css({"color":newColor});
	$("#forgot-status").html(status);
	return true;
}

function submitOnEnter () {
	if (event.keyCode == 13) {
		submit();
	} else {verify();}
}

function verify () {
	
	var email = $("#forgot-email").val();
	var password = $("#forgot-password").val();
	var confirm = $("#forgot-confirm").val();
	
	// Email.
	if (!(/^(.)+@(mail\.)?utoronto\.ca$|^(.)+@utmsu\.ca$/i.test(email))) {
		return !forgotStatus("All registered emails end in '@mail.utoronto.ca', '@utoronto.ca', or '@utmsu.ca'.", "rgb(255, 100, 80)");
	}
	
	if (password.length < 6) {
		return !forgotStatus("Password must be at least 6 characters long.", "rgb(255, 100, 80)");
	}
	
	if (password != confirm) {
		return !forgotStatus("Password and confirmation do match.", "rgb(255, 100, 80)");
	}
	
	return forgotStatus("", "rgb(50, 150, 255)");
}


function submit () {
	if (forgotLock) {return false;}
	forgotLock = true;
	if (!verify()) {return false;}
	
	$("#forgot-submit").css("backgroundColor", "rgba(20, 20, 20, 0.1)");
	$("#forgot-status").html("One sec...");

	var email = $("#forgot-email").val();
	var password = $("#forgot-password").val();

	$.ajax({
		type: "POST",
		url: "php/resetpassword.php",
		data: {"email":email, "password":password},
		success: function (data) {
			console.log("POST php/forgotpassword.php");
			console.log(data);
			if (data.error || data.invalid) {
				forgotStatus("Sorry, something went wrong at our server.", "rgb(255, 100, 80)");
			} else if (!data.exists) {
				forgotStatus("Sorry, we could not find an account registered under " + email + ".", "rgb(255, 100, 80)");
			} else {
				// Success.
				$("#forgot-status").html("");
				$("#success-email").html(email);
				$("#forgot").fadeOut(300, function () {
					$("#success").fadeIn(300)
				});
			}
		},
		error: function (error) {
			console.log(error);
			forgotStatus("Whoops, sorry, something went wrong at out server.", "rgb(255, 100, 80)");
		},
		complete: function () {
			// Enable posting.
			forgotLock = false;
			$("#forgot-submit").css("backgroundColor", "rgba(20, 20, 20, 0.93)");
		},
		dataType: "json"
	});
}


/*-------------------------------- O N L O A D -------------------------------*/

$(function () {
	// Submit.
	$("#forgot-submit").click(submit);
	// Email.
	$("#forgot-password").keyup(null, verify);
	$("#forgot-email").keyup(null, verify);
	$("#forgot-confirm").keyup(null, submitOnEnter);
	
	// Let's go!
	$("#peek").animate({bottom:"0px"}, 1000); // Slide deer in.
	$("#forgot-email").focus();
});