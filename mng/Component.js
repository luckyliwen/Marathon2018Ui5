sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
], function(UIComponent, Device) {
	"use strict";

	return UIComponent.extend("csr.mng.Component", {

		metadata: {
			manifest: "json"
		},
	
		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			var currPath = jQuery.sap.getModulePath("csr.mng");
			var pos = currPath.lastIndexOf("/");
			jQuery.sap.registerModulePath('csr.lib', currPath.substr(0, pos)+"/lib" );

			this.getModel().setDefaultCountMode("Inline");
			this.getModel().setDefaultBindingMode("TwoWay");

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);


		}
	});

});