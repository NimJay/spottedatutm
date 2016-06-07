/*-------------------------------- S I G N U P -------------------------------*/

var signupLock = false;

function signupStatus(status, newColor) {
	$("#signup-status").css({"color":newColor});
	$("#signup-status").html(status);
	return true;
}

function submitOnEnter (event) {
	if (event.keyCode == 13) {
		signup();
	} else {
		verify();
	}
}

function verify () {
	
	var email = $("#signup-email").val();
	var password = $("#signup-password").val();
	var confirm = $("#signup-confirm").val();
	
	// Email.
	if (!(/^(.)+@(mail\.)?utoronto\.ca$|^(.)+@utmsu\.ca$/i.test(email))) {
		return !signupStatus("Your email must end in '@mail.utoronto.ca', '@utoronto.ca', or '@utmsu.ca'.", "rgb(255, 100, 80)");
	}
	
	if (password.length < 6) {
		return !signupStatus("Password must be at least 6 characters long.", "rgb(255, 100, 80)");
	}
	
	if (password != confirm) {
		return !signupStatus("Password and confirmation do match.", "rgb(255, 100, 80)");
	}
	
	
	return signupStatus("Looks good. :)", "rgb(50, 150, 255)");
}

function signup () {
	if (verify()) {
		if (signupLock) {return false;}
		
		signupLock = true;
		$("#signup-signup").css("backgroundColor", "rgba(20, 20, 20, 0.1)");
		$("#signup-status").html("One sec...");
		
		var email = $("#signup-email").val();
		var password = $("#signup-password").val();
		
		$.ajax({
			type: "POST",
			url: "php/signup.php",
			data: {"email":email, "password":password},
			success: function (data) {
				console.log("POST php/signup.php");
				console.log(data);
				if (data.error || data.invalid) {
					signupStatus("Sorry, something went wrong at our server.", "rgb(255, 100, 80)");
				} else if (data.exists) {
					signupStatus("Email already in use.", "rgb(255, 100, 80)");
				} else {
					$("#signup-status").html("");
					// Login!
					$.ajax({
						type: "POST",
						url: "php/login.php",
						data: {"email":email, "password":password},
						success: function (data) {
							console.log("POST php/login.php");
							console.log(data);
							if (!data.error && !data.invalid && data.authenticated) {
								Cookies.set("id", {path:data.id});
							}
						},
						error: function (error) {console.log(error);},
						dataType: "json"
					});
					
					$("#success-email").html(email);
					$("#signup").fadeOut(300, function () {
						$("#success").fadeIn(300)
					});
				}
			},
			error: function (error) {
				console.log(error);
				signupStatus("Whoops, sorry, something went wrong at out server.", "rgb(255, 100, 80)");
			},
			complete: function () {
				// Enable posting.
				signupLock = false;
				$("#signup-signup").css("backgroundColor", "rgba(20, 20, 20, 0.93)");
			},
			dataType: "json"
		});
	}
}

$(function () {
	
	// Sign Up.
	$("#signup-signup").click(signup);
	// Verify.
	$("#signup-email").keyup(null, verify);
	$("#signup-password").keyup(null, verify);
	$("#signup-confirm").keyup(null, submitOnEnter);
	
	
	// Let's go!
	$("#peek").animate({left:"0px"}, 1000); // Slide deer in.
	$("#signup-email").focus();
});

