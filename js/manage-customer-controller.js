var btnSave = document.getElementById("btnSave");
var tblCustomers = document.getElementById("tblCustomers");
// tblCustomers.tBodies.item(0).innerHTML = "";

btnSave.onclick = function(){
  var id = document.getElementById("txtCustomerId").value;
  var name = document.getElementById("txtCustomerName").value;
  var address = document.getElementById("txtCustomerAddress").value;
  
  var newRow = tblCustomers.insertRow();
/*  var cellId = newRow.insertCell();
  cellId.innerText = id;
  var cellName = newRow.insertCell();
  cellName.innerText = name;
  var cellAddress = newRow.insertCell();
  cellAddress.innerText = address;*/

/*  newRow.insertCell().innerText = id;
  newRow.insertCell().innerText = name;
  newRow.insertCell().innerText = address;*/

  newRow.innerHTML = "<td>" + id + "</td><td>" + name + "</td><td>" + address + "</td>"

  document.getElementById("txtCustomerId").value = "";
  document.getElementById("txtCustomerName").value = "";
  document.getElementById("txtCustomerAddress").value = "";
  document.getElementById("txtCustomerId").focus();
};

