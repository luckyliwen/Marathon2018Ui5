sap.ui.define([
    "sap/ui/unified/FileUploader"
], function(FileUploader) {
	"use strict";

	var FileUploaderExt = FileUploader.extend("csr.lib.FileUploaderExt", {
    metadata : {
        properties : {
        	'fileName'  : {type:"string", defaultValue: "", bindable : "bindable"},

            //whether user modified file and need upload
            "modified" : {type:"boolean", defaultValue: false, bindable : "bindable"},
        },

        events : {
            selectFile : {
                parameters : {
                  fileName: {type : "string"}  
                }
            }
        }
    },

    /*onAfterRendering: function() {

        var id = this.getId();
        var name = this.getProperty("fileName");
        console.error("!!! onAfterRendering ", id, name);
        if (name) {
            var innerId = '#' + id + "-fu_input-inner";
            setTimeout(function() {
                $(innerId).val(name);
            }, 100);
        }
    },*/


    renderer : "sap.ui.unified.FileUploaderRenderer"
});

    FileUploaderExt.prototype.showFileName = function() {
        var id = this.getId();
        var name = this.getProperty("fileName");
        // console.error("!!! showFileName ", id, name);
        if (name) {
            var innerId = '#' + id + "-fu_input-inner";
            setTimeout(function() {
                $(innerId).val(name);
            }, 100);
        }
    },
    

    FileUploaderExt.prototype.init = function(){
        FileUploader.prototype.init.call(this);
        var that = this;

        this.attachChange( function(oEvent) {
            var newValue = oEvent.getParameter("newValue");
            if (newValue) {
                // that.setProperty("fileName", newValue, false);
                that.setProperty("modified", true);

                //also fire event 
                that.fireSelectFile({fileName: newValue});
            }
        });
    };

    FileUploaderExt.prototype.setFileName = function(name) {
        var id = this.getId();
        if (name) {
            var innerId = '#' + id + "-fu_input-inner";
            // console.error("id ", innerId);
            setTimeout(function() {
                $(innerId).val(name);
            }, 100);
        }

        this.setProperty("fileName", name, false);
    }; 

    FileUploaderExt.prototype.getFileName = function() {
        var id = this.getId();
        var innerId = '#' + id + "-fu_input-inner";
        return $(innerId).val();
    }; 


	return FileUploaderExt;
});