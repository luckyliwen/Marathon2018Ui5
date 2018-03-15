var gf,gc,gm, gsel;
sap.ui.define([
	"csr/lib/BaseController",
	"csr/lib/Enum",
	"csr/lib/Config",
	"csr/lib/Util",
	'sap/ui/model/json/JSONModel',
], function(BaseController, Enum, Config, Util,JSONModel) {
	"use strict";

var ControllerController = BaseController.extend("csr.explore.controller.Explore", {
	onInit:function() {
		BaseController.prototype.onInit.call(this);

		gc = this; 
		this.oDataModel = this.getModel();
		this.oDataModel.setUseBatch(false);
		//default is 100 then dowload have issue
		this.oDataModel.setSizeLimit(1000);

		this.oRegTable = this.byId('registrationTable');
		
		Util.setTableColumnsFilterSortProperty(this.oRegTable);
		
		this.oVizBox = this.byId("vizBox");
		this.oRegViz = this.byId("registrationViz");
		
		this.userId = "";
		this.oModel = new JSONModel(); 
		this.oVizBox.setModel( this.oModel);
		this.mSta = {};

		//try load /Registrations now
		this.oRegTable.bindRows({
				path: "/Registrations",
				sorter: [new sap.ui.model.Sorter("Status")],
				// filters: [new sap.ui.model.Filter("Status", 'EQ', 'Approved')]
			});
	},

	adjustViewByRole: function( bAdmin ) {
	    if (bAdmin) {
	    } else {
	    	var cols = ["EmailCol", "PhoneCol", "NationalityCol"];
	    	for (var i=0; i < cols.length; i++) {
	    		var col = this.byId(cols[i]);
	    		this.oRegTable.removeColumn( col );
	    	}
	    }

	    //for some reg table need remove for legal reason
	    //
	},
	
	

	initVizPart: function( evt ) {
		this.setVizPartProp();	    

        //and try to get the result 
        var that = this;

		function onGetStatisticsSuccess(oData) {
			that.byId("vizBox").setBusy(false);
			
			var content = oData.GetStatistics;
			that.mSta  = JSON.parse(content);

		//as now it will include the special donation, so for the /Receive and /Giving 
		//we need exclude it if there   "SAP (SAP)"   "SAP Dalian Club (SAPDALIAN)"  "SAP Run Club (SAPRUNCLUB)
			var aDel=[];
		
			
			that.oModel.setData( that.mSta);
			// this.oRegViz.setModel(dataModel);
			// 
		}

        function onGetStatisticsError(error) {
			that.byId("vizBox").setBusy(false);
			Util.showError("Failed to get my Statistics.", error);
		}

	    this.oDataModel.callFunction("/GetStatistics", {
	    	urlParameters: { Top: "13", '$format': "json"},
			method: "GET",
			success: onGetStatisticsSuccess,
			error: onGetStatisticsError
		});

		that.byId("vizBox").setBusy(false);
	},

	setVizPartProp: function( evt ) {
		if (this.bAlreadySetVizProp)
			return;

	    this.oRegViz.setVizProperties({
                plotArea: {
                    dataLabel: {
                        // formatString:CustomerFormat.FIORI_LABEL_SHORTFORMAT_2,
                        visible: true
                    }
                },
                valueAxis: {
                    // label: {
                    //     formatString: CustomerFormat.FIORI_LABEL_SHORTFORMAT_10
                    // },
                    title: {
                        visible: true
                    }
                },
                categoryAxis: {
                    title: {
                        visible: true
                    }
                },
                title: {
                    visible: true,
                    text: 'Registratration count by status'
                }
        });

 		
        this.bAlreadySetVizProp = true;
	},
	
	
	

	onTconTabBarSelectChanged: function( evt ) {
	    var selKey = evt.getSource().getSelectedKey();
	    var visible = (selKey == "Registrations");
	    this.byId("emailBtn").setVisible( visible );
	},
	

	onRegistrationTableRowSelectChanged: function( evt ) {
	    //only the Approved can donate
	    var selIdx = this.oRegTable.getSelectedIndices();
	    var bHasOneApproved = false;
		for (var i=0; i < selIdx.length; i++) {
			var context = this.oRegTable.getContextByIndex( selIdx[i]);
			var status = context.getProperty("Status");
			if (status == "Approved") {
				bHasOneApproved = true;
				break;
			}
		}
	    this.byId("donateBtn").setEnabled( bHasOneApproved );
	    this.byId("emailBtn").setEnabled( selIdx.length > 0 );
	},

	onSendEmailPressed_old:function( evt ) {
		var selIdx = this.oRegTable.getSelectedIndices();
		var url = "mailto:";
		for (var i=0; i < selIdx.length; i++) {
			var context = this.oRegTable.getContextByIndex( selIdx[i]);
			var email = context.getProperty("Email");
			if(i>0) {
				url+=";" ;
			}
			url += email;
		}
		window.open(url, "_parent");
	},

	

	onSendEmailPressed : function( evt ) {
		if (!this.oSendEmailDialog) {
			this.oSendEmailDialog = sap.ui.xmlfragment(this.getView().getId(), "csr.explore.view.SendEmailDialog", this);
		}

		var selIdx = this.oRegTable.getSelectedIndices();
		var url="";
		for (var i=0; i < selIdx.length; i++) {
			var context = this.oRegTable.getContextByIndex( selIdx[i]);
			var email = context.getProperty("Email");
			if(i>0) {
				url+=";" ;
			}
			url += email;
		}
		this.byId("emailAddress").setValue(url);
		this.oSendEmailDialog.open();

		var that = this;
		setTimeout(	function( evt ) {
		    that.byId("emailAddress").selectText(0,  url.length);
		}, 0);

	},

	onSendEmailClosePressed: function( evt ) {
	    this.oSendEmailDialog.close();
	},

	
	onDelayedRadioChangeFunc: function( evt ) {
	    var otherRadio = this.byId("otherAmountBtn");

   	 	// var sel = evt.getSource().getSelected();
    	var sel = otherRadio.getSelected();
    	this.byId("otherAmountInput").setEnabled(sel);

    	if (sel) {
    		//now need check whether have input the other amount 
    		this.onOtherAmountChanged();
    	} 
	},

	
	onTableExportPressed: function( evt ) {
		var source = evt.getSource();
		var id = source.getId();
		var pos = id.lastIndexOf("-");
		var tableId = id.substr(pos+1);

		var table = this.byId(tableId);
	    Util.exportTableContent(table, tableId+".csv");
	},

	onStatisticsExportPressed: function( evt ) {
	    var ret = ["Registration"];
	    ret.push("Status,Count"); 
	    for (var i=0; i < this.mSta.Registration.length; i++) {
	    	var  item = this.mSta.Registration[i];
	    	ret.push( item.Status + "," + item.Count);
	    }

	    var content = ret.join("\r\n");
	    Util.saveToFile(content, "Statistics.csv");
	}
});
	//global data 
	// mRegister:  //the register information
	//oFooterBar	
	//oSubmitBtn, oCancelBtn, oSaveBtn
	//oUploaderId, oUploaderPhoto, oUploaderForm
	return ControllerController;
});