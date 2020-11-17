/*
 *             DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *                     Version 2, December 2004
 *
 *  Copyright (C) 2020 IJSE
 *
 *  Everyone is permitted to copy and distribute verbatim or modified
 *  copies of this license document, and changing it is allowed as long
 *  as the name is changed.
 *
 *             DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *    TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *
 *   0. You just DO WHAT THE FUCK YOU WANT TO.
 */

/**
 * @author : Ranjith Suranga <suranga@ijse.lk>
 * @since : 11/15/20
 **/

/*===============================================================================
 * Global Variables
 *===============================================================================*/

// Todo: add all global variable declaration here

var txtID;
var txtName;
var txtAddress;
var tblCustomer;
var customers=[];
var selectedCustomer=null;
var selectedRow=null;
var pagesize=-1;
var pageCount=1;
var startPageIndex=0;
var endPageIndex=-1;
var maxPages=3;

/*===============================================================================
 * Init
 *===============================================================================*/

init();

function init(){
    // Todo: add the initialization code if any
     txtID = document.getElementById("txt-id");
     txtName = document.getElementById("txt-name");
     txtAddress = document.getElementById("txt-address");
     tblCustomer=document.getElementById("tbl-customers");

     txtID.focus();
}

/*===============================================================================
 * Event Handlers and Timers
 *===============================================================================*/

// Todo: add all event listeners and handlers here

    document.getElementById("btn-save").addEventListener("click",saveCustomer);
    document.addEventListener('click',handleClickEventDelegation);
    txtID.addEventListener('input',handleInput);
    txtName.addEventListener('input',handleInput);
    txtAddress.addEventListener('input',handleInput);

/*===============================================================================
 * Functions
 *===============================================================================*/

// Todo: add all functions

function handleClickEventDelegation(event){
    if(event.target){
        var activePage;
        if(event.target.matches('#btn-backward *')){
            activePage=startPageIndex;
            endPageIndex=startPageIndex-1;
            startPageIndex=endPageIndex-(maxPages-1);
            if(startPageIndex<0){
                activePage=1;
                startPageIndex=0;
                endPageIndex=startPageIndex+(maxPages-1);
            }
            initPagination();
            renderPage(activePage);
        }else if(event.target.matches('#btn-forward *')){
            startPageIndex=startPageIndex+maxPages;
            activePage=startPageIndex+1;
            endPageIndex=startPageIndex+(maxPages-1);
            if(startPageIndex>pageCount){
                endPageIndex=-1;
                activePage=pageCount;
            }
            initPagination();
            renderPage(activePage);
        }else if(event.target.matches('li.page-item *')){
            renderPage(+event.target.innerText);
        }
    }
}
function addCustomersToTable(startIndex,endIndex){
    if(endIndex>customers.length){
        endIndex=customers.length;
    }
    for (var i=startIndex; i<endIndex; i++){
         var row=tblCustomer.tBodies.item(0).insertRow(-1);
          row.onclick=handleSelection;

          row.insertCell(0).innerText=customers[i].id;
          row.insertCell(1).innerText=customers[i].name;
          row.insertCell(2).innerText=customers[i].address;

          var trashCell=row.insertCell(3);
          trashCell.innerHTML='<div class="trash" onclick="handleDelete(event)"></div>';
    }
}
function clearTable(){
    for(var i=tblCustomer.tBodies[0].rows.length-1;i>=0;i--){
        tblCustomer.tBodies[0].deleteRow(i);
    }
}
function initPagination(){
    var paginationElm = document.querySelector("#pagination");
    pagesize=-1;
    clearTable();
    if(customers.length>0){
        if((innerWidth<992)&&pagesize===-1){
            pagesize=6;
        }else{
            addCustomersToTable(0,1);
            var topPosition=tblCustomer.tBodies[0].rows[0].getBoundingClientRect().top;
            var rowHeight=tblCustomer.tBodies[0].rows[0].clientHeight;
            var paginationHeight=paginationElm.clientHeight;
            var margin = 40;
            var i=1;

            do{
                var totalHeight=topPosition+(rowHeight*i)+paginationHeight+margin;
                i++;
            }while(totalHeight<document.querySelector("footer").getBoundingClientRect().top);
            pagesize=i-2;
            clearTable();
        }
    }
    if(pagesize===-1){
        pageCount=1;
    }else {
        pageCount=Math.ceil(customers.length/pagesize);
    }

    if(pagesize>1){
        paginationElm.classList.remove("hidden");
    }else{
        paginationElm.classList.add("hidden");
    }

    if(endPageIndex===-1){
        endPageIndex=pageCount;
        startPageIndex=endPageIndex-((endPageIndex%maxPages)==0?maxPages:(endPageIndex%maxPages));
    }
    var html='<li class="page-item" id="btn-backward">' +
        '           <a class="page-link" href="#"><i class="fas fa-backward"></i></a>' +
        '       </li>';
    for (var i=0;i<pageCount;i++){
        if(i>=startPageIndex && i<=endPageIndex){
            html += '<li class="page-item"><a class="page-link" href="#">' + (i + 1) + '</a></li>';
        }else{
            html += '<li class="page-item d-none"><a class="page-link" href="#">' + (i + 1) + '</a></li>';
        }
    }
    html += '<li class="page-item" id="btn-forward">' +
        '          <a class="page-link" href="#"><i class="fas fa-forward"></i></a>' +
        '    </li>';
    document.querySelector(".pagination").innerHTML=html;
    endPageIndex=-1;
}
function renderPage(page){
    if(!page){
        return ;
    }
    if(page<1){
        page=1;
    }
    if(page>pageCount){
        page=pageCount;
    }
    var exActivePage=document.querySelector("#pagination .page-item.active");
    if(exActivePage!==null){
        exActivePage.classList.remove("active");
    }
    document.querySelector('.pagination li:nth-child('+(page+1)+')').classList.add('active');
    toggleBackwardForwardDisability(page);
    clearTable();
    addCustomersToTable((page-1)*pagesize,page*pagesize);
}
function toggleBackwardForwardDisability(page){
    if(page==1){
        document.querySelector('#btn-backward').classList.add('disabled');
    }else{
        document.querySelector('#btn-backward').classList.remove('disabled');
    }
    if (page == pageCount) {
        document.querySelector("#btn-forward").classList.add("disabled");
    } else {
        document.querySelector("#btn-forward").classList.remove("disabled");
    }
}
function handleInput(){
    this.classList.remove('is-invalid');
}
function clearSelection(){
    var rows=document.querySelectorAll('#tbl-customers tbody tr');
    for (var i=0; i<rows.length;i++){
        rows[i].classList.remove("selected");
    }
    txtID.disabled=false;
    selectedRow=null;
    selectedCustomer=null;
}
function handleSelection(event) {
    clearSelection();
    selectedRow=event.target.parentElement;
    selectedRow.classList.add("selected");
    txtID.value=selectedRow.cells[0].innerText;
    txtID.disabled=true;
    txtName.value=selectedRow.cells[1].innerText;
    txtAddress.value=selectedRow.cells[2].innerText;
    selectedCustomer=customers.find(function (c){
        return c.id === selectedRow.cells[0].innerText;
    });
}
function handleDelete(event){
    if(confirm("Are you sure whether you want to delete this customer?")){
        tblCustomer.deleteRow(event.target.parentElement.parentElement.rowIndex);
        txtID.value='';
        txtName.value='';
        txtAddress.value='';
        txtID.disabled=false;
        txtID.focus();
        showOrHideFooter(event);

        customers.splice(customers.findIndex(function (c){
            return c.id===event.target.parentElement.parentElement.cells[0].innerText;
        }),1);
        var activePage = +document.querySelector(".pagination .active").innerText;
        initPagination();
        renderPage(activePage ? activePage : 1);
        showOrHideTFoot();
        event.stopPropagation();
    }
}
function showOrHideFooter(event){
    if(tblCustomer.tBodies.item(0).rows.length>0){
        document.querySelector("#tbl-customers tfoot").classList.add('d-none');
    }else{
        document.querySelector("#tbl-customers tfoot").classList.remove('d-none');
    }
}
function saveCustomer(event){

    if(validateCustomer()){
        if(!selectedCustomer){
            customers.push({
                id:txtID.value,
                name:txtName.value,
                address:txtAddress.value
            });

            initPagination();
            renderPage(Math.ceil(customers.length/pagesize));
            showOrHideFooter();

            txtID.value='';
            txtName.value='';
            txtAddress.value='';
            txtID.focus();
        }else{
            selectedCustomer.name=txtName.value;
            selectedCustomer.address=txtAddress.value;

            selectedRow.cells[1].innerText=txtName.value;
            selectedRow.cells[2].innerText=txtAddress.value;
        }
    }
}
function validateCustomer(){
    txtID.classList.remove("is-invalid");
    txtName.classList.remove("is-invalid");
    txtAddress.classList.remove("is-invalid");

    var validated =true;

    if(txtAddress.value.trim().length<3){
        txtAddress.classList.add("is-invalid");
        txtAddress.select();
        validated =false;
    }
    if(!(/^[A-Za-z][A-Za-z .]{2,}$/.test(txtName.value))){
        txtName.classList.add("is-invalid");
        txtName.select();
        validated=false;
    }
    if(!(/^C\d{3}$/).test(txtID.value)){
        txtID.classList.add("is-invalid");
        document.getElementById("helper-txt-txtID").classList.remove("text-muted");
        document.getElementById("helper-txt-txtID").classList.add("invalid-feedback");
        txtID.select();
        validated=false;
    }
    return validated;
}
