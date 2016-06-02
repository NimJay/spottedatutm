/*---------------------------------- T I M E ---------------------------------*/


function timePhrase (time) {
	var now = Date.now();
	var posted = Date.UTC(time.substring(0, 4), parseInt(time.substring(5, 7)) - 1, 
						 time.substring(8, 10), time.substring(11, 13),
						 time.substring(14, 16), time.substring(17, 19));
	
	var sec = (now - posted) / 1000; // Difference in seconds.
	if (sec < 10) {return "a few seconds ago"}
	
	var min = sec / 60; // Difference in minutes.
	if (min < 2) {return "a minute ago"}
	if (min < 10) {return "a few minutes ago"}
	if (min < 50) {return "some minutes ago"}
	
	var hour = min / 60; // Difference in hour.
	if (hour < 2) {return "an hour ago"}
	if (hour < 10) {return "a few hours ago"}
	if (hour < 23) {return "some hours ago"}
	
	var day = hour / 24; // Difference in days.
	if (day < 2) {return "yesterday"}
	if (day < 6) {return "a few days ago"}
	if (day < 12) {return "about a week ago"}
	if (day < 24) {return "a few weeks ago"}
	
	var month = day / 7; // Difference in months.
	if (month < 5) {return "a few months ago"}
	if (month < 11) {return "months ago"}
	
	var year = month / 30; // Difference in years.
	if (year < 2) {return "about a year ago"}
	if (year < 5) {return "a few years ago"}
	
	return "old-ass post";
}