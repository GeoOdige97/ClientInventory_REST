/* ------- User Table -------  */
function initializeUserTable(data) {
	var table = $("#userTableId").DataTable({
		"paging": false,
		"info": false,
		"sScrollY": "300px",
		data: data,
		columns:[
			{data: "firstName"}, 
			{data: "lastName"}, 
			{data: "id"}
		]
	}).draw();
}

/* ------- Location Table -------  */
function initializeLocationTable(data) {
	var table = $("#locationTableId").DataTable({
		"paging": false,
		"info": false,
		"sScrollY": "300px",
		data: data,
		columns:[
			{data: "address"}, 
			{data: "city"}, 
			{data: "id"}
		]
	}).draw();
}

/* ------- Product Table -------  */
function initializeProductTable(data) {
	var table = $("#productTableId").DataTable({
		"paging": false,
		"info": false,
		"sScrollY": "300px",
		data: data,
		columns:[
			{data: "name"}, 
			{data: "model"}, 
			{data: "id"}
		]
	}).draw();
}

/* ------- Type Table -------  */
function initializeTypeTable(data) {
	var table = $("#typeTableId").DataTable({
		"paging": false,
		"info": false,
		"sScrollY": "300px",
		data: data,
		columns:[
			{data: "name"}, 
			{data: "id"}
		]
	}).draw();
}



