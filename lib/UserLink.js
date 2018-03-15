sap.ui.define([
	"sap/m/Link",
    "sap/ui/commons/Callout",
    "sap/m/VBox",
    "sap/m/Image"
], function(Link, Callout, VBox, Image) {
	"use strict";

	var UserLink = Link.extend("csr.lib.UserLink", {
    metadata : {
        properties : {
        	'userId'  : {type:"string", defaultValue: "", bindable : "bindable"},
        },
    },

    renderer : "sap.m.LinkRenderer"
});

    UserLink.prototype.setUserId = function(id) {
        if (id)
            this.setHref("https://people.wdf.sap.corp/profiles/" + id);
        
        this.setProperty("userId", id);
    }

    UserLink.prototype.init = function() {
        if ( Link.prototype.init != null)
            Link.prototype.init.call(this);
        
        this.setTarget("_blank");
        
       /* var that = this;
        var image  = new Image();
        this.oImage = image;
        
        this.oTooltip = new Callout({
            content:  new VBox({
                items: [
                    new Link({
                        text: "See detail profile",
                        press: [this.onProfileLinkPressed, this]
                    }),

                    image
                ]
            })
        });*/
        // this.setTooltip( this.oTooltip );
    };

    /*UserLink.prototype.onProfileLinkPressed = function(  ) {
        var url = "https://people.wdf.sap.corp/profiles/" + this.getText();
        window.open(url, "_blank");
    };*/
    
    UserLink.prototype.setText = function( txt ) {
        Link.prototype.setText.call(this,txt);
        /*if (txt) {
            var url = "https://avatars.wdf.sap.corp/avatar/" + txt; 
            this.oImage.setSrc( url );
        }*/
    };
    
	return UserLink;
});