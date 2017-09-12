$(document).ready(function() {
	
	//----- Clear session cache from browser on load -----
	$(window).on("load", function(){
		sessionStorage.clear();
	});

	//----- Load Top Navigation Bar -----
	$.get("html/NavBar.html", function(data) {
		$("#topNav").append(data);
	});

	//----- Load Side Bar -----
	$.get("html/SideBar.html", function(data) {
		$("#sideBar").append(data);
	});

	//----- Load Page Footer -----
	$.get("html/PageFooter.html", function(data) {
		$("#footer").append(data);
	});

	//----- Load the Device Table -----
	$.when(
		new Services().get().entity("device").findAll().promise()
	).done(function(data){
		initializeTable(data);			
	}).fail(function(error) {
		alert("Could not load all devices");
	});	

	//----- Set up Modal -----
	
	//----- Retrieve Device Data from Row -----
	$('#inventTableId').on('dblclick', 'tbody tr', function() {

		setUpModal();
		var table = $("#inventTableId").DataTable();
		var rowData = table.row(this).data();
		var deviceId = "{\"id\":" + rowData[4] + "}";
		var html1 = "html/device/modal/NetworkInfo.html";
		var files = [html1];
		
		$.when(
			new Services().get().entity("device").path("find").uriData(Number(rowData[4])).promise(),
			getAllHtmlFiles(files)
		).then(function(deviceData,networkHtml){

			$("#deviceContainer").append(networkHtml);
			var deviceDetailFile = [] 
			var deviceType;
			var device = deviceData[0];
			sessionStorage["device"] = JSON.stringify(device);
			

			// General device data
			setGeneralInfo(device);
			//Network device data
			setNetworkInfo(device);
			// User data
			setUserInfo(device);
			// Location data
			setLocationInfo(device);
			// Registration data
			setRegistration(device);
			
			// Get device's detail depending 
			// on the device type
			if(device[0].computer !== null){
				deviceDetailFile.push("html/device/modal/ComputerInfo.html");
				$("#deviceDetailButton").text("Computer");
				deviceType = "Computer";
			}
			else if(device[0].printer !== null){
				deviceDetailFile.push("html/device/modal/PrinterInfo.html");
				$("#deviceDetailButton").text("Printer");
				deviceType = "Printer";
			}
			// Load Device detail form info, if any
			if(deviceDetailFile.length > 0){
				$("#deviceDetailInfo").append(getAllHtmlFiles(deviceDetailFile));
				
				// Load Computer data
				if(deviceType == "Computer"){
					setComputerInfo(device);
				}
				// Load Printer data
				else if(deviceType == "Printer"){
					setPrinterInfo(device);
				}
			}
			
		}).done(function(){
			$("#deviceInfoForm").removeClass("editDevice");
			$("#deviceInfoForm").removeClass("addDevice");
			$("#modalTitleText").html("Device");
			$("#infoButtons").children().show();
	
			modalButtonSetup("generalButton");
			
			$("#showNetworkInfo").hide();
			$("#showDeviceDetailInfo").hide();
			$("#deviceDetailButton").hide();
			$("#deviceContainer .fa-pencil-square-o").hide();
			$("#deviceModal").css("display","block");
			$("label").addClass("control-label");
			$("#deviceInfoForm").addClass("viewDevice");
			$("#deviceInfoForm input").prop('readonly', true);
			$("select").prop('readonly', true);
			google.maps.event.trigger(map, 'resize');	

		}).fail(function(){
			alert("when fails");
		});			 	
	});
		
});

function setUpModal(){
	
	var html1 = "html/device/modal/DeviceGenaralInfo.html";
	//var html2 = "html/device/modal/NetworkInfo.html";
	var html3 = "html/device/modal/UserInfo.html";
	var html4 = "html/device/modal/LocationInfo.html";
	var html5 = "html/device/modal/DeviceDetailInfo.html";
	var html6 = "html/device/modal/CostInfo.html";
	
	var htmlInfo;
	
	var files = [html1,html3,html4,html5,html6]
	
	htmlInfo = getAllHtmlFiles(files);
	$("#deviceContainer").append(htmlInfo);
	$("#leftFrame").addClass("modalHideList");
}

function setGeneralInfo(data){
	var device = data[0]
	var product = device.product;
	var type = product.type;
	var registration = device.registration;
	var defaultValue = "N\\A";
	
	var deviceFC = new FormChecker().setJson(device);
	var typeFC = new FormChecker().setJson(type);
	var productFC = new FormChecker().setJson(product);
	var registrationFC = new FormChecker().setJson(registration);

	
	var nameBool = deviceFC.setFormValue("name").jsonExistAndNotEmpty("product");
	var modelBool = deviceFC.setFormValue("model").jsonExistAndNotEmpty("product");
	var conditionBool = deviceFC.setFormValue("condition").jsonExistAndNotEmpty("product");
	var typeBool =  productFC.setFormValue("name").jsonExistAndNotEmpty("type");
	var companyBool = deviceFC.setFormValue("company").jsonExistAndNotEmpty("product");
	var serialNumberBool = registrationFC.setFormValue("serialNumber").empty();

	// General device data
	$("#name").val(nameBool? product.name: defaultValue);
	$("#model").val(modelBool? product.model:defaultValue);
	$("#condition").val(conditionBool? product.condition:defaultValue);
	$("#type").val(typeBool? type.name:defaultValue);
	$("#company").val(companyBool? product.company:defaultValue);
	$("#serialNumber").val(serialNumberBool? device.serialNumber:defaultValue);

}

function setNetworkInfo(data){
	
	var device = data[0];
	var network = device.network;
	var networkFC = new FormChecker().setJson(device);
	var defaultValue = "N\\A";
	
	var ipAddressBool = networkFC.setFormValue("ipAddress").jsonExistAndNotEmpty("network");
	var dnsBool =  networkFC.setFormValue("dns").jsonExistAndNotEmpty("network");
	var serverBool =  networkFC.setFormValue("server").jsonExistAndNotEmpty("network");
	
	// Network data
	$("#ipAddress").val(ipAddressBool? network.ipAddress:defaultValue);
	$("#dns").val(dnsBool? network.dns:defaultValue);
	$("#server").val(serverBool? network.server:defaultValue);

}

function setUserInfo(data){
	
	var device = data[0]
	var registration = device.registrationList[0];
	var user = device.registrationList[0].user;
	var department = user.department;
	var defaultValue = "N\\A";
	
	var deviceFC = new FormChecker().setJson(device);
	var userFC = new FormChecker().setJson(registration);
	var departmentFC = new FormChecker().setJson(user);
	
	var firstNameBool = userFC.setFormValue("firstName").jsonExistAndNotEmpty("user");
	var lastNameBool  = userFC.setFormValue("lastName").jsonExistAndNotEmpty("user");
	var departmentNameBool  = departmentFC.setFormValue("name").jsonExistAndNotEmpty("department");
	var companyTitleBool  = userFC.setFormValue("companyTitle").jsonExistAndNotEmpty("user");
	var officeEmailBool  = userFC.setFormValue("officeEmail").jsonExistAndNotEmpty("user");
	
	// User Data
	$("#user").val(firstNameBool && lastNameBool? user.firstName + " " + user.lastName: defaultValue);
	$("#department").val(departmentNameBool? department.name: defaultValue);
	$("#companyTitle").val(companyTitleBool? user.companyTitle:defaultValue);
	$("#officeEmail").val(officeEmailBool? user.officeEmail:defaultValue);

}

function setLocationInfo(data){
	
	var device = data[0];
	var location = device.location;
	var locationFC = new FormChecker().setJson(device);
	var defaultValue = "N\\A";
	
	var countryBool = locationFC.setFormValue("country").jsonExistAndNotEmpty("location");
	var cityBool = locationFC.setFormValue("city").jsonExistAndNotEmpty("location");
	var addressBool = locationFC.setFormValue("address").jsonExistAndNotEmpty("location");
	var postalCodeBool = locationFC.setFormValue("postalCode").jsonExistAndNotEmpty("location");

	// Location data
	$("#location").val(addressBool?location.address:defaultValue);
	$("#country").val(countryBool?location.country:defaultValue);
	$("#city").val(cityBool?location.city:defaultValue);
	$("#postalCode").val(postalCodeBool?location.postalCode:defaultValue);
	
	if (location !== null){
		loadMap(parseFloat(location.latitude), parseFloat(location.longitude));
		google.maps.event.trigger(map, "resize");
	}
}

function setPrinterInfo(data){
	
	var device = data[0];
	var printer = device.printer;
	var printerFC = new FormChecker().setJson(device);
	var defaultValue = "N\\A";
	
	var wifiBool = printerFC.setFormValue("wifi").jsonExistAndNotEmpty("printer");
	var scannerBool = printerFC.setFormValue("scanner").jsonExistAndNotEmpty("printer");
	var photoCopyBool = printerFC.setFormValue("photoCopy").jsonExistAndNotEmpty("printer");
	var paperTypeBool = printerFC.setFormValue("paperType").jsonExistAndNotEmpty("printer");
	var cartridgeBool =printerFC.setFormValue("cartridge").jsonExistAndNotEmpty("printer");
	var faxNumberBool = printerFC.setFormValue("faxNumber").jsonExistAndNotEmpty("printer");
	var colorBool = printerFC.setFormValue("color").jsonExistAndNotEmpty("printer");
	
	// Printer data
	$("#wifi").val(wifiBool? printer.wifi:defaultValue);
	$("#scanner").val(scannerBool? printer.scanner:defaultValue);
	$("#photoCopy").val(photoCopyBool? printer.photoCopy:defaultValue);
	$("#paperType").val(paperTypeBool? printer.paperType:defaultValue);
	$("#cartridge").val(cartridgeBool? printer.cartridge:defaultValue);
	$("#faxNumber").val(faxNumberBool? printer.faxNumber:defaultValue);
	$("#color").val(colorBool? printer.color:defaultValue);
	
}

function setComputerInfo(data){
	var device = data[0];
	var computer = device.computer;
	var computerFC = new FormChecker().setJson(device);
	var defaultValue = "N\\A";
	
	var ramBool = computerFC.setFormValue(computer.ram).jsonExistAndNotEmpty("computer");
	var cpuBool = computerFC.setFormValue(computer.cpu).jsonExistAndNotEmpty("computer");
	
	// Computer data
	$("#ram").val(ramBool? computer.ram:defaultValue);
	$("#cpu").val(cpuBool? computer.cpu:defaultValue);
}

function setRegistration(data){
	
	var device = data[0];
	var registrationList = device.registrationList[0];
	var registrationListFC = new FormChecker().setJson(device);
	var defaultValue = "N\\A";
	
	var dateRentedBool = registrationListFC.setFormValue(registrationList.dateRented).empty();
	var dateReturnBool = registrationListFC.setFormValue(registrationList.dateReturn).empty();
	
	// Registration Data
	$("#dateRented").val(dateRentedBool?registrationList.dateRented:defaultValue);
	$("#dateReturn").val(dateReturnBool?registrationList.dateReturn:defaultValue);
	
}

function initializeTable(data) {
	var table = $("#inventTableId").DataTable();
	for (var i = 0; i < data.length; i++){
		table.row.add([
		               data[i].product.name,
		               data[i].product.company,
		               data[i].product.type.name,
		               data[i].product.model,
		               data[i].id
		]);
	}
	table.draw();
	
}

function addDeviceToTable(data){
 	var table = $("#inventTableId").DataTable();
 	for (var i = 0; i < data.length; i++){
		table.row.add([
		               data[i].product.name,
		               data[i].product.company,
		               data[i].product.type.name,
		               data[i].product.model,
		               data[i].id
		]);
	}
	table.draw();
}