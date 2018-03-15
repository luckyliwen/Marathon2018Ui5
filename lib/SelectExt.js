sap.ui.define([
	"sap/m/Select"
], function(Select) {
	"use strict";

	var mySelect = Select.extend("csr.lib.SelectExt", {
    metadata : {
        properties : {
        	'realValue'  : {type:"string", defaultValue: "", bindable : "bindable"},
            "enableAdditionalText" : {type:"boolean", defaultValue: false, bindable : "bindable"},
        },
    },
    
    /*setRealValue: function( value) {
        // this.setSelectedKey(value);
        this.setProperty('realValue', value);
    },*/

    setEnableAdditionalText: function( flag ) {
        this.setProperty('enableAdditionalText', flag);
    },
    
    //in ie and Chrome, the key order is different, so when set the name,the enableAdditionalText not set
    //in order for simple binding, the name is same as the value list binding 
    setName: function( name) {
        this.setProperty('name', name);

        var path = "cfg>/" + name + "/list";
        var template ;
        /*if ( !!this.getEnableAdditionalText()) {
            template = new sap.ui.core.ListItem({
                // text: "{cfg>name} -- {cfg>text}",
                text: "{cfg>textExt}",
                key:  "{cfg>name}",
                // additionalText: "{cfg>text}"
            });
        } else {
            template = new sap.ui.core.Item({
            	text: "{cfg>name}",
            	key:  "{cfg>name}"
            });
        }*/

    template = new sap.ui.core.Item({
            key:  "{cfg>name}",
             text: {
                parts: [
                    {path: "cfg>text"},
                    {path: "cfg>name"}
                ],
                formatter: function(text,name) {
                    if (text) {
                        // return name + " -- " +  text;
                        return text;
                    }
                    else 
                        return name;
                }
                
            }});

        this.bindItems(path, template);

        //the realValue also set from the name 
        // var bindPath = "/" + name; 
        // this.bindProperty('realValue', bindPath);

        this.attachChange( function(oEvent) {
        	var source = oEvent.getSource();
        	source.setRealValue( source.getSelectedKey() );
        });
    },
    
    renderer : "sap.m.SelectRenderer"
});

	return mySelect;
});