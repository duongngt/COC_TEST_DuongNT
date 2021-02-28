var $=function(id){
	return document.getElementById(id);
}
function getData(keyName,callback){
	var xhr = new XMLHttpRequest();
	xhr.responseType = "json";
	xhr.open("GET","https://6037a910543504001772304e.mockapi.io/"+ keyName);
	xhr.onload= function(){
		if(xhr.readyState==4 && xhr.status== 200){
			callback(xhr.response);
		}
	}
	xhr.send();
}
function postData(keyName,objData, callback){
	var xhr = new XMLHttpRequest();
	xhr.open("POST","https://6037a910543504001772304e.mockapi.io/"+ keyName);
	xhr.setRequestHeader("Content-type", "application/json", "charset=utf-8");
	xhr.onload= function(){
		if(xhr.readyState==4 && xhr.status== 201){
			console.log("success")
			callback();
		}
	}
	xhr.send(objData);
}
function handleDel(e){
	$("msgComfirm").style.display = "block";
	sessionStorage.setItem("idDel", e.parentElement.parentElement.id);	
}
function deleteItem(id,callback){
	var keyName = $("title").children[0].innerHTML;
	var xhr = new XMLHttpRequest();
	xhr.open("DELETE","https://6037a910543504001772304e.mockapi.io/"+ keyName +"/"+ id);
	xhr.onload = function(){
		if(xhr.readyState==4 && xhr.status== 200){
			console.log('success');
			for(var i=0; i<$("contentTable").children.length; i++){
				if($("contentTable").children[i].id==id){
					$("contentTable").deleteRow(i);
				}
			}
			callback();
		}
	}
	xhr.send();
}
function handleEdit(e){
	if($("title").children[0].innerHTML=="Categories"){
		var rowCurrent = e.parentElement.parentElement;
		var objData = JSON.parse(rowCurrent.getAttribute("data-obj"));
		$("popup").style.display="block";
		$("popupContent").children[0].innerHTML="Edit Categories";
		$("btnAdd").innerHTML="Edit";
		$("key").value =objData.key;
		$("Dname").value=objData.name;
		$("Status").value = objData.status
		$("Order").value= objData.order;

		var arrInp = $("popupContent").children[2].children;
		for(var i=0; i<arrInp.length; i++){
			arrInp[i].children[1].onchange=function(){
				objData[this.name] = this.value;
				sessionStorage.setItem("objData", JSON.stringify(objData));
			}
		}
		sessionStorage.setItem("indexEdit", rowCurrent.rowIndex);
	}
}
function handleCheckDel(e){
	var arrRowSelected = sessionStorage.getItem("RowSelected");
	arrRowSelected=(arrRowSelected==null)? [] : JSON.parse(arrRowSelected);
	if(e.checked){
		arrRowSelected.push(e.parentElement.parentElement.id);
	}
	else{
		for(var i=0; i<arrRowSelected.length; i++){
			if(arrRowSelected[i] == e.parentElement.parentElement.id){
				arrRowSelected.splice(i,1);
				break;
			}
		}
	}
	sessionStorage.setItem("RowSelected", JSON.stringify(arrRowSelected));
	console.log(arrRowSelected)
}
function showTable(data){
	var str="";
	for(i=0; i< data.titleTable.length; i++){
		str += `<th>${data.titleTable[i]}</th>`
	}
	$("titleTable").innerHTML = str;
	var str2 =""
	for(i=0; i < data.contentTable.length; i++ ){
		var strTd="";
		strTd+=(data.contentTable[i].key!=undefined)? `<td>${data.contentTable[i].key}</td>` : "";
		strTd+=(data.contentTable[i].name!=undefined)? `<td>${data.contentTable[i].name}</td>` : "";
		strTd+=(data.contentTable[i].value!=undefined)? `<td>${data.contentTable[i].value}</td>` : "";
		if(data.contentTable[i].status!=undefined){
			strTd+=(data.contentTable[i].status=="Enable")? `<td><img src="images/check@1X.png"></td>` :  `<td><img src="images/close@1X.png"></td>`;
		}
		strTd+=(data.contentTable[i].order!=undefined)? `<td>${data.contentTable[i].order}</td>` : "";
		strTd+=`<td><img src="images/edit@1X.png" alt="" onclick=handleEdit(this)></td>`;
		strTd+=(data.tagName!="Configurations")? `<td><img src="images/delete@1X.png" alt="" onclick=handleDel(this)></td>` : "";
		strTd+=(data.tagName!="Configurations")? `<td><input type="checkbox" onclick=handleCheckDel(this)></td>` : "";
		str2 += `<tr id=${data.contentTable[i].id} data-obj= ${JSON.stringify(data.contentTable[i])} >${strTd}</tr>`
	}
	$("contentTable").innerHTML=str2;
}
function responsive(wid){
	if($("title").children[0].innerHTML=="Categories"){
		if(wid.matches){
			process_1("none");
		}
		else{
			process_1("table-cell");
		}
	}
	function process_1(val){
		var table = $("content").children[0].children[0];
		for(var i=0; i< table.children.length;i++){
			for(var j=0; j< table.children[i].children.length; j++){
				table.children[i].children[j].children[3].style.display = val;
				table.children[i].children[j].children[6].style.display = val;
			}
		}
	}
}
window.onload = function(){
	sessionStorage.removeItem("RowSelected");
	// add event for nav menu
	var itemsNav = $("nav").children;
	for(var i=0; i< itemsNav.length;i++){
		itemsNav[i].addEventListener("click", function(){
			for(var i=0;i< itemsNav.length;i++){
				itemsNav[i].style.background="#FFFFFF";
				itemsNav[i].style.color="#000";
			}
			this.style.background="#55642C";
			this.style.color="#FFFFFF";
			$('title').children[0].innerHTML=this.innerHTML;
			$("delAll").style.display=(this.innerHTML=="Categories")? "block" : "none";
			var objData={}, tagName = this.innerHTML, indexTab=this.id;
			switch(this.innerHTML){
				case "Configurations":
					getData(this.innerHTML, function(res){
						objData={
							tagName:tagName,
							titleTable: ["Constant name","Value","Edit"],
							contentTable: res
						}
						showTable(objData);
						responsive(window.matchMedia("(max-width: 600px)"));
					});
					break;
				case "Categories":
					getData(this.innerHTML, function(res){
						res.sort(function(a,b){
							return (a.order>b.order)? 1 : (- 1) ;
						});
						objData={
							tagName:tagName,
							titleTable: ["Key","Display Name","Show/Hide","Order","Edit","Delete","Bulk Delete"],
							contentTable: res
						}
						showTable(objData);
						responsive(window.matchMedia("(max-width: 600px)"));
						sessionStorage.setItem("indexTabCurrent", indexTab);
					});
					break;
				case "Users":
					$("contentTable").innerHTML ="";
					$("titleTable").innerHTML ="";
					responsive(window.matchMedia("(max-width: 600px)"));
					break;
				case "Collectibles":
					$("contentTable").innerHTML ="";
					$("titleTable").innerHTML ="";
					responsive(window.matchMedia("(max-width: 600px)"));
					break;
				default:
					break;
			}
		})
	}
	//------------------------------------
	// active tab config
	$("nav").children[3].dispatchEvent(new Event("click"));
	//---------------------
	// add event for closePopup
	$("closePopup").addEventListener("click", function(){
		$("popup").style.display="none";
		var arrInp = $("popupContent").children[2].children;
		for(var i=0; i<arrInp.length; i++){
		    	arrInp[i].children[1].style.background="#FFFFFF";
		    	arrInp[i].children[1].style.border="1px solid #55642C";
		    	arrInp[i].children[2].style.visibility="hidden";
		    }
		clearPopup();

	});
	//------------
	$("bgPopup").onclick = function(){
		$("closePopup").dispatchEvent(new Event("click"));
	}
	// add event for btn add
	$("addItem").addEventListener("click",function(){
		var tagActive = this.parentElement.parentElement.children[0].innerHTML;
		switch (tagActive){
			case "Configurations":
				//666666
				break;
			case "Categories":
				$("popup").style.display="block";
				$("btnAdd").innerHTML="Add";
				$("Status").value = "Enable";
				var arrInp = $("popupContent").children[2].children;
				var objData = {status: "Enable"}
				for(var i=0; i<arrInp.length; i++){
					arrInp[i].children[1].onchange=function(){
						this.style.background="#FFFFF";
						this.style.border="1px solid #55642C";
						this.parentElement.children[2].style.visibility="hidden";
						objData[this.name] = this.value;
						sessionStorage.setItem("objData", JSON.stringify(objData));
					}
					if(arrInp[i].children[1].name == "order"){
						arrInp[i].children[1].onkeyup = function(){
							var str = this.value;
							str = str.match(/\d/gi);							
							this.value = (str==null)? "" : str.join("");
						}
					}
				}
				break;
			default:
				break;
		}
	})
	//---------------
	//  add event for btn inside popup
	$("btnAdd").onclick=function(){
		var keyName = $("title").children[0].innerHTML;
		var indexTab = sessionStorage.getItem("indexTabCurrent");
		var objData = JSON.parse(sessionStorage.getItem("objData"));
		var indexEdit = sessionStorage.getItem("indexEdit");
		if(checkInp()){
				if(this.innerHTML=="Edit"){
					var xhr = new XMLHttpRequest();
					xhr.open("PUT","https://6037a910543504001772304e.mockapi.io/"+ keyName +"/"+ objData.id);
					xhr.setRequestHeader("Content-type", "application/json", "charset=utf-8");
					xhr.onload = function(){
						if(xhr.readyState==4 && xhr.status== 200){
							console.log('success');
						}
					}
					xhr.send(JSON.stringify(objData));
				}
				else{
					var objData = sessionStorage.getItem("objData");
					postData(keyName,objData,function(){
						 clearPopup();	
					})
				}
			$("popup").style.display="none";
			$("nav").children[indexTab].dispatchEvent(new Event("click"));
			$("nav").children[indexTab].dispatchEvent(new Event("click"));
		}
	}
	// delete item
	var grBtMsg = $("msgComfirm").children[1].children;
	for(var i=0; i<grBtMsg.length; i++){
		grBtMsg[i].onclick = function(){
			if(this.innerHTML=="Delete"){
				var idEdit = sessionStorage.getItem("idDel");
				deleteItem(idEdit,function(){
				})
				$("msgComfirm").style.display = "none";
			}
			else{
				$("msgComfirm").style.display = "none";
			}
		}
	}
	//-------
	// delete items selected
	$("delAll").onclick = function(){
		var arrRowSelected = sessionStorage.getItem("RowSelected");
		if(arrRowSelected != null){
			arrRowSelected = JSON.parse(arrRowSelected);
			var i=0;
			deleteItem(arrRowSelected[i],callback);
			function callback(){
				i++;
				if(i< arrRowSelected.length){
					deleteItem(arrRowSelected[i],callback);
				}
			}
		}
	}
	//-------
	// responsive
	var widIphoneX = window.matchMedia("(max-width: 600px)")
	responsive(widIphoneX);
	widIphoneX.addListener(responsive);
	$("menuRespon").onclick=function(){
		var nav= document.getElementsByTagName("nav")[0];
		nav.style.display=(nav.style.display=="none")? "block" : "none";
	}
	document.body.onclick=function(e){
		if(e.target.id!=="menuRespon"){
			document.getElementsByTagName("nav")[0].style.display="none"
		}
		
	}
}
//--------------------------------------
 function clearPopup(){
 	var arrInp = $("popupContent").children[2].children;
	for(var i=0; i<arrInp.length; i++){
		arrInp[i].children[1].value = "";
	}
}
function checkInp(){
 	var arrInp = $("popupContent").children[2].children;
 	var res = true
	for(var i=0; i<arrInp.length; i++){
	    if(arrInp[i].children[1].value ==""){
	    	arrInp[i].children[1].style.background="#FFEFEF";
	    	arrInp[i].children[1].style.border="1px solid #DBE2BF";
	    	arrInp[i].children[2].style.visibility="visible";
	    	res = false;
	    }
	}
	return res;
}
