//
// Helpes
//

// convert a string to json
function createJSON(fieldName, value) {
	var obj = {};
	obj[fieldName.valueOf()] = value;
	var json = JSON.stringify(obj);
	return json;
}

// Clear the values inside the form input
function resetFormInput(){
	$("form").each(function(){
		$(this).get(0).reset();
	});
}

// Convert a serialized-array to a json object
function serializedArrayToJSON(serializedData) {
	var jsonObject = "{";
	var dataLength = serializedData.length;

	for (var count = 0; count < dataLength; count++) {
		jsonObject += "\"" + serializedData[count].name + "\":";
		jsonObject += "\"" + serializedData[count].value + "\"";
		if (dataLength - 1 == 0 || count == dataLength - 1) {
			jsonObject += "}";
		} else {
			jsonObject += ",";
		}
	}

	return jsonObject;
}

// Creates URIs to communicate between
// the client and the server
var Services = function() {

	this.serviceEntity = "";
	this.servicePath = "http://localhost:8080/InventoryApp/service";
	this.messageType = "";
	this.data = "";

	Services.prototype.entity = function(entityName) {
		this.servicePath += "/" + entityName;
		return this;
	}

	Services.prototype.find = function() {
		this.servicePath += "/find";
		return this;
	}

	Services.prototype.findAll = function() {
		this.servicePath += "/findAll";
		return this;
	}

	Services.prototype.add = function() {
		this.servicePath += "/add";
		return this;
	}

	Services.prototype.update = function() {
		this.servicePath += "/update";
		return this;
	}

	Services.prototype.remove = function() {
		this.servicePath += "/delete";
		return this;
	}

	Services.prototype.path = function(servicePath) {
		this.servicePath += "/" + servicePath;
		return this;
	}

	Services.prototype.uriData = function(uriData) {
		this.servicePath += "/" + uriData;
		return this;
	}

	// Insert data to the HTTP message
	// Use only for PUT and POST
	Services.prototype.jsonData = function(data) {
		this.data = data
		return this;
	}

	/*
	 * Select HTTP message type GET,DELETE,PUT,POST
	 */
	Services.prototype.get = function() {
		this.messageType = "GET";
		return this;
	}
	Services.prototype.post = function() {
		this.messageType = "POST";
		return this;
	}

	Services.prototype.put = function() {
		this.messageType = "PUT";
		return this;
	}

	Services.prototype.messageRemove = function() {
		this.messageType = "DELETE";
		return this;
	}

	Services.prototype.promise = function() {
		return sendAjax(this.messageType, this.servicePath, this.data);
	}
}

// The AJAX method is called depending on the method
// json data can also be added to envelope
function sendAjax(messageType, serviceName, jsonData) {

	//alert(serviceName);

	if (messageType == "GET" || messageType == "DELETE") {
		return $.ajax({
			type : messageType,
			url : serviceName,
			cache : false,
			async : true,
			contentType : "application/json",
			dataType : "json"
		});

	} else if (messageType == "POST" || messageType == "UPDATE"
			|| messageType == "PUT") {

		return $.ajax({
			type : messageType,
			url : serviceName,
			contentType : "application/json",
			data : jsonData,
			dataType : "json"
		});
	}

	return ""; 
}

// Re-center the location on the google map
function newLocation(newLat, newLng) {
	map.setCenter({
		lat : newLat,
		lng : newLng
	});
}

// initialize the google map api
var map;
function loadMap(lat, lng) {
	  map = new google.maps.Map(document.getElementById("map"), {
          center: {lat: lat, lng: lng},
          zoom: 8
	  });
}

// Get a file using AJAX
function getHtmlFile(url) {
	return $.ajax({
		url : url,
		type : "get",
		async : false,
	});
}

// Get many files using AJAX
function getAllHtmlFiles(files) {
	var htmlInfos;
	for (var i = 0; i < files.length; i++) {
		$.when(getHtmlFile(files[i])).done(function(html) {
			(i <= 0) ? htmlInfos = html : htmlInfos += html;
		});
	}

	return htmlInfos;
}

// Verifies if the received json values
// satisfies the conditions need to be 
// displayed on the client side
var FormChecker = function() {

	this.notEmpty;
	this.phoneNumber;
	this.emailAddress ;
	this.minLength ;
	this.maxLength ;
	this.defaultValue ;
	this.error = {};
	this.formValue ="" ;
	this.json;
	this.result = false;

	FormChecker.prototype.setJson = function(json) {
		this.json = json;
		return this;
	}

	FormChecker.prototype.setFormValue = function(formValue) {
		this.formValue = formValue;
		return this;
	}

	FormChecker.prototype.setDefaultValue = function(defaultValue) {
		this.defaultValue = defaultValue;
		return this;
	}

	FormChecker.prototype.isEmpty = function() {
		
		if (typeof this.formValue === "undefined"||
			this.formValue === null){
			return this.error["empty"] = true;
		}
	
		if (this.formValue.length <= 0) {
			this.error["empty"] = true;
		} else {
			this.error["empty"] = false;
		}
		return this;
	}

	FormChecker.prototype.isMinLength = function(minLength) {
		if (typeof this.formValue === "undefined"){
			return this.error["minLength"] = true;
		}
		
		if (Number(this.formValue.length) == 10 < Number(minLength)) {
			this.error["minLength"] = true;
		} else {
			this.error["minLength"] = false;
		}
		return this;
	}

	FormChecker.prototype.isMaxLength = function(maxLength) {
		if (typeof this.formValue === "undefined"){
			return this.error["maxLength"] = true;
		}
		
		if (this.formValue.length > Number(maxLength)) {
			this.error["maxLength"] = true;
		} else {
			this.error["maxLength"] = false;
		}
		return this;
	}

	FormChecker.prototype.isPhoneNumber = function() {
		if (typeof this.formValue === "undefined"){
			return this.error["phoneNumber"] = true;
		}
		
		if (Number(this.formValue.length) == 10 || Number(formValue.length) == 7
				|| Number(formValue.length) == 11) {
			this.error["phoneNumber"] = true;
		} else {
			this.error["phoneNumber"] = false;
		}
		return this;
	}
 
	FormChecker.prototype.notEmpty = function() {
		this.isEmpty();
		if (this.error["empty"] === true) {
			this.formValue = true;
		}
		return false;
	}

	FormChecker.prototype.jsonExistAndNotEmpty = function(jsonProperty) {
		if (this.json.hasOwnProperty(jsonProperty)) {
			if(this.json[jsonProperty] !== null){
				if(this.json[jsonProperty].hasOwnProperty(this.formValue)){
					if(this.json[jsonProperty][this.formValue] !== null){
					if(this.json[jsonProperty][this.formValue].length > 0 ||
						typeof(this.json[jsonProperty][this.formValue]) === "boolean" ||
						$.isNumeric(this.json[jsonProperty][this.formValue]))
						return this.result = true;
					}
					
				}
			}
		}
		else{
			return this.result = false;
		}
		
	}

	FormChecker.prototype.getvalue = function() {
		return this.formValue;
	}

	FormChecker.prototype.getErrors = function() {
		return this.errors;
	}

}

