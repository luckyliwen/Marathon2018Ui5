sap.ui.define([
    "sap/m/Image",
    "sap/m/ImageRenderer",
	"sap/ui/core/Control",
    "sap/ui/commons/Callout"
], function(Image, ImageRenderer,  Control,Callout) {
	"use strict";

	var Attachment = Control.extend("csr.lib.Attachment", {
    metadata : {
        properties : {
        	'fileName': {type:"string", defaultValue: "", bindable : "bindable"},
            'mime'    : {type:"string", defaultValue: "", bindable : "bindable"},
            'src'     : {type:"sap.ui.core.URI", defaultValue: "", bindable : "bindable"},
            "width"     :   {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : '200px'},
            "height"     :   {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : '200px'}
        },
    },

    /*renderer : function(oRm, oControl) {
        if (oControl.isImage()) {
            ImageRenderer.render.call(this,oRm,oControl);
            return;
        }
    }*/

    renderer : function(oRm, oControl) {
        oRm.write("<div");
        oRm.writeControlData(oControl);
        oRm.writeStyles();
        oRm.writeClasses();
        oRm.write(">");

        if ( oControl.isImage()) {
            oRm.renderControl(oControl.oImage);
        } else {
            var html = oControl.createEmbedPdf(false);
            oControl.oEmbed.setContent(html);
            oRm.renderControl( oControl.oBox);
            // oRm.renderControl( oControl.oEmbed );
            /*var content = '<embed src="' + oControl.getSrc() + '" width="' + oControl.getWidth()
                        + '" height="' + oControl.getHeight() + '" />';
            oRm.write(content);*/
        }

        oControl.createTooltip();

        oRm.write("</div>");
    }
    
});

    Attachment.prototype.createEmbedPdf = function(bTooltip) {
        var content;
        if (!bTooltip) {
            content = '<embed src="' + this.getSrc() + '" width="' + this.getWidth()
                        + '" height="' + this.getHeight() + '" />';
        } else {
            content = '<embed src="' + this.getSrc() + '" width="1024px" height="768px" />';
        }
        
        return content;
    };

    Attachment.prototype.init = function() {
        this.oImage = new Image({
            width: this.getWidth(),
            height: this.getHeight()
        });
        this.oTooltipImage = new Callout({
            atPosition: 'center center'
        });
        this.oImage.setTooltip(this.oTooltipImage);

        this.oBox = new sap.m.VBox();
        this.oEmbed  = new sap.ui.core.HTML();
        this.oBox.addItem(this.oEmbed);
        this.oTooltipPdf = new Callout({
            atPosition: 'center center'
        });
        this.oBox.setTooltip( this.oTooltipPdf );
        // this.oEmbed.setTooltip( this.oTooltipPdf );
    };

    Attachment.prototype.setSrc = function(sSrc) {
        this.oImage.setSrc(sSrc);
        this.setProperty('src', sSrc);

        //in order to get src and mine together, so get mine here 
        if (sSrc) {
            var bc =this.getBindingContext();
            var binding  = this.getBinding('src');
            var path = binding.getPath();
            //it like Photo/src, so need replace the src with MineType
            path = path.split('/')[0]; 
            path += "/MimeType"
            var mine = bc.getProperty(path, bc);
            if (mine) {
                this.setMime(mine);
            }
        }
    };

    Attachment.prototype.setMime = function(m) {
        this.setProperty('mime', m, true);
    };

    Attachment.prototype.setWidth = function(w) {
        this.oImage.setWidth(w);
        this.setProperty('width', w);
    };

    Attachment.prototype.setHeight = function(h) {
        this.oImage.setHeight(h);
        this.setProperty('height', h);
    };

    Attachment.prototype.isImage = function() {
        var mime = this.getMime();
        if (mime.indexOf("image/")!= -1)
            return true;
        else
            return false;
    };
   
    Attachment.prototype.createTooltip = function( evt ) {
        var content;
        var mine = this.getMime();
        if (!mine) {
            return;
        }

        if (this.isImage()) {
            content = new sap.m.Image({
                src: this.getSrc()
            });

            this.oTooltipImage.removeAllContent();
            this.oTooltipImage.addContent(content);
         
        } else {
            // var html = '<embed src="' + this.getSrc() + '" width="800px" height="800px" />';
            var html = this.createEmbedPdf(true);
            content = new sap.ui.core.HTML({
                content: html
            });

            this.oTooltipPdf.removeAllContent();
            this.oTooltipPdf.addContent(content);
        }
    };
    
	return Attachment;
});