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

     txtID = $("#txt-id");
     txtName = $("#txt-name");
     txtAddress = $("#txt-address");
     tblCustomer=$("#tbl-customers");

     txtID.focus();
}

/*===============================================================================
 * Event Handlers and Timers
 *===============================================================================*/

// Todo: add all event listeners and handlers here

    $("#btn-save").on("click",saveCustomer);
    $("#btn-clear").on("click",clearFiels);
    $(document).on('click',handleClickEventDelegation);
    txtID.on('input',handleInput);
    txtID.on('input',validateCusID);
    txtName.on('input',handleInput);
    txtAddress.on('input',handleInput);

/*===============================================================================
 * Functions
 *===============================================================================*/

// Todo: add all functions

function handleClickEventDelegation(event){
    if(event.target){
        var activePage;
        if($(event.target).is('#btn-backward *')){
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
        }else if($(event.target).is('#btn-forward *')){
            startPageIndex=startPageIndex+maxPages;
            activePage=startPageIndex+1;
            endPageIndex=startPageIndex+(maxPages-1);
            if(startPageIndex>pageCount){
                endPageIndex=-1;
                activePage=pageCount;
            }
            initPagination();
            renderPage(activePage);
        }else if($(event.target).is('li.page-item *')){
            renderPage(+event.target.innerText);
        }
    }
}
function addCustomersToTable(startIndex,endIndex){
    if(endIndex>customers.length){
        endIndex=customers.length;
    }
    for (var i=startIndex; i<endIndex; i++){
         $("#tbl-customers tbody").append('<tr onclick="handleSelection(event)">' +
             '<td>'+customers[i].id+'</td>' +
             '<td>'+customers[i].name+'</td>' +
             '<td>'+customers[i].address+'</td>' +
             '<td><div class="trash" onclick="handleDelete(event)"></div></td>' +
             '</tr>');
    }
}
function clearTable(){
    for(var i=$("#tbl-customers>tbody>tr").length-1;i>=0;i--){
        $("#tbl-customers>tbody>tr").remove(i);
    }
}
function initPagination(){
    var paginationElm = $("#pagination");
    pagesize=-1;
    clearTable();
    if(customers.length>0){
        if((innerWidth<992)&&pagesize===-1){
            pagesize=6;
        }else{
            addCustomersToTable(0,1);
            var topPosition=($("#tbl-customers>tbody>tr:first").offset().top);
            var rowHeight=$("#tbl-customers>tbody>tr:first").innerHeight();
            var paginationHeight=paginationElm.innerHeight();
            var margin = 40;
            var i=1;

            do{
                var totalHeight=topPosition+(rowHeight*i)+paginationHeight+margin;
                i++;
            }while(totalHeight<$("footer").offset().top);
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
        paginationElm.removeClass("hidden");
    }else{
        paginationElm.addClass("hidden");
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
    $(".pagination").html(html);
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
    var exActivePage=$("#pagination .page-item.active");
    if(exActivePage!==null){
        exActivePage.removeClass("active");
    }
    $(".pagination li:nth-child("+(page+1)+")").addClass("active");
    toggleBackwardForwardDisability(page);
    clearTable();
    addCustomersToTable((page-1)*pagesize,page*pagesize);
}
function toggleBackwardForwardDisability(page){
    if(page==1){
        $('#btn-backward').addClass('disabled');
    }else{
        $('#btn-backward').removeClass('disabled');
    }
    if (page == pageCount) {
        $("#btn-forward").addClass("disabled");
    } else {
        $("#btn-forward").removeClass("disabled");
    }
}
function handleInput(){
    $(this).removeClass('is-invalid');
}
function clearSelection(){
    for (var i=1; i<=$("#tbl-customers>tbody>tr").length;i++){
        $("#tbl-customers>tbody>tr:nth-child("+i+")").removeClass('selected');
    }
    txtID.disabled=false;
    selectedRow=null;
    selectedCustomer=null;
}
function handleSelection(event) {
    clearSelection();
    selectedRow=$(event.target).parent();
    selectedRow.addClass('selected');
    txtID.val(selectedRow.children('td:first').text());
    txtID.attr("disabled",true);
    txtName.val(selectedRow.children('td:nth-child(2)').text());
    txtAddress.val(selectedRow.children('td:nth-child(3)').text());
    selectedCustomer=customers.find(function (c){
        return c.id === selectedRow.children('td:first').text();
    });
}
function handleDelete(event){
    if(confirm("Are you sure whether you want to delete this customer?")){
        var index=$(event.target).parent().parent().index();
        $("#tbl-customers>tbody>tr:nth-child("+index+")").remove();
        txtID.val("");
        txtName.val("");
        txtAddress.val("");
        txtID.attr("disabled",false);
        txtID.focus();
        showOrHideFooter(event);

        customers.splice(customers.findIndex(function (c){
            return c.id===$(event.target).parent().parent().children('td:first').text();
        }),1);
        var activePage = +$(".pagination .active").text();
        initPagination();
        renderPage(activePage ? activePage : 1);
        showOrHideFooter();
        event.stopPropagation();
    }
}
function showOrHideFooter(event){
    if($("#tbl-customers>tbody>tr").length>0){
        $("#tbl-customers tfoot").addClass('d-none');
    }else{
        $("#tbl-customers tfoot").removeClass('d-none');
    }
}
function saveCustomer(event){

    if(validateCustomer()){
        if(!selectedCustomer){
            customers.push({
                id:txtID.val(),
                name:txtName.val(),
                address:txtAddress.val()
            });

            initPagination();
            renderPage(Math.ceil(customers.length/pagesize));
            showOrHideFooter();

            txtID.val("");
            txtName.val("");
            txtAddress.val("");
            txtID.focus();
        }else{
            selectedCustomer.name=txtName.val();
            selectedCustomer.address=txtAddress.val();

            selectedRow.children('td:nth-child(2)').text(txtName.val());
            selectedRow.children('td:nth-child(3)').text(txtAddress.val());
        }
    }
}
function validateCustomer(){
    txtID.removeClass("is-invalid");
    txtName.removeClass("is-invalid");
    txtAddress.removeClass("is-invalid");

    var validated =true;

    if(txtAddress.val().trim().length<3){
        txtAddress.addClass("is-invalid");
        txtAddress.select();
        validated =false;
    }
    if(!(/^[A-Za-z][A-Za-z .]{2,}$/.test(txtName.val()))){
        txtName.addClass("is-invalid");
        txtName.select();
        validated=false;
    }
    if(!(/^C\d{3}$/).test(txtID.val())){
        txtID.addClass("is-invalid");
        $("#helper-txt-txtID").removeClass('text-muted');
        $("#helper-txt-txtID").addClass('invalid-feedback');
        txtID.select();
        validated=false;
    }
    if(!validateCusID()){
        txtID.select();
        validated=false;
    }
    return validated;
}
function clearFiels(){
    txtID.val('');
    txtID.attr("disabled",false);
    txtID.focus();
    txtName.val('');
    txtAddress.val('');
    clearSelection();
    selectedRow=null;
    selectedCustomer=null;
}
function validateCusID(){
    var validCusID=true;
    for(var i=0;i<customers.length;i++){
        if(customers[i].id===$("#txt-id").val()){
            validCusID=false;
            txtID.addClass("is-invalid");
            $("#helper-txt-txtID").text("Sorry,This Customer ID already exist.");
            $("#helper-txt-txtID").removeClass('text-muted');
            $("#helper-txt-txtID").addClass('invalid-feedback');
            return validCusID;
        }else{
            validCusID=true;
            $("#helper-txt-txtID").text("The Customer ID should follow the pattern CXXX; X={0-9}");
            $("#helper-txt-txtID").removeClass('invalid-feedback');
            $("#helper-txt-txtID").addClass('text-muted');
        }
    }
    return validCusID;
}
