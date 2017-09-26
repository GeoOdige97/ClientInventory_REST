
$(document).ready(function() {

	//----- Register a user to the Device -----
	//----- Select a user from the provided list -----
	$(document).on("click", "#newUserButton, #changeUser", function () {
		var path = "html/device/lists/UserList.html";
		var entity = "user";
		showList();
		loadModalList(path,entity);
	});

	//----- Register a product to the Device -----
	//----- Select a product from the provided list -----
	$(document).on("click", "#newProductButton, #changeProduct", function () {
		var path = "html/device/lists/ProductList.html";
		var entity = "product";
		showList();
		loadModalList(path,entity);
	});

	//----- Register a location to the Device -----
	//----- Select a location from the provided list -----
	$(document).on("click", "#newLocationButton, #changeLocation", function () {
		var path = "html/device/lists/LocationList.html";
		var entity = "location";
		showList();
		loadModalList(path,entity);
	});

	//----- Register a type to the Product -----
	//----- Select a type from the provided list -----
	$(document).on("click", "#newTypeButton, #changeType", function () {
		var path = "html/device/lists/TypeList.html";
		var entity = "type";
		showList();
		loadModalList(path,entity);
	});

	//----- Switch when clicking on the device's info -----
	$(document).on("click", "#infoButtons > button", function (event) {
		modalButtonSwitch(event.target.id);
	});

	//----- Close form -----
	$(document).on("click", "#close", function () {
		sessionStorage.removeItem("user");
		sessionStorage.removeItem("location");
		sessionStorage.removeItem("device");
		$("#deviceContainer").scrollTop(0).scrollLeft(0);
		$("#deviceInfoForm").removeClass("addDevice");
		$("#deviceInfoForm").removeClass("editDevice");
		$("#deviceInfoForm").removeClass("viewDevice");
		$("#rightFrame").children().remove();
		$("#deviceContainer").children().remove();
		hideList();
		resetFormInput();
		$("#deviceModal").hide();
	});
	
	// Show network info when adding new device
	$(document).on("click", "#showNetworkInfo", function () {
		$("#networkButton").show();
			if ($("#networkInfo").children().length === 0){
				var html1 = "html/device/modal/NetworkInfo.html";
				var files = [html1];
				$.when(
					htmlInfo = getAllHtmlFiles(files)
				).done(function(networkHtml){
					$("#deviceContainer").append(networkHtml);
					$("#networkInfo").hide();
				});
		}
		
	});
	
	// Show detail info when adding new device
	$(document).on("click", "#showDeviceDetailInfo", function () {
		$("#deviceDetailButton").show();
			if ($("#deviceDetailInfo").children().length === 0){
				addDeviceSequence();
			}
	});
	
	//----- Add a Device -----
	$(document).on("click", "#newDevice,#addDevice", function () {
		setUpModal();
		modalButtonSetup("generalButton");
		resetFormInput(); 
		addDeviceSequence(); // Set up the sequencer to add a device
		$.validate();
		
		$("#deviceInfoForm").removeClass("editDevice");
		$("#deviceInfoForm").removeClass("viewDevice");
		$("#deviceModal").css("display","block");
		$("label").addClass("control-label");
		$("#modalTitleText").html("New Device Registration");

		$("#deviceInfoForm").addClass("addDevice");
		$("#leftFrame").addClass("inputSelector");
		
		$("#deviceContainer input").prop("readonly", true);
		$("#serialNumber").prop("readonly", false);
		$("#condition").prop("readonly", false);
		$("#detailInfo input").prop("readonly", false);
		$("#networkInfo input").prop("readonly", false);
		
		// Add date selector for the following fields
		$("#dateRented").datepicker({dateFormat: "yy-mm-dd"});
		$("#dateReturn").datepicker({dateFormat: "yy-mm-dd"});

	});

	//----- Edit Device -----
	$(document).on("click", "#editDevice", function () {	
		var device = JSON.parse(sessionStorage["device"]);

		// Make the input field editable 
		$("#deviceInfoForm").removeClass("viewDevice");
		$("#deviceContainer").addClass("editDevice");	
		$("#modalTitleText").html("Edit Device Registration");
		$("#serialNumber").prop("readonly", false);
		$("#condition").prop("readonly", false);
		$("#deviceDetailInfo input").prop("readonly", false);
		$("#networkInfo input").prop("readonly", false);
		$("#deviceContainer .fa-pencil-square-o").not("#changeProduct").show();
		
		// Add date selector for the following fields
		$("#dateRented").datepicker({dateFormat: "yy-mm-dd"});
		$("#dateReturn").datepicker({dateFormat: "yy-mm-dd"});
		
		google.maps.event.trigger(map, 'resize');

	});

	//----- User has been selected -----
	$(document).on("click", "#userTableId tbody tr", function () {
		selectedUser(this);
	});

	//----- Location has been selected  -----
	$(document).on("click", "#locationTableId tbody tr", function () {
		selectedLocation(this);
	});

	//----- Product has been selected -----
	$(document).on("click", "#productTableId tbody tr", function () {
		selectedProduct(this);
	});

	//-----Delete the selected device  -----
	//----- Then close the form and refresh the table -----
	$(document).on("click", "#deleteDevice", function () {
		var sessionDevice = JSON.parse(sessionStorage["device"]);
		var deviceId = sessionDevice.id;
		var table;

		// Remove the selected device from the server side
		$.when(
			new Services().entity("device").remove().uriData(deviceId).promise()
		).done(function(){
			table = $('#inventTableId').DataTable();
			table.column("id").search(deviceId).row().remove().draw();
			$("#close").trigger("click");
		}).fail(function(){
			alert("Could not remove the selected device");
		});		
	});

	//----- Register the device and refresh the table -----
	$(document).on("click", "#saveButtonId", function () {
		
		var sessionLocation = JSON.parse(sessionStorage["location"]);
		var sessionUser = JSON.parse(sessionStorage["user"]);
		var sessionProduct = JSON.parse(sessionStorage["product"]);
		
		var device =  $("#generalInfo").serializeJSON({parseWithFunction: emptyStringsAndZerosToNulls});
		var user =  $("#userInfo").serializeJSON({parseWithFunction: emptyStringsAndZerosToNulls}); // registration info
		var detail =  $("#deviceDetailInfo").serializeJSON({parseWithFunction: emptyStringsAndZerosToNulls}); // comp,print
		var network =  $("#networkInfo").serializeJSON({parseWithFunction: emptyStringsAndZerosToNulls});
		
		device.location = {id:sessionLocation.id};
		device.product = {id:sessionProduct.id};
		device.network = formIsEmpty(network)?null:network;
		
		if ($("#type").val() === "Printer"){
			device.printer = formIsEmpty(detail)?null:detail;
		}
		else if ($("#type").val() === "Laptop"||
				$("#type").val() === "Desktop"||
				$("#type").val() === "Tablet"||
				$("#type").val() === "Hybrid Laptop"||
				$("#type").val() === "Server"){
			device.computer = formIsEmpty(detail)?null:detail;
		}
		
		var registration = {dateRented:user.dateRented,dateReturn:user.dateReturn,user:{id:sessionUser.id}}
		var jsonList = {device:device,registration:registration};

		var jsonDevice = JSON.stringify(jsonList);
		
		alert(jsonDevice);

		$.when(
			new Services().post().entity("device").add().jsonData(jsonDevice).promise()
		).done(function(data){
			addDeviceToTable (data);
		}).fail(function(){
			alert("Could not save the device");
		});		
	});	
}); // End of document ready

function showList(){
	$("#deviceInfoForm").addClass("deviceFormShowList");
	$("#leftFrame").removeClass("modalHideList");
	$("#leftFrame").addClass("modalShowList");
	$("#rightFrame").removeClass("listHide");
	$("#rightFrame").addClass("listShow");
	$("#leftFrame :input").prop("disabled", true);
	$("#leftFrame i").prop("disabled", true);
	$("#rightFrame").show();
}

function hideList(){
	$("#deviceInfoForm").addClass("deviceFormHideList");
	$("#deviceInfoForm").removeClass("deviceFormShowList");
	$("#leftFrame").removeClass("modalShowList");
	$("#leftFrame").addClass("modalHideList");
	$("#containerWrapper").addClass("enableDeviceContainer");
	$("#leftFrame :input").prop("disabled", false);
	$("#leftFrame i").prop("disabled", false);
	$("#rightFrame").hide();
}

function selectedProduct(e){
	var table = $('#productTableId').DataTable();
	var rowData = table.row(e).data();

	// The list is no longer needed so it is destroyed
	$("#productList").remove();
	hideList(); 

	// Get the info of the selected product
	$.when(
		new Services().get().entity("product").find().uriData(Number(rowData.id)).promise()
	).done(function(products){
		var product = products[0];
		sessionStorage["product"] = JSON.stringify(product);
		$("#name").val(product.name);
		$("#model").val(product.model);
		$("#company").val(product.company);
		$("#type").val(product.type.name);
		
		if($("#deviceInfoForm").hasClass("addDevice")){
			addDeviceSequence();
		}
	});
}

function selectedLocation(e){
	var table = $('#locationTableId').DataTable();
	var rowData = table.row(e).data();
	
	// The list is no longer needed so it is destroyed
	$("#locationList").remove();
	hideList();

	// Get the info of the selected location
	$.when(
		new Services().get().entity("location").find().uriData(Number(rowData.id)).promise()
	).done(function(locations){
		$("#rightFrame").children().show();

		var location = locations[0];
		sessionStorage["location"] = JSON.stringify(location);
		$("#location").val(location.address);
		$("#country").val(location.country);
		$("#postalCode").val(location.postalCode);
		$("#city").val(location.city);
		
		// The add device sequencer monitors the construction 
		// the new device
		if($("#deviceInfoForm").hasClass("addDevice")){
			addDeviceSequence();
		}
		// Reset the location of the google map
		loadMap(parseFloat(location.latitude), parseFloat(location.longitude));
	});
}

// Gets and appends a list to modal 
function loadModalList(path,entity){
	$.when(
		new Services().get().entity(entity).findAll(),
		getHtmlFile(path)
	).done(function(data,html){
		$("#rightFrame").append(html[0])
		tableListSwitch(path,data);
	}).fail(function(error) {
		alert("Could not load list");
	});
}

function selectedUser (e) {
	var table = $('#userTableId').DataTable();
	var rowData = table.row(e).data();

	// The list is no longer needed so it is destroyed
	$("#userList").remove();
	hideList();

	// Get the info of the selected user
	$.when(
			new Services().get().entity("user").find().uriData(Number(rowData.id)).promise()
	).then(function(users){
		var user = users[0];
		sessionStorage["user"] = JSON.stringify(user);
		$("#user").val(user.firstName + " " + user.lastName );
		$("#officeEmail").val(user.officeEmail);
		$("#companyTitle").val(user.companyTitle);
		$("#department").val(user.department.name);
		
		// The add device sequencer monitors the construction 
		// the new device 
		if($("#deviceInfoForm").hasClass("addDevice")){
			addDeviceSequence();
		}
	});
}


function tableListSwitch (path,data){
	switch (path){
	case "html/device/lists/UserList.html":
		initializeUserTable(data[0]);
		break;
	case "html/device/lists/ProductList.html":
		initializeProductTable(data[0]);
		break;
	case "html/device/lists/LocationList.html":
		initializeLocationTable(data[0]);
		break;
	case "html/device/lists/TypeList.html":
		initializeTypeTable(data[0]);
		break;
	}
}

// When an input is empty, the json value is set to null
var emptyStringsAndZerosToNulls = function(val, inputName) {
	  if (val.trim() === "") return null; // parse empty strings as nulls
		  return val.trim();
}

function formIsEmpty(json){
	var numberOffFields = Object.keys(json).length;
	var empty = false;
	var emptyFields = 0;
	
	if (numberOffFields <= 0){ return empty = true; }
	
	for (var key in json) {
		if (json[key] === null) { emptyFields ++; }
	}
	
	if (numberOffFields === emptyFields){empty = true;}
	
	return empty;
	
}