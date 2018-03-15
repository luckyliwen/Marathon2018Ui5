sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device"
], function(UIComponent, Device) {
	"use strict";

	//first load some common used controls
	// jQuery.sap.require("sap.m.Label");
	// jQuery.sap.require("sap.m.Text");

	return UIComponent.extend("csr.explore.Component", {

		metadata: {
			manifest: "json"
		},
	
		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			var currPath = jQuery.sap.getModulePath("csr.explore");
			var pos = currPath.lastIndexOf("/");
			jQuery.sap.registerModulePath('csr.lib', currPath.substr(0, pos)+"/lib" );

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			this.getModel().setDefaultCountMode("Inline");
		}
	});

});