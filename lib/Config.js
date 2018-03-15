sap.ui.define([], function() {
	"use strict";

	//some basic configure, so HR can change it
	var mCfg = {
		//AttachmentLoaderUrl: "https://csrodatap1941885273trial.hanatrial.ondemand.com/csrodata/Attachment", 
		//used for upload attachment
		AttachmentLoaderUrl: "/uploadDownload/Attachment", 
		// AttachmentLoaderUrl: "http://localhost:8524/csrodata/Attachment", 

		//??later need check why here use the same location not work
		RelativeAttachmentLoaderUrl: "https://flpportal-p1941885273trial.dispatcher.hanatrial.ondemand.com/sap/fiori/csr/uploadDownload/Attachment",
		// RelativeAttachmentLoaderUrl: "http://localhost:8524/csrodata/Attachment", 

		FormDownloadUrl: "https://csrodatap2000218960trial.hanatrial.ondemand.com/csrodata/MarathonFom.zip",
		// FormDownloadUrl: "http://localhost:8524/csrodata/Runner_Form.pdf",
		// FormDownloadUrl: "http://localhost:8524/csrodata/MarathonFom.zip",
		// 
		ZipDownloadUrl: "/uploadDownload/Download", 
		// ZipDownloadUrl: "http://localhost:8524/csrodata/Download", 


		FirstName: {
			required: true
		},
		LastName: {
			required: true
		},
		UserId: {
			required: true,
		},
		Age: {
			required: true,
		},

		RegLastName: {
			required: true,
		},
		RegFirstName: {
			required: true,
		},
		Phone: {
			required: true,
		},


		//性别
		Gender: {
			required: true,
			description: "",
			defaultValue: "Male",
			list: [
				{name: "Male"}, {name: "Femal"}
			]
		},

		//国籍
		Nationality: {
			required: true,
			description: "Please select nationality from list, choose other if not matched",
			defaultValue: "Chinese",
			list: [
				{name: "Chinese"},  {name: "Taiwanese"}, {name: "Hong Kong"}, {name: "German"},
				{name: "Canadian"},  {name: "American"}, {name: "Singaporean"}, {name: "Australian"},
				{name: "Japanese"}, {name: "British"}, {name: "Malaysian"}, {name: "Indian"},
				{name: "French"}, {name: "South African"}, {name: "Dutch"}, {name: "Korean"},
				{name: "New Zealand"}, {name: "Others"}
			]
		},

		//大部门
		Department: {
			required: true,
			description: "",
			defaultValue: "Labs",
			list: [
				/*{name: "Office of the CEO (OCEO)"},  {name: "Human Resources (HR)"},
				{name: "Cloud Business Group (CBG)"}, {name: "Global Customer Operations (GCO) "},
				{name: "Products & Innovation (P&I) "}, {name: "Digital Business Services (DBS) "}, 
				{name: "Global Finance & Administration (GFA)"},
				{name: "Global Business Operations (GBO) "}, {name: "Others"},*/

				{name: "GCO",  text: "GCO and Others"},
				{name: "LABS", text: "Labs"},   
				{name: "DBS",  text: "DBS"}
			]
		},

		//称呼
		Title: {
			required: false,
			description: "",
			defaultValue: "Mr",
			list: [
				{name: "Mr"}, {name: "Mrs"}, {name: "Ms"}
			]
		},


		
		Distance: {
			required: true,
			description: "",
			defaultValue: "1M",
			list: [
				{name: "1M", text:  "Full Marathon (42 KM)"},
				{name: "1/2M", text:  "Half Marathon (21 KM)"},
				{name: "8.5K", text: "Fun Run (SAP team building option)"}	
			]
		},

		//http://zhidao.baidu.com/link?url=RHc5Z_41r4GbesMYz8voWzaqDTxjsUS2MYKmZyINIO-9VQQHBXLirlbJKCgnpxrk1ofWMBkh1hujqlRRkbXk0K
		TshirtSize: {
			required: true,
			description: "",
			defaultValue: "L",
			list: [
				{name: "XXXL",  text:"XXXL - Female: 180cm/100A, Male: 190cm/100A"}, 
				{name: "XXL",   text:"XXL  - Female: 175cm/96A , Male: 185cm/96A"}, 
				{name: "XL",    text:"XL   - Female: 170cm/92A, Male: 180cm/92A"}, 
				{name: "L",     text:"L    - Female: 165cm/88A, Male: 175cm/88A"}, 
				{name: "M",     text:"M    - Female: 160cm/84A, Male: 170cm/84A"}, 
				{name: "S" ,    text:"S    - Female: 155cm/80A, Male: 165cm/80A"}, 
				{name: "XS",    text:"XS   - Female: 150cm/76A, Male: 160cm/76A"},
				{name: "XXS",   text:"XXS  - Female: 145cm/72A, Male: 155cm/72A"}]
		},

		Club: {
			required: false,
			description: "None",
			defaultValue: "None",
			list: [
				{name: "None"}, {name: "SAP Runner Club - Shanghai"}, 
				{name: "SAP Runner Club - Beijing"}, 
				{name: "SAP Runner Club - Dalian"}, 
				{name: "Others"}
			]
		},

		Location: {
			required: true,
			description: "",
			defaultValue: "Shang hai",
			list: [
				{name: "Beijing"}, {name: "Shanghai"}, 
				{name: "Dalian"},  {name: "Xi'an"},  {name: "Nanjing"},  {name: "Guangzhou"}, 
				{name: "Shenzhen"}, {name: "Chengdu"}, {name: "HongKong"},{name: "Taipei"}, 
				{name: "Others"}
			]
		},


		Status: {
			required: false,
			list: [
				{name: "Drafted"}, {name: "Submitted"},
				{name: "Approved"}, {name: "Rejected"},
				{name: "Canceled"}
			]
		},

		//following 3 items just for simple check 
		FileNameId: {
			required: true
		},

/*		FileNamePhoto: {
			required: true
		},
*/		FileNameForm: {
			required: true
		},
		FileNameResidence: {
			required: true
		}
	};

	return {
		getModel: function( ) {
		    var oModel = new sap.ui.model.json.JSONModel();
        	oModel.setData( mCfg );
        	return oModel;
		},

		getConfigure: function() {
		    return mCfg;
		},

		isOtherNationality: function( value ) {
			for (var i=0; i < mCfg.Nationality.list.length; i++) {
				if (value == mCfg.Nationality.list[i].name) {
					return false;
				}
			}
		    return true;
		}
	};
});
