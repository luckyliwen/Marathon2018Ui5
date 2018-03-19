var gf,gc,gm, gsel;
sap.ui.define([
	"csr/lib/BaseController",
	"csr/lib/Enum",
	"csr/lib/Config",
	"csr/lib/Util",
], function(BaseController, Enum, Config, Util) {
	"use strict";

var ControllerController = BaseController.extend("csr.register.controller.Register", {
	onInit:function() {
		BaseController.prototype.onInit.call(this);

    	gf = this.byId("registerForm");
		gc = this; 

		this.oDataModel = this.getModel('odata');
		this.oDataModel.setUseBatch(false);

		this.oFooterBar = this.byId('footerBar');

		this.bAdmin = false;
		this.mRegister = {};

		// for some VIP others will regiser on hehalf him, so use the mode=proxy to support this model
		var sProxy = jQuery.sap.getUriParameters().get("mode");
		var bProxy = (sProxy == "proxy");
		if (bProxy) {
			var proxyId;
			while(true) {
				proxyId = prompt("Please input the user id which you want to register for");
				if (! proxyId || proxyId.length <5) {
					alert("You don't not input correct id, please try again!");
				} else {
					break;
				}
			}
			this.getTheResistrationWithId(proxyId.trim());
		} else {
			this.getMyResistration();	
		}
		

		this.oSubmitBtn = null;
		this.oCancelBtn = null;
		this.oSaveBtn = null;
		//lastPendingAction  aNeedUploader
		this.oUploader = {};
		for (var key in Enum.AttachmentType) {
			var name = 'oUploader' + key;
			var id = "fileUploader" + key;

			this.oUploader[ key ] = this.byId(id);

			//this[name].setUploadUrl
			// this.oUploader[ key ].attachSelectFile(this.checkButtonStatus, this);
		}

		this.setInputValidation();
	},
	
	/**
	It is more troubsome to set it in xml like <customData><core:CustomData key='' value=''>, so just set in code manually
	*/
	setInputValidation: function() {
		this.aValidationId = [];  //all the id which need do validation

		var map = {
			"RegIdPassport": Enum.ValidationType.IdPassport,
			"RegSurname": Enum.ValidationType.Name,
			"RegFirstName": Enum.ValidationType.Name,
			"RegAge": Enum.ValidationType.Age,
			"RegEmail": Enum.ValidationType.Email,
			"RegPhone": Enum.ValidationType.Phone
		};
		for (var key in map) {
			//set validate type so later know how to check
			this.byId(key).data("ValidationType", map[key]);
			this.aValidationId.push( key );
		}

		//initial value for the total validation
		this.mValidation = {};

	},

	fmtPageTitle: function( status , reason) {
		if (status == "Rejected") {
	    	return "My Registration : status [ " + status + " ], reason: " + reason;
		} else {
			return "My Registration : status [ " + status + " ]";
		}
	},
	
	onTechnicalHelpPressed: function() {
		var msg = "This registration solution is provided by lucky li using SAP UI5. \r\n" +
			"As UI5 is not well supported by IE, so please first retry using the latest Chrome/Firefox/Safari.\r\n" +
			"If you found some bug, please first clear the browser history and retry.\r\n\r\n" +
			"If bug still existed, please send mail to lucky.li01@sap.com with detail screen copy and console information (by F12 you can see Console window)";
		Util.info( msg );		
	},

	onDownloadFormPressed: function( evt ) {
	    window.open(Config.getConfigure().FormDownloadUrl, "_blank");
	},

	onNationalityChanged: function( evt ) {
		var  selKey = this.byId("Nationality").getSelectedKey();
		var flag = (selKey == 'Others');
	    var input = this.byId("OtherNationality").setEnabled(flag);

	    this.adjustAttachmentUi();

	    //as some validaiton are depending on the nationality, so need retrigger the validation when changed
	    this.redoValidatonForNationalityChange();
	},

	adjustAttachmentUi: function( evt ) {
		var bChinese = this.mRegister.Nationality == 'Chinese';
		this.byId("labelUploaderResidence").setVisible( !bChinese );
		this.byId("fileUploaderResidence").setVisible( !bChinese );
		//when it refresh, the file name will lose, so need manually refesh.  Need check why can't do using the onAfterRending
		this.showAttachmentFileName();
	},
	  

	onGetInitialDataFinished: function() {
	    var oModel = new sap.ui.model.json.JSONModel();
    	oModel.setData( this.mRegister );
    	oModel.setDefaultBindingMode("TwoWay");
    	this.oModel = oModel;
    	this.setModel(oModel);

		this.createOrUpdateFooterButton();
		this.onNationalityChanged();

		this.checkButtonStatus();
	},

	/**
	As request by HR, for the first time employee need confirm the license.
	*/
	displayLicenseConfirm: function() {
		this.oLicenseDialog =  sap.ui.xmlfragment(this.getView().getId(), 
			"csr.register.view.LicenseConfirm", this);
		var html = '<div style="margin: 2rem 4rem">Dear colleague, thanks for your interest in the TEAM SAP event!<br/><br/>' +
		 	'SAP provides a free event entry for each runner. if you’re based outside Beijing, the relevant travel policy:<br>' +
		 		'<b>approved business trip should applied, or you need to cover your own travel expense.</b><br/><br/>' + 
			'All runners receive a complimentary TEAM SAP running jersey and free transportation to and from the event start/finish on the race day.' +
			'Please check your calendar before submitting your registration.<br/><br/> ' +
			'If you cannot participate you must inform Ms. Yang Ying (Email: ying.yang04@sap.com) or Ms. Bela Zhang (Email: yanjun.zhang@sap.com) by March 28. '+
			'If you withdraw after March 28 or no-show on the event day, <b>you will forfeit the registration fee of RMB 1,800 as a donation to our designated charity.</b>' +
			'<br/>You will select full or half marathon or fun run distance when you register. Changes are not allowed.<br/><br/>' +
			'Regards,<br/>TEAM SAP Committee<br/><hr/><br/></div>';

		this.byId("licenseContentHtml").setContent(html);

		this.oLicenseDialog.setEscapeHandler( function() {
			//just empty to disable use close it by escape
		});

		this.oLicenseDialog.open();
	},
	
	
	//choose agree or disagree radio button
	onLicenseRadioBtnSelect: function(oEvent) {
		var btn = oEvent.getSource();
		
		var flag = this.byId("radioBtnAgree").getSelected() ||
				this.byId("radioBtnDisagree").getSelected();
		this.byId("licenseDlgOkBtn").setEnabled(flag);
	},

	onLicenseDialogOKButtonPressed: function() {

		this.oLicenseDialog.close();
		if (this.byId("radioBtnDisagree").getSelected()) {
			// now can't close the window, so just make it readonly
			// window.close();
			Util.warn("You can't submit the registration because you don't agree the license!");
			this.oSaveBtn.setEnabled(false);
		}
	},

	getMyResistration: function() {
		var that = this;
		function onGetMyRegistrationSuccess(oData) {
			that.getView().setBusy(false);

			delete oData.__metadata;
			delete oData.AttachmentDetails;
			delete oData.DonationDetails;

	    	//also set the defaultValue for the selection for the null part 
	    	var config = Config.getConfigure();
	    	for (var key in config) {
	    		var value = config[key];
	    		if ( key in oData && oData[key] == null && value.defaultValue) {
	    			var selection = that.byId(key);
	    			if (selection instanceof csr.lib.SelectExt) {
	    				oData[key] = value.defaultValue;
	    				// selection.setSelectedKey();
	    			}
	    		}
	    	}

	    	//set model two way
			that.mRegister = oData; 
			//by default the initial file name is ""
			that.mRegister.FileNameId = "";
			// that.mRegister.FileNamePhoto = "";
			that.mRegister.FileNameForm = "";
			that.mRegister.FileNameResidence = "";
			//db only store nationality, but UI need two variables
			if ( Config.isOtherNationality(  that.mRegister.Nationality) ) {
				that.mRegister.OtherNationality = that.mRegister.Nationality;
				that.mRegister.Nationality = "Others";
			}  else {
				that.mRegister.OtherNationality = "";
			}

			if (that.mRegister.Age === 0) {
	    		delete that.mRegister.Age;
	    	}

			//get the attachments informaiton 
			if (that.mRegister.Status != "New") {
				that.getUploadedAttachmentInfo();
			} else {
				that.onGetInitialDataFinished();

				that.displayLicenseConfirm();
			}

			if (that.mRegister.UpdateFlag == "admin") {
				that.bAdmin = true;
			}
		}

		function onGetMyRegistrationError(error) {
			that.getView().setBusy(false);
			Util.showError("Failed to get my registration.", error);
		}

	    this.oDataModel.callFunction("/GetMyRegistration", {
			method: "GET",
			success: onGetMyRegistrationSuccess,
			error: onGetMyRegistrationError
		});

	    this.getView().setBusy(true);
	},


	getTheResistrationWithId: function(userId) {
		var that = this;
		function onGetMyRegistrationSuccess(oData) {
			that.getView().setBusy(false);

			delete oData.__metadata;
			delete oData.AttachmentDetails;
			delete oData.DonationDetails;

	    	//also set the defaultValue for the selection for the null part 
	    	var config = Config.getConfigure();
	    	for (var key in config) {
	    		var value = config[key];
	    		if ( key in oData && oData[key] == null && value.defaultValue) {
	    			var selection = that.byId(key);
	    			if (selection instanceof csr.lib.SelectExt) {
	    				oData[key] = value.defaultValue;
	    				// selection.setSelectedKey();
	    			}
	    		}
	    	}

	    	//set model two way
			that.mRegister = oData; 
			//by default the initial file name is ""
			that.mRegister.FileNameId = "";
			// that.mRegister.FileNamePhoto = "";
			that.mRegister.FileNameForm = "";
			that.mRegister.FileNameResidence = "";
			//db only store nationality, but UI need two variables
			if ( Config.isOtherNationality(  that.mRegister.Nationality) ) {
				that.mRegister.OtherNationality = that.mRegister.Nationality;
				that.mRegister.Nationality = "Others";
			}  else {
				that.mRegister.OtherNationality = "";
			}

			if (that.mRegister.Age === 0) {
	    		delete that.mRegister.Age;
	    	}

			//get the attachments informaiton 
			if (that.mRegister.Status != "New") {
				that.getUploadedAttachmentInfo();
			} else {
				//for the first time, need get the first name and last name.
				that.onGetInitialDataFinished();
			}

			if (that.mRegister.UpdateFlag == "admin") {
				that.bAdmin = true;
			}
		}

		function onGetMyRegistrationError(error) {
			that.getView().setBusy(false);
			//if that person not register before, then it will fail
			if ( ! (error.responseText && 
				error.responseText.indexOf("Requested entity could not be found") != -1) ) {
				Util.showError("Failed to get my registration.", error);
				return;
			} 

			that.getView().setBusy(false);

	    	//also set the defaultValue for the selection for the null part 

	    	//set model two way
			that.mRegister = {UserId: userId, Status: 'New', Nationality: 'German'};
			//then get the first name and last name
			while (true) {
				var firstLastName = prompt("Please input first and last name, separate by , ");
				firstLastName = firstLastName.trim();
				var pos = firstLastName.indexOf(",");
				if (pos != -1) {
					that.mRegister.FirstName = firstLastName.substring(0, pos);
					that.mRegister.LastName = firstLastName.substr(pos+1);
					break;
				} else {
					alert("Input correct,pleae try again!");
				}
			}

			//by default the initial file name is ""
			that.mRegister.FileNameId = "";
			// that.mRegister.FileNamePhoto = "";
			that.mRegister.FileNameForm = "";
			that.mRegister.FileNameResidence = "";

			//for the first time, need get the first name and last name.
			that.onGetInitialDataFinished();
		}

		//Registrations('I041661')
		var url = "/Registrations('" + userId + "')";
	    this.oDataModel.read(url, {
			method: "GET",
			success: onGetMyRegistrationSuccess,
			error: onGetMyRegistrationError
		});

	    this.getView().setBusy(true);
	},
	
	getUploadedAttachmentInfo: function(  ) {
		// var url = Util.getMyAttachmentUrl(this.mRegister.UserId);
		var that = this;

		function onGetUploadAttachmentSuccess(oData) {
			for (var i=0; i < oData.results.length; i++) {
				var  attachment = oData.results[i];

				//by the type set the FileName 
				var name = "FileName" + attachment.Type;

				that.mRegister[ name ] = attachment.FileName;
			}

			that.onGetInitialDataFinished();
		}

		function onGetUploadAttachmentError(error) {
			Util.showError("Failed to get Attachment information.", error);
			that.onGetInitialDataFinished();
		} 

	    this.oDataModel.read("/Attachments", {
	    	filters: [new sap.ui.model.Filter("UserId", 'EQ', that.mRegister.UserId)],
			success: onGetUploadAttachmentSuccess,
			error:  onGetUploadAttachmentError
		});
	},
	
	createOrUpdateFooterButton: function() {
		this.oSubmitBtn = null;
		this.oCancelBtn = null;
		this.oSaveBtn = null;

		//for simple first just delete old button 
		this.oFooterBar.removeAllContentRight();

		var aActionInfo = Enum.RegisterActionButton[ this.mRegister.Status];
		for (var i=0; i < aActionInfo.length; i++) {
			var  info = aActionInfo[i];
			var button = new sap.m.Button({
				text: info.name,
				icon: info.icon,
				press: [this.onResigerActionButtonPressed, this]
			});
			//use the data to know how to handle
			button.data('Action', info.name);
			if (info.type) {
				button.setType(info.type);
			}

			this.oFooterBar.addContentRight( button );

			//also set the button 
			var name = 'o' + info.name + 'Btn';
			this[name] = button;
		}
	},

	checkButtonStatus: function( evt ) {
		//for the save, only when no validation error
		var inputValid = true;
		for (var key in this.mValidation) {
			inputValid = false;
			break;
		}
		this.oSaveBtn.setEnabled( inputValid);

	    //for the cancel always enabled 
	    if (this.oSubmitBtn) {
	    	var status = true;

	    	//check all the necessary input is not null
	    	var config = Config.getConfigure();
	    	for ( key in config) {
	    		var value = config[key];
	    		if (value.required) {
	    			if ( key in this.mRegister) {
	    				//for chinese, no need check residence permit
	    				if ( key == "FileNameResidence" && !this.byId("fileUploaderResidence").getVisible()) 
	    					continue;

	    				var realValue = this.mRegister[key];
	    				if (!realValue) {
	    					status = false;
	    					break;
	    				}
	    			}
	    		}
	    	}
	    	//if choose others, then need specify value
	    	if (status) {
	    		if (this.mRegister.Nationality == 'Others') {
					var otherValue = this.byId("OtherNationality").getValue().trim();
					status = !!otherValue;
	    		}
	    	}

	    	this.oSubmitBtn.setEnabled(status && inputValid);
	    }
	},

	//copy from http://blog.csdn.net/websites/article/details/66969871
	validateChineseId: function(code) {
		//first rough valid
		var valid = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/.test(code);
		if( valid && code.length == 18){  
            code = code.split('');  
            //∑(ai×Wi)(mod 11)  
            //加权因子  
            var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];  
            //校验位  
            var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];  
            var sum = 0;  
            var ai = 0;  
            var wi = 0;  
            for (var i = 0; i < 17; i++)  
            {  
                ai = code[i];  
                wi = factor[i];  
                sum += ai * wi;  
            }  
            if(parity[sum % 11] != code[17].toUpperCase()){  
            	valid = false;
            }  
        }  
        return valid;
	},

	redoValidatonForNationalityChange: function() {
		//only those depending on nationlity need recheck
		var aId = ["RegIdPassport", "RegSurname", "RegFirstName" ];
		for (var i = 0; i<aId.length; i++) {
			var input = this.byId(aId[i]);
			var valType = input.data("ValidationType");
			this.validateInput( valType, input);
		}
	},

	validateInput: function(validateType, input) {
		var val = input.getValue().trim();
		//now for simple just manually do the check, later need considerate use the UI5 provide method
		var valid = true;

		var stateText = "";
		if ( val) {
			switch (validateType) {
				case Enum.ValidationType.IdPassport:
					//only check the Chinese 
					if ( this.mRegister.Nationality == "Chinese") {
						//old 15, new 18, the last can be x or X
						valid = this.validateChineseId(val);
						if ( !valid)
							stateText = "Valid Chinese Identity is 15 or 18 digital and follow special rule";
					}
					break;
				case Enum.ValidationType.Age:
					valid = /^\d{2}$/.test(val);
					if (valid) {
						valid = parseInt(val) > 10;  //old enough ?
					}
					if (!valid)
						stateText = "Valid age must be large 10 and less than 100";
					break;
				case Enum.ValidationType.Name:
					if ( this.mRegister.Nationality == "Chinese") {
						valid = /^([\u4e00-\u9fa5]){1}/.test(val)  && /[a-zA-Z]{1}$/.test(val);
						if (!valid)
							stateText = "先中文再拼音";
					}
					break;
				case Enum.ValidationType.Phone:
					valid = /^[\d-+]+$/.test(val) && val.length > 7;
					if ( !valid)
						stateText = "Phone lenght must large 7 and contain only 0-9, +-";
					break;
				case Enum.ValidationType.Email:
					valid = /\w+([-.]\w+)*@sap.com/.test(val);
					if (!valid)
						stateText = "Only SAP email is valid";
					break;
			}
		}

		if ( !valid) {
			this.mValidation[ input.getId()] = false;
			input.setValueState("Error");
			input.setValueStateText(stateText);
		} else {
			delete this.mValidation[ input.getId()];
			input.setValueState("None");
		}
	},

	onInputChanged: function( oEvent ) {
		var source = oEvent.getSource();
		//??later need add more check for the input
		/*if ( id.indexOf("RegLastName") != -1 || id.indexOf("RegFirstName") != -1) {
			var value = source.getValue();
			for (var i=0; i < value.length; i++) {
				var code = value.charCodeAt(i);
				if (code >= 128) {
					Util.showError("Please input Ping Yin or English Name!");
				}
			}
		}*/
		var valType = source.data("ValidationType");
		if ( valType) {
			this.validateInput(valType, source);
		}
	    this.checkButtonStatus();
	},

	onAttachmentSelectChanged: function( oEvent ) {
		//update the value 
		var source = oEvent.getSource();
		var binding = source.getBinding('fileName');
		var path = binding.getPath();
		path = path.substr(1);
		this.mRegister[path] = oEvent.getParameter('fileName');
		
	    this.checkButtonStatus();
	},
	
	
	//as Save, Cancel, Submit has similar logic, so use same function
	onResigerActionButtonPressed: function( oEvent ) {
		//for the age, need check ??

		var btn = oEvent.getSource();
		var action = btn.data("Action");

		if (action == "Cancel") {
			var bConfirm = confirm("Are you sure to cancel the Registraion? After cancel, then can't submit again!");
			if (!bConfirm)
				return;
		}

		var oldStatus = this.mRegister.Status;
	    var newStatus  = this.getNewStatus( action );

	    var bCreate = true;
	    if (oldStatus != "New") {
	    	bCreate = false;
	    }

	    this.mRegister.Status = newStatus;

	    
	    //for submit, need upload the attachment 
	    var oldAction = action;
	    var that = this;
	    function onRegActionSuccesss( oData) {
	        //then do update 
	        that.uploadAttachments(btn, oldAction);
	    }
	    
	    function onRegActionError(error) {
	    	that.getView().setBusy(false);
	    	that.onActionError(error, oldAction);
	    }

	    // do real action
	    var mParam = {
	    	success: onRegActionSuccesss,
	    	error: onRegActionError
	    };

	    //as there are some extra data, so here need just get the required data 
	    var mData = jQuery.extend({}, true, this.mRegister);
	    delete mData.FileNameId;
	    delete mData.FileNamePhoto;
	    delete mData.FileNameForm;
	    delete mData.FileNameResidence;
		delete mData.SubmittedTime;
	    delete mData.ModifiedTime;
	    delete mData.OtherNationality;
	   
	    //for nationality, need combine value 
	    var  selKey = this.byId("Nationality").getSelectedKey();
		var flag = (selKey == 'Others');
	    if (flag) {
	    	mData.Nationality  = this.byId("OtherNationality").getValue();
	    }

	    //for the null value, need delete 
	    for (var key in mData) {
	    	if ( mData[key] == null) {
	    		delete mData[key];
	    	}
	    }

	    //for the Age, need use the number
	    if (mData.Age) {
	    	mData.Age = parseInt(mData.Age);
	    }

	    if (bCreate) {
	    	//for new Registration, it need backend check whether has the initial team or not
	    	mData.UpdateFlag = Enum.UpdateFlag.RequestJoin;
			this.oDataModel.create("/Registrations", mData, mParam);
	    } else {
	    	var path = "/Registrations('" + this.mRegister.UserId + "')";
			this.oDataModel.update(path, mData, mParam);
	    }

	    //??also need upload the attachments 
	    this.getView().setBusy(true);
	},

	showAttachmentFileName: function( evt ) {
	    for (var key in Enum.AttachmentType) {
	     	var oUploader = this.oUploader[key];
	     	if (oUploader.getVisible()) {
	     		oUploader.showFileName();
	     	}
	    }
	},
	
	//if save it at same time, then >HTTP Status 500 - Attempting to execute an operation on a closed EntityManager,
	//so change to only when previos finished then do next 
	uploadAttachments: function( btn, action) {
		this.aNeedUploader = [];
		// this.triggeredBtn = btn;

	    for (var key in Enum.AttachmentType) {
	     	var oUploader = this.oUploader[key];
	     	if (oUploader.getVisible() && oUploader.getModified()) {
	     		this.aNeedUploader.push( [key, oUploader]);
	     	}
	    }

	    if (this.aNeedUploader.length>0) {
	    	// btn.setEnabled(false);
	    	this.lastPendingAction = action;
	    	this.uploadAttachmentStepByStep();
	    } else {
	    	this.getView().setBusy(false);
	    	this.onActionSuccesss(action);
	    }
	},

	uploadAttachmentStepByStep: function( ) {
		var aInfo = this.aNeedUploader.shift();
		if (aInfo) {
			var key = aInfo[0];
			var oUploader = aInfo[1];

			var url = Util.getAttachmentUploaderUrl( this.mRegister.UserId, key, oUploader.getFileName());

 			oUploader.setUploadUrl(url);

 			oUploader.upload();
 			//clear flag 
 			oUploader.setModified(false);	
		} else {
			//all finished, can show toast now
			this.getView().setBusy(false);
			this.onActionSuccesss( this.lastPendingAction);
		}
	},

	onUploadFileFinished: function( evt ) {
	    this.uploadAttachmentStepByStep();
	},

	onUploadFileFailed: function( evt ) {
	    this.uploadAttachmentStepByStep();
	},
	

	onActionSuccesss: function(oldAction ) {
		Util.showToast(oldAction + " successful!");
		if ( this.mRegister.Status == "Submitted" ) {
			var msg = "Thanks for your interest in the TEAM SAP event!\r\n" +
				"You will receive an email notification in 1-2 working days to let you know if your registration is successful.";
			Util.info(msg);
		}
		
		//update the page title 
		this.byId('registerPage').setTitle( this.fmtPageTitle(this.mRegister.Status));

	    this.createOrUpdateFooterButton();
		this.checkButtonStatus();
	},

	onActionError: function( error, oldAction) {
	    Util.showError(oldAction + " failed.", error);
	},
	
	
	getNewStatus: function( action ) {
	    if (action == 'Save') {
	    	//depend on current status 
	    	if (this.mRegister.Status == "Submitted") {
				return "Submitted";
	    	} else {
	    		return 'Drafted';
	    	}
	    } else if (action == "Submit"){
	    	return "Submitted"; 
	    } else if (action == "Cancel") {
	    	return "Canceled";
	    }
	},
	
});
	
	//global data 
	// mRegister:  //the register information
	//oFooterBar	
	//oSubmitBtn, oCancelBtn, oSaveBtn
	//oUploader: {} 
	return ControllerController;
});