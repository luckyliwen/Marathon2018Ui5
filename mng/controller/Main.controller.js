var gf,gc,gm, gsel;
sap.ui.define([
	"csr/lib/BaseController",
	"csr/lib/Enum",
	"csr/lib/Config",
	"csr/lib/Util",
	"sap/ui/model/type/DateTime"
], function(BaseController, Enum, Config, Util,DateTime) {
	"use strict";

var ControllerController = BaseController.extend("csr.mng.controller.Main", {
	onInit:function() {
		BaseController.prototype.onInit.call(this);

    	gf = this.byId("detailForm");
		gc = this; 

		this.oDataModel = this.getModel();
		this.oDataModel.setUseBatch(false);

		this.oList = this.byId('registrationList');
		this.oPage = this.byId("detailPage");
		this.oForm = this.byId('detailForm');		
		this.oPanel = this.byId('attachmentPanel');
		this.currentUserId = "";
		this.currentBindingpath = "";
		this.hasFreeSeat = false;

		this.byId("deleteBtn").setEnabled(false);
		this.byId("approveBtn").setEnabled(false);
		this.byId("rejectBtn").setEnabled(false);

		var oModel = new sap.ui.model.json.JSONModel();
		this.mAttachment = {};
    	oModel.setData( this.mAttachment );
    	this.oPanel.setModel(oModel);

    	//oListItemTemplate
    	this.createListTemplate();
    	this.bindList();

		this.getRegistrationInfo();

    	this.oDataModel.attachRequestCompleted(this.onODataRequestCompleted, this);
	},

	onNormalVipSegmentSelected: function( evt ) {
	    this.bindList();
	},
	

	onODataRequestCompleted: function( oData ) {
	    // console.error(oData);
	},
	
	bindList: function( ) {
		var aFilter = [new sap.ui.model.Filter("Status", 'EQ', 'Submitted')];
		var key = this.byId("segmentBtn").getSelectedButton();
		if (!key) 
			key = "";

		if (key.indexOf("otherSegment") != -1) {
			aFilter = [new sap.ui.model.Filter("Status", 'NE', 'Submitted')];
			this.oList.bindItems({
		    	path: "/Registrations",
		    	filters: aFilter,
		    	template: this.oListItemTemplate
			} );
		} else {

			var bVip = (key.indexOf("vipSegment") != -1);

			if (bVip) {
				aFilter.push( new sap.ui.model.Filter("Vip", 'EQ', true));
			} else {
				aFilter.push( new sap.ui.model.Filter("Vip", 'EQ', false));
			}

			this.oList.bindItems({
		    	path: "/Registrations",
		    	filters: aFilter,
		    	sorter: [new sap.ui.model.Sorter("SubmittedTime")],
		    	template: this.oListItemTemplate
			} );
		}
	    
		this.onListSelectionChanged();
	    jQuery.sap.delayedCall(0, this, this.attachDataReceivedEvent);
	},

	attachDataReceivedEvent: function(  ) {
	    var binding = this.oList.getBinding('items');
	    if (binding) {
	    	binding.attachDataReceived(this.onListDataReceived, this);
	    }
	},
	
	
	onListDataReceived: function( oEvent ) {
	    var items = this.oList.getItems();
	    if (items && items.length>0) {
	    	this.oList.setSelectedItem( items[0]);
			this.onListSelectionChanged();
	    }
	},
	
	createListTemplate: function(  ) {
	    var item = new sap.m.ObjectListItem({
	    	title: "{UserId}",
	    	number: "{LastName}, {FirstName}",
	    	firstStatus: new sap.m.ObjectStatus({
	    			text: "{Status}",
	    			state:  {
	    				path: 'Status', 
	    				formatter: this.fmtStatus
	    			}
	    		}),
	    	
	    	attributes: new sap.m.ObjectAttribute({
						text: {
							path: "SubmittedTime",
							type:  new sap.ui.model.type.DateTime({
								style: "medium",
								pattern: "MM/dd HH:mm:ss"
							})
						}
				   })
	    });
	    this.oListItemTemplate = item;
	},

	onListSelectionChanged: function(  ) {
	    var selItem = this.oList.getSelectedItem();
	    if (!selItem) {
	    	this.oPage.unbindElement();
	    	this.currentUserId = "";
	    	this.currentBindingpath = "";
	    } else {
	    	var binding = selItem.getBindingContext();

	    	this.getUploadedAttachmentInfo(binding);
	    	this.currentUserId = binding.getProperty("UserId");
	    	this.currentBindingpath = binding.getPath();

			this.oPage.bindElement( binding.getPath());
	    }
	},
	
	getUploadedAttachmentInfo: function( binding ) {
		var userId = binding.getProperty("UserId");
		var bindPath = "/" + userId;

		var nationality = binding.getProperty("Nationality");
		var residenceFlag = (nationality != "Chinese"); 
		this.byId("residenceAttachmentBox").setVisible(residenceFlag);

		if ( userId in this.mAttachment) {
			this.oPanel.bindElement(bindPath);
			return ;
		}

		// var url = Util.getMyAttachmentUrl( userId );
		var that = this;

		function onGetUploadAttachmentSuccess(oData) {
			that.oPanel.setBusy(false);
			var mData = {};

			for (var i=0; i < oData.results.length; i++) {
				var  attachment = oData.results[i];
				var type = attachment.Type;
				//if use relative, then for the pdf it can't get, so just tmp change it
				attachment.src = Util.getRelativeAttachmentDownloadUrl(userId, type);

				mData[ type ] = attachment;
			}

			that.mAttachment[userId] = mData;

			//??need check whether has switched 
			if (userId == that.currentUserId) {
				that.oPanel.bindElement(bindPath);
			}
		}

		function onGetUploadAttachmentError(error) {
			that.oPanel.setBusy(false);
			Util.showError("Failed to get Attachment information for ." + userId, error);
		} 

		//by default the initial file name is ""
		this.oPanel.setBusy(true);

	    this.oDataModel.read("/Attachments", {
	    	filters: [new sap.ui.model.Filter("UserId", 'EQ', userId )],
			success: onGetUploadAttachmentSuccess,
			error:  onGetUploadAttachmentError
		});
	},
	
	getRegistrationInfo: function( evt ) {
		var that = this;
	    function onRegistrationSuccess(oData) {
	    	var content = oData.GetRegistrationInfo;
			var data  = JSON.parse(content);
			//if the normal approved is 0, then don't have any number by department, need add here
			var aDep = ["GCO", "LABS","DBS"];
			var dep;
			for (var i=0; i<aDep.length; i++) {
				dep = aDep[i];
				if ( ! (dep in data)) {
					data[ dep ] = 0;
				}
			}

			var title="Total approved {0} : normal: {1} vip: {2}. Free Capacity: {3}";
			var strNormal = data.normal;
			if ( data.normal >0) {
				//also provide the detail for sub department
				strNormal += " [";
				for (i=0; i<aDep.length; i++) {
					dep = aDep[i];
					if ( data[ dep ] ) {
						strNormal += dep;
						strNormal += ":" + data[dep] + ",";
					}
				}
				//remove the last , 
				strNormal = strNormal.substr(0, strNormal.length -1);
				strNormal += "], ";	
			} else {
				strNormal += ", ";
			}

			title = title.sapFormat(data.vip + data.normal, strNormal, data.vip, data.free);

			that.hasFreeSeat = (data.free >0);
			that.byId("detailPage").setTitle(title);

			//now get the hasFreeSet, so need update the button status
			that.updateAllButtonStatus();
		}

		function onRegistrationError(error) {
			Util.showError("Failed to get registration information." , error);
		}

		this.oDataModel.callFunction("/GetRegistrationInfo", {
			method: "GET",
			success: onRegistrationSuccess,
			error: onRegistrationError
		});
	},

	onSavePressed: function( evt ) {
		if (!this.currentBindingpath) {
			console.error("Logic error, should not happend!");
			return;
		}

		var context = this.oPage.getBindingContext();
		var path = context.getPath();
		var pendingChange = context.getModel().getPendingChanges();
		var pending  = pendingChange[ path.substr(1)]; 
		
		if (!pending) {
			Util.info("You didn't change any value, so no need save!");
			return;
		}

		var mData = {};
		for (var key in pending) {
			if (key == "__metadata")
				continue;

			mData[key] = pending[key];
			if (key == "Age")
				mData.Age = parseInt(mData.Age);
		}
		
		var that = this;
	    function onSaveSuccess( evt ) {
	        that.getView().setBusy(false);
	        Util.showToast("Save registration successful!");

	        //so now can delete the changes 
	        delete pendingChange[path.substr(1)];
	    }
	    
	    function onSaveError(error) {
			that.getView().setBusy(false);
			Util.showError("Save registration failed." ,error);
	    }

	    this.oDataModel.update(path, mData, {
	    	success: onSaveSuccess, 
	    	error:   onSaveError,
	    });

	    this.getView().setBusy(true);
	},

	onFreshPressed: function( evt ) {
		this.updateAllButtonStatus();
		this.currentBindingpath = "";
	    this.bindList();
	    this.getRegistrationInfo();
	},
	

	onDeletePressed: function( oEvent ) {
		if (!this.currentBindingpath) {
			console.error("Logic error, should not happend!");
			return;
		}

		var yes = confirm("Are you sure to delete the Registraion? After delete, then can't retrieve back any more!");
		if ( !yes)
			return;
		
		var that = this;
	    function onDeleteSuccess( evt ) {
	        that.getView().setBusy(false);
	        Util.showToast("Delete registration successful!");

	        that.onFreshPressed();
	    }
	    
	    function onDeleteError(error) {
			that.getView().setBusy(false);
			Util.showError("Delete registration failed." ,error);
	    }

	    this.oDataModel.remove(this.currentBindingpath, {
	    	success: onDeleteSuccess, 
	    	error:   onDeleteError,
	    });

	    this.getView().setBusy(true);
	},
	

	openRejectDialog: function( fnCallback ) {
	    if (!this.oRejectDialog) {
			this.oRejectDialog = sap.ui.xmlfragment(this.getView().getId(), "csr.mng.view.RejectDialog", this);
		}
		this.oRejectDialog.open();
	},
	
	onDialogCancelPressed: function( evt ) {
	    this.oRejectDialog.close();
	},
	
	onDialogRejectPressed: function( evt ) {
	    this.oRejectDialog.close();
	    var reason = this.byId("reasonTextArea").getValue().trim();
	    this.onApproveRejectPressed(null, reason);
	},
	
	onDialogClearPressed: function() {
	    this.byId("reasonTextArea").setValue("");
	},

	onRejectReasonChanged: function() {
	    var reason = this.byId("reasonTextArea").getValue().trim();
	    this.byId("rejectDialogBtn").setEnabled( !! reason);
	},

	onWaitingPressed: function(oEvent) {
		if (!this.currentBindingpath) {
			console.error("Logic error, should not happend!");
			return;
		}

		var mData = {
			UpdateFlag: Enum.UpdateFlag.Waiting
		};
		var that = this;

		function onWaitingSuccess() {
	        that.getView().setBusy(false);
	        Util.showToast("Put on waiting list successful!");
	        
	        //move to next item
	        that.onFreshPressed();
	    }
	    
	    function onWaitingError(error) {
			that.getView().setBusy(false);
			Util.showError("Put on waiting list failed.", error);
	    }

	    this.oDataModel.update(this.currentBindingpath, mData, {
	    	success: onWaitingSuccess, 
	    	error:   onWaitingError,
	    });

	    this.getView().setBusy(true);
	},

	onApproveRejectPressed: function( oEvent, reason) {
		if (!this.currentBindingpath) {
			console.error("Logic error, should not happend!");
			return;
		}

		var mData = {
			UpdateFlag: Enum.UpdateFlag.Approve
		};
		var that = this;

		if (reason) {
			mData.Status = Enum.Status.Rejected;
	    	mData.RejectReason = reason;
		} else {
			var id = oEvent.getSource().getId();
			var bApprove = (id.indexOf("approve") != -1);
		    if (bApprove) {
		    	mData.Status = Enum.Status.Approved;
		    } else {
				this.openRejectDialog();
		    	return;
		    } 
		}

	    function onApproveRejectSuccess() {
	        that.getView().setBusy(false);
	        var action = bApprove ? "Approve" : "Reject";
	        Util.showToast(action + " successful!");
	        
	        //move to next item
	        that.onFreshPressed();
	    }
	    
	    function onApproveRejectError(error) {
			that.getView().setBusy(false);
			var action = bApprove ? "Approve" : "Reject";
			Util.showError(action + " failed.", error);
	    }

	    this.oDataModel.update(this.currentBindingpath, mData, {
	    	success: onApproveRejectSuccess, 
	    	error:   onApproveRejectError,
	    });

	    this.getView().setBusy(true);
	},	

	//as we get the Registration information later, so need manually adjust the status 
	updateAllButtonStatus: function() {
		var bSel = true, bApproveReject = false;

	    var selItem = this.oList.getSelectedItem();
	    if (!selItem) {
	    	bSel = false;
	    } else {
	    	var binding = selItem.getBindingContext();
	    	var prop = binding.getProperty();
	    	//when just delete it,then prop has been delete, so means no item has select, 
	    	if (!prop) {
	    		bSel = false;
	    	} else {
	    		bApproveReject = this.fmtApproveEnableStatus(prop.Status, prop.Vip);
	    	}
	    }

	    this.byId("deleteBtn").setEnabled(bSel);
	    this.byId("saveBtn").setEnabled(bSel);
	    this.byId("approveBtn").setEnabled(bSel && bApproveReject);
	    this.byId("rejectBtn").setEnabled(bSel && bApproveReject);
	},
	 

	fmtWaitingEnableStatus: function(status) {
  		return (status == Enum.Status.Submitted);
	},

	fmtApproveEnableStatus: function( status, vip ) {
	    if (status == Enum.Status.Submitted) {
	    	if (vip)
	    		return true;
	    	else {
	    		return this.hasFreeSeat;
	    	}
	    } else {
	     	return false;
	    }
	},


	fmtAttachmentLink: function( fileName, type ) {
	    return "Picture for " + type;
	},

	fmtAttachmentSrc: function( attachment ) {
	    if (attachment) {
	    	this.setMine(attachment.Mine);
	    	return attachment.src;
	    } else {
	    	return "";
	    }
	},
	
	onDownloadExcelPressed: function( evt ) {
		var content="Surname,Firstname,IdOrPassport,Title,Age,Distance,BestTime1M,BestTime1/2M,BestTime8.5K,T-Shirt,EMail,Nationality,Phone,Club\r\n";
		var aKey = [
			"RegLastName", "RegFirstName", "IdOrPassport", "Title", "Age", "Distance", "FullBestTime", "HalfBestTime", "FunBestTime",
			 "TshirtSize", "Email", "Nationality", "Phone", "Club" ];
		var that = this;

 		function onGetApprovedRunnerSuccess(oData) {
	        that.getView().setBusy(false);

	        for (var i=0; i < oData.results.length; i++) {
	        	var item = oData.results[i];

	        	for (var idx =0; idx < aKey.length; idx++) {
	        		var key = aKey[idx];
	        		var val = item[key];

	        		//!!now for the surname/firstname, need special handle
	        		if ( idx == 0) {
	        			var bothName = Util.parseChineseName( item.RegLastName, item.RegFirstName);
	        			val = bothName.join(',');
	        			idx = 1;  //first name has been handled
	        		} else {
	        			content +=",";
	        		}
	        		
	        		if (val) {
	        			content += val;
	        		}
	        	}
	        	content += "\r\n";
	        }
	    	Util.saveToCsvUtf8(content, "ApprovedRunner.csv");
	    }
	    
	    function onGetApprovedRunnerError(error) {
			Util.showError("Get all approved runner failed.",error);
	    }

	    this.oDataModel.read("/Registrations", {
	    	filters: [new sap.ui.model.Filter("Status", 'EQ', "Approved")],
	    	success: onGetApprovedRunnerSuccess, 
	    	error:   onGetApprovedRunnerError
	    });

	    this.getView().setBusy(true);
	},
	
	onDownloadAttachmentPressed: function( evt ) {
		var that = this;
		function onGetApprovedRunnerSuccess(oData) {
	        that.oDownloadTable.setBusy(false);

	        var aData = [];
	        var iBlock = 1;
	        var block = 10;
	        var entry;

	        for (var i=0; i < oData.results.length; i++) {
	        	//one block 10 files 
	        	if ((i % block) == 0) {
	        		entry = {
	        			Seq: iBlock + " ~~ " + block * iBlock,
	        			Name: "",
	        			UserIds: "",
	        			FileName: iBlock + "-" + block * iBlock +".zip",
	        		};
	        		iBlock++;
	        		aData.push(entry);
	        	}
	        	
	        	var item = oData.results[i];
	        	if (entry.Name)
	        		entry.Name +="; ";
	        	entry.Name += item.LastName + "," + item.FirstName;

	        	if (entry.UserIds)
	        		entry.UserIds += ",";
	        	entry.UserIds += item.UserId;
	        }

	        var oModel = new sap.ui.model.json.JSONModel(aData);
    		that.oDownloadTable.setModel(oModel);
	    }
	    
	    function onGetApprovedRunnerError(error) {
	    	that.oDownloadTable.setBusy(false);
			Util.showError("Get all approved runner failed.",error);
	    }

	    
		if (!this.oDownloadDialog) {
			this.oDownloadDialog = sap.ui.xmlfragment(this.getView().getId(), "csr.mng.view.DownloadDialog", this);
			this.oDownloadTable  = this.byId("downloadTable");
		}

		this.oDataModel.read("/Registrations", {
	    	filters: [new sap.ui.model.Filter("Status", 'EQ', "Approved")],
	    	sorters: [new sap.ui.model.Sorter("SubmittedTime")],
	    	success: onGetApprovedRunnerSuccess, 
	    	error:   onGetApprovedRunnerError
	    });

	    this.oDownloadTable.setBusy(true);

		this.oDownloadDialog.open();
	},

	onDownloadIconPressed: function( evt ) {
		var context = evt.getSource().getBindingContext();
		var data = context.getProperty();
		var url =  Config.getConfigure().ZipDownloadUrl;
		url +="?UserIds=" + data.UserIds + "&FileName=" + data.FileName;

		window.open(url);
	},
	

	onCloseDownloadDialogPressed: function( evt ) {
	    this.oDownloadDialog.close();
	},
	

	saveAsZipFile: function( evt ) {
		var url = "http://localhost:8524/csrodata/Attachment?UserId=I068108&Type=Form";
	        $.ajax({
  			url: url,
  			type: "GET",
  			dataType: "binary",
  			processData: false,
  			success: function(result){
	  			// var zip = new JSZip();
	  			// zip.file("test.pdf", result);
	  			// var zipContent = zip.generate({type:"blob"});		
	  			// saveAs(zipContent, "test.zip");
	  			saveAs(result, "a.pdf");
  			},

  			error: function( evt ) {
  				var zip = new JSZip();
	  			zip.file("test.pdf", arguments[0].responseText);
	  			var zipContent = zip.generate({type:"blob"});		
	  			saveAs(zipContent, "test2.zip");
  			    
  			}
		});
	        /*var zip = new JSZip();
        // for (var i=0; i < this.aFile.length; i++) {
            // var file  = this.aFile[i];
            zip.file("test.txt", "abce");
        // }
        var zipContent = zip.generate({type:"blob"});

        // see FileSaver.js
        saveAs(zipContent, "test.zip");*/
	},

    onSettingPressed: function( evt ) {
        if (!this.oSettingDialog) {
			this.oSettingDialog = sap.ui.xmlfragment(this.getView().getId(), "csr.mng.view.SettingDialog", this);
			this.byId("projectForm").bindElement("/Projects('marathon2018')");
			this.getView().addDependent( this.oSettingDialog);
		}
		this.oSettingDialog.open();
    },

	onSettingInputChanged: function( evt ) {
		//??now no need check the number 
	   /* var ids=["MaxRegisterNum",   "FreeVipNum"];
	    var flag = true;
	    for (var i=0; i < ids.length; i++) {
	    	var id = ids[i];
	    	var val = this.byId(id).getValue().trim();
	    	if (!val) {
	    		flag = false;
	    		break;
	    	}
	    }
	    this.byId('settingOkBtn').setEnabled(flag);*/
	},
	

    onSettingOkPressed: function( evt ) {
    	var ids=["MaxRegGcoNum", "MaxRegLabsNum", "MaxRegDbsNum" ];
    	var mData = {};
    	for (var i=0; i < ids.length; i++) {
	    	var id = ids[i];
	    	var val = this.byId(id).getValue().trim();
	    	if (id.indexOf("Num") != -1 ) {
	    		val = parseInt(val);
	    	}
	    	mData[id] = val;
	    }

	    var that = this;
	    function onUpdateProjectSuccess() {
	        // that.getView().setBusy(false);
	    	that.oSettingDialog.close();
	        Util.showToast("Update project setting successful!");
	        that.getRegistrationInfo();
	    }
	    
	    function onUpdateProjectError(error) {
	    	// that.oSettingDialog.setBusy(false);
	    	that.oSettingDialog.close();

			Util.showError("Update project setting failed.",error);
	    }

	    this.oDataModel.update("/Projects('marathon2018')", mData, {
	    	success: onUpdateProjectSuccess, 
	    	error:   onUpdateProjectError,
	    });
		// this.oSettingDialog.setBusy(true);
    },
    

    onSettingCancelPressed: function( evt ) {
        this.oSettingDialog.close();
    },
    
});

	//global data 

	return ControllerController;
});

