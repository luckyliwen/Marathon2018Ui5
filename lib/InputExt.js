sap.ui.define([
	"sap/m/Input"
], function(Select) {
	"use strict";

	var InputExt = Input.extend("csr.lib.InputExt", {
    metadata : {
        properties : {
        	// 'realValue'  : {type:"string", defaultValue: "", bindable : "bindable"},
        },
    },

    renderer : "sap.m.InputRenderer"
});

    Input.prototype.init = function() {
        InputBase.prototype.init.call(this);
    }

   
	return InputExt;
});