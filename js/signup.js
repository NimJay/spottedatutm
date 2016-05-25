/*-------------------------------- S I G N U P -------------------------------*/

var signupLock = false;

function submitOnEnter (event) {
	if (event.keyCode == 13) {
		signup();
	} else {
		verify();
	}
}

function verify () {
	
	function _updateStatus(status, newColor) {
		$("#signup-status").css({"color":newColor});
		$("#signup-status").html(status);
		
		return true;
	}
	
	var email = $("#signup-email").val();
	var password = $("#signup-password").val();
	var confirm = $("#signup-confirm").val();
	
	// Email.
	if (!(/^(.)+@(mail\.)?utoronto\.ca$|^(.)+@utmsu\.ca$/i.test(email))) {
		return !_updateStatus("Your email must end in '@mail.utoronto.ca', '@utoronto.ca', or '@utmsu.ca'.", "rgb(255, 100, 80)");
	}
	
	if (password.length < 6) {
		return !_updateStatus("Password must be at least 6 characters long.", "rgb(255, 100, 80)");
	}
	
	if (password != confirm) {
		return !_updateStatus("Password and confirmation do match.", "rgb(255, 100, 80)");
	}
	
	
	return _updateStatus("Looks good. :)", "rgb(50, 150, 255)");
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
					$("#signup-status").html("Whoops, something went wrong at our server. We're sorry.");
				} else if (data.exists) {
					$("#signup-status").html("Email already in use.");
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
				$("#login-status").html("Whoops, something went wrong at our server. We're sorry.");
			},
			complete: function () {
				// Enable posting.
				signupLock = false;
				$("#signup-signup").css("backgroundColor", "rgba(20, 20, 20, 0.9)");
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

