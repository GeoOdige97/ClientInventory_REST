
$(document).ready(function() {

	//----- Register a user to the Device -----
	//----- Select a user from the provided list -----
	$(document).on("click", "#newUserButton, #changeUser", function () {
		var path = "html/UserList.html";
		var entity = "user";
		showList();
		loadModalList(path,entity);
	});

	//----- Register a product to the Device -----
	//----- Select a product from the provided list -----
	$(document).on("click", "#newProductButton, #changeProduct", function () {
		var path = "html/ProductList.html";
		var entity = "product";
		showList();
		loadModalList(path,entity);
	});

	//----- Register a location to the Device -----
	//----- Select a location from the provided list -----
	$(document).on("click", "#newLocationButton, #changeLocation", function () {
		var path = "html/LocationList.html";
		var entity = "location";
		showList();
		loadModalList(path,entity);
	});

	//----- Register a type to the Product -----
	//----- Select a type from the provided list -----
	$(document).on("click", "#newTypeButton, #changeType", function () {
		var path = "html/TypeList.html";
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
		addDeviceSequence();
		$.validate();
		
		$("#deviceInfoForm").removeClass("editDevice");
		$("#deviceInfoForm").removeClass("viewDevice");
		$("#deviceModal").css("display","block");
		$("label").addClass("control-label");
		$("#modalTitleText").html("New Device");

		$("#deviceInfoForm").addClass("addDevice");
		$("#leftFrame").addClass("inputSelector");
		
		$("#deviceContainer input").prop("readonly", true);
		$("#dateRented").prop("readonly", false);
		$("#dateRenturn").prop("readonly", false);
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

		$("#deviceInfoForm").removeClass("viewDevice");
		$("#deviceInfoForm").addClass("editDevice");	
		$("#modalTitleText").html("Edit Device");
		$("input").prop('readonly', false);
		$("select").prop('readonly', false);

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

		$.when(
			new Services().entity("device").remove().uriData(deviceId).promise()
		).done(function(){
			table = $('#inventTableId').DataTable();
			table.column("id").search(deviceId).row().remove().draw();
			$("#close").trigger("click");
		}).fail(function(){
			alert("when fails");
		});		
	});

	//----- Register the device and refresh the table -----
	$(document).on("click", "#saveButtonId", function () {
		var sessionLocation = JSON.parse(sessionStorage["location"]);
		var sessionUser = JSON.parse(sessionStorage["user"]);
		var sessionProduct = JSON.parse(sessionStorage["product"]);
		var device =  $("#generalInfo").serializeJSON({parseWithFunction: emptyStringsAndZerosToNulls});
		var location =  $("#locationInfo").serializeJSON({parseWithFunction: emptyStringsAndZerosToNulls});
		var user =  $("#userInfo").serializeJSON({parseWithFunction: emptyStringsAndZerosToNulls});
		var detail =  $("#deviceDetailInfo").serializeJSON({parseWithFunction: emptyStringsAndZerosToNulls});
		var network =  $("#networkInfo").serializeJSON({parseWithFunction: emptyStringsAndZerosToNulls});
	
		device.location.id = sessionLocation.id;
		device.user.id = sessionUser.id;
		device.product.id = sessionProduct.id;
		var jsonDevice = JSON.stringify(device);
		
		// if add network boolean is false remove json network
		// if add computer boolean is false remove json computer
		// if add printer boolean is false remove json printer
		//alert("Device json list  " + jsonDevice);

		$.when(
			new Services().post().entity("device").add().jsonData(jsonDevice).promise()
		).done(function(data){
			addDeviceToTable (data);
		}).fail(function(){
			alert("when fails");
		});		
	});	
}); // End of document ready

function showList(){
	$("#deviceInfoForm").addClass("deviceFormShowList");
	$("#leftFrame").removeClass("modalHideList");
	$("#leftFrame").addClass("modalShowList");
	$("#rightFrame").removeClass("listHide");
	$("#rightFrame").addClass("listShow");
	$("#rightFrame").show();
}

function hideList(){
	$("#deviceInfoForm").addClass("deviceFormHideList");
	$("#deviceInfoForm").removeClass("deviceFormShowList");
	$("#leftFrame").removeClass("modalShowList");
	$("#leftFrame").addClass("modalHideList");
	$("#rightFrame").hide();
}

function selectedProduct(e){
	var table = $('#productTableId').DataTable();
	var rowData = table.row(e).data();

	$("#productList").remove();
	hideList();

	$.when(
		new Services().get().entity("product").find().uriData(Number(rowData.id)).promise()
	).done(function(products){
		var product = products[0];
		sessionStorage["product"] = JSON.stringify(product);
		$("#name").val(product.name);
		$("#model").val(product.model);
		$("#comapny").val(product.company);
		$("#type").val(product.type.name);
		
		if($("#deviceInfoForm").hasClass("addDevice")){
			addDeviceSequence();
		}
	});
}

function selectedLocation(e){
	var table = $('#locationTableId').DataTable();
	var rowData = table.row(e).data();
	$("#locationList").remove();
	hideList();

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
		
		if($("#deviceInfoForm").hasClass("addDevice")){
			addDeviceSequence();
		}
		loadMap(parseFloat(location.latitude), parseFloat(location.longitude));
	});
}

function loadModalList(path,entity){
	$.when(
		new Services().get().entity(entity).findAll(),
		getHtmlFile(path)
	).done(function(data,html){
		$("#rightFrame").append(html[0])
		tableListSwitch(path,data);
	}).fail(function(error) {
		alert("Could not load all devices");
	});
}

function selectedUser (e) {
	var table = $('#userTableId').DataTable();
	var rowData = table.row(e).data();

	$("#userList").remove();
	hideList();

	$.when(
			new Services().get().entity("user").find().uriData(Number(rowData.id)).promise()
	).then(function(users){
		var user = users[0];
		sessionStorage["user"] = JSON.stringify(user);
		$("#user").val(user.firstName + " " + user.lastName );
		$("#department").val(user.department.name);
		
		if($("#deviceInfoForm").hasClass("addDevice")){
			addDeviceSequence();
		}
	});
}

function tableListSwitch (path,data){
	switch (path){
	case "html/UserList.html":
		initializeUserTable(data[0]);
		break;
	case "html/ProductList.html":
		initializeProductTable(data[0]);
		break;
	case "html/LocationList.html":
		initializeLocationTable(data[0]);
		break;
	case "html/TypeList.html":
		initializeTypeTable(data[0]);
		break;
	}
}

var emptyStringsAndZerosToNulls = function(val, inputName) {
	  if (val.trim() === "") return null; // parse empty strings as nulls
		  return val.trim();
}