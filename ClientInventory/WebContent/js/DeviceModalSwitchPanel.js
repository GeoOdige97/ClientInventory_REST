function modalButtonSwitch(clickedName){
	$("#deviceContainer").find("form").each(function(){
		modalButtonCase(clickedName,$(this));
	});	
}

function modalButtonSetup(buttonName){
	$("#deviceContainer").find("form").each(function(){
		modalButtonCase(buttonName,$(this));
	});
}

function modalButtonCase(name,info){
	if(name == info.attr("name")){
		info.show();
	}
	else{	
		info.hide();
	}		
}