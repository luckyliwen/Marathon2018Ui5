sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device"
	// "csr/lib/Config",
	// "csr/lib/SelectExt"
], function(UIComponent, Device/*, Config,SelectExt*/) {
	"use strict";

	return UIComponent.extend("csr.register.Component", {

		metadata: {
			manifest: "json"
		},
	
		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			var currPath = jQuery.sap.getModulePath("csr.register");
			var pos = currPath.lastIndexOf("/");
			jQuery.sap.registerModulePath('csr.lib', currPath.substr(0, pos)+"/lib" );

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			this.getModel("odata").setDefaultCountMode("Inline");
		}
	});

});