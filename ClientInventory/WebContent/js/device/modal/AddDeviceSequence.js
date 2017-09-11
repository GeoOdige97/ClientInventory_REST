function setSequencer(){
	var sequencer  = [false,false,false,false];
	sequencer[0] = true; // sequencer is initialized
	return sequencer
}

function addDeviceSequence(){
	
	var sequencer  = [false,false,false,false];
	sequencer[0] = true; // sequencer is initialized
	
	if ($("#name").val() !==''){
		if(previousSequence(sequencer,1)){
			sequencer[1] = true;
			$("#userButton").show();
			
			//$("#networkButton").show();
			$("#generalInfo div").children().show();
		}
	}
	else {
		$("#generalInfo div").find("div").each(function(){
			var id = $(this).attr("id");
			if( id !== "modalGeneral0"){
				$(this).hide();
			}
			else{
				$(this).show();
			}
		});
		$("#userButton").hide();
		$("#networkButton").hide();
		$("#deviceDetailButton").hide();
	}
	
	if ($("#user").val() !== ''){
		if(previousSequence(sequencer,2)){
			sequencer[2] = true;
			$("#locationButton").show();
			$("#userInfo div").children().show();
		}
	}
	else {
		$("#userInfo div").find("div").each(function(){
			var id = $(this).attr("id");
			if( id !== "modalUser0"){
				$(this).hide();
			}
			else{
				$(this).show();
			}
		});
		$("#locationButton").hide();	
	}
	
	if ($("#location").val() !== ''){
		if(previousSequence(sequencer,2)){
			sequencer[3] = true;
			$("#locationInfo div").children().show();
		}
	}
	else {
		$("#locationInfo div").find("div").each(function(){
			var id = $(this).attr("id");
			if( id !== "modalLocation0"){
				$(this).hide();
			}
			else{
				$(this).show();
			}
		});
	}
	
	if($("#type").val() === "Printer"){
		$("#showDeviceDetailInfo").text(" + Add Printer Info");
		if ($("#deviceDetailButton").text() !== "Printer"){
			$("#deviceDetailInfo").children().remove();
			$("#deviceDetailButton").text("Printer");
			$("#deviceDetailButton").hide();
			var path = "html/device/modal/PrinterInfo.html";
			$.when(
				getHtmlFile(path)
			).done(function(html){
				$("#deviceDetailInfo").append(html);
			});
		}
	}
	else if($("#type").val() === "Laptop" ||
			$("#type").val() === "Desktop" ||
			$("#type").val() === "Hybrid Laptop" ||
			$("#type").val() === "Server"){
		
			$("#showDeviceDetailInfo").text(" + Add Computer Info");
		
		if ($("#deviceDetailButton").text() !== "Computer"){
			$("#deviceDetailInfo").children().remove();
			$("#deviceDetailButton").text("Computer");
			$("#deviceDetailButton").hide();
			var path = "html/device/modal/ComputerInfo.html";
			$.when(
				getHtmlFile(path)
			).done(function(html){
				$("#deviceDetailInfo").append(html);
			});
		}
	}
	else{
		$("#deviceDetailButton").hide();
		$("#deviceDetailInfo").children().remove();
		$("#deviceDetailInfo").hide();
		$("#showDeviceDetailInfo").hide();
	}
}

function previousSequence(sequencer,sequenceNumber){
	var result = false;
	
	for (var i = 0; i < sequenceNumber; i ++){
		if (sequencer[i] === false){
			result = false;
			return result;
		}
	}
	return true;
}

