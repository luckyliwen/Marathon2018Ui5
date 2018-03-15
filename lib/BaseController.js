sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"csr/lib/Config",
	"csr/lib/Enum",
], function(Controller, Config, Enum) {
	"use strict";

	/*
        Common base class for the controllers of this app containing some convenience methods
    */
	return Controller.extend("csr.lib.BaseController", {
		onInit : function() {
			this.mConfiugure = Config.getConfigure();
			this.oDateTimeFormatter = sap.ui.core.format.DateFormat.getDateTimeInstance();

			this.setModel(Config.getModel(), "cfg");
		},

		/**
		 * Convenience method for accessing the router in each controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName) || this.getOwnerComponent().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resource model of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Convenience method to get the global model containing the global state of the app.
		 * @returns {object} the global Propery model
		 */
		getGlobalModel: function() {
			return this.getOwnerComponent().getModel("globalProperties");
		},

		
		fmtStatus: function( status ) {
		    if (status == Enum.Status.Approved) {
		    	return "Success";
		    } else if (status == Enum.Status.Rejected) {
		    	return "Error";
		    } else {
		    	return "None";
		    }
		},


		fmtBirthday: function( value ) {
		    if (!value)
		    	return "";
		    else {
		    	var d = new Date(value);
		    	var y = d.getFullYear();
		    	var m = d.getMonth() + 1;
		    	var day = d.getUTCDate(); 
		    	if (m<10) m = '0' + m;
		    	if (day < 10) day = '0' + day;
		    	return y + "-" + m + "-" + day;
		    }
		},
		
		//convert normal yyyy-mm-dd to 2016-02-13T10:39:50.207
		fmtDateToODataDate: function( value ) {
		    return value + "T00:00:00.000";
		},

		fmtTime: function( val ) {
		    if (val) {
		    	return this.oDateTimeFormatter.format(val);
		    } else {
		    	return "";
		    }
		},
		
		fmtUserHref: function( id ) {
			if (!id)
				return "";
			else 
		    	return "https://people.wdf.sap.corp/profiles/" + id;
		}
		
	});
});