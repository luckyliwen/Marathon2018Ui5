sap.ui.define([
    "csr/lib/UserLink",
	"sap/m/HBox"
], function(UserLink, HBox) {
	"use strict";

    //as it is the template of the Column, so can't use the factory binding
	var Member = HBox.extend("csr.lib.Member", {
    metadata : {
        properties : {
            //format like id:name;
        	'nameList'  : {type:"string", defaultValue: "", bindable : "bindable"}
        },
    },

    renderer : "sap.m.HBoxRenderer"
});

    Member.prototype.setNameList = function( names ) {
        //here need first delete all old list, otherwise it will add more and more 
        this.removeAllItems();
        
        if (names) {
            var aName = names.split(";");
            for (var i=0; i < aName.length; i++) {
                var  name = aName[i].trim();
                if (name.length) {
                    //id:name
                    var aUser = name.split(":");
                    var link = new UserLink({userId: aUser[0],  text: aUser[1]});
                    link.addStyleClass("MarginRight");
                    this.addItem(link);
                }
            }
        }
    };
    
	return Member;
});