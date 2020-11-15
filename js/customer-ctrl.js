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

var btnSave = document.getElementById("btn-save");
var btnClear = document.getElementById("btn-clear");
var txtID = document.getElementById("txt-id");
var txtName = document.getElementById("txt-name");
var txtAddress = document.getElementById("txt-address");

/*===============================================================================
 * Init
 *===============================================================================*/

init();

function init(){
    // Todo: add the initialization code if any
    txtID.focus();
}

/*===============================================================================
 * Event Handlers and Timers
 *===============================================================================*/

// Todo: add all event listeners and handlers here
btnSave.addEventListener("click",saveCustomer);

/*===============================================================================
 * Functions
 *===============================================================================*/

// Todo: add all functions
function saveCustomer(){
    if(txtAddress.value.length==0){
        txtAddress.focus();
        txtAddress.classList.add("invalid");
    }else if((/[^A-Za-z .]/).test(txtAddress.value)){
        txtAddress.focus();
        txtAddress.select();
        txtAddress.classList.add("invalid");
    }else if(txtAddress.value.trim().replace(' ',"").length<3){
        txtAddress.focus();
        txtAddress.select();
        txtAddress.classList.add("invalid");
    }
}
