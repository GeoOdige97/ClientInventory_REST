$(document).ready(function() {
	var html1;
	var html2;
	
	// ----- Load Top Navigation Bar -----
	html1 = getHtmlFile("html/NavBar.html");
	$("#topNav").append(html1[0]);
	
	// ----- Load Page Footer -----
	html2 = getHtmlFile("html/PageFooter.html");
	$("#footer").append(html2[0]);
	
	$(document).on("click", "#loginButton", function () {
		var credentials =  $('form').serializeJSON();
		var jsonCredentials = JSON.stringify(credentials);
		
		$.when(
			new Services().post().entity("login").jsonData(jsonCredentials).promise()
		).done(function(data){
			
		if (data.path) {
				window.location.href = data.path;
		}
		else{
			// 404 error
		}
		});
	});
});  