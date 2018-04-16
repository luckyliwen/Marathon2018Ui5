sap.ui.define([
	"sap/m/MessageBox", "sap/m/MessageToast",
	"csr/lib/Config",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV"
	], 
	function(MessageBox, MessageToast, Config,Export,ExportTypeCSV) {
	"use strict";

/**
 * Get the last part of one string, for sap.m.Button, then it will get Button
 */
String.prototype.sapLastPart = function(sep) {
	if (sep == undefined)
		sep = ".";

	var pos = this.lastIndexOf(sep);
	if (pos == -1)
		return this;
	else {
		return this.substr(pos + 1);
	}
};

String.prototype.sapFormat = function() {
	var args = arguments;
	return this.replace(/{(\d+)}/g, function(match, number) {
				return typeof args[number] !="undefined" ? args[number] : match;
			});
};

var localSaveAs =  localSaveAs||(function(h){"use strict";var r=h.document,l=function(){return h.URL||h.webkitURL||h;},e=h.URL||h.webkitURL||h,n=r.createElementNS("http://www.w3.org/1999/xhtml","a"),g="download" in n,j=function(t){var s=r.createEvent("MouseEvents");s.initMouseEvent("click",true,false,h,0,0,0,0,0,false,false,false,false,0,null);return t.dispatchEvent(s);},o=h.webkitRequestFileSystem,p=h.requestFileSystem||o||h.mozRequestFileSystem,m=function(s){(h.setImmediate||h.setTimeout)(function(){throw s;},0);},c="application/octet-stream",k=0,b=[],i=function(){var t=b.length;while(t--){var s=b[t];if(typeof s==="string"){e.revokeObjectURL(s);}else{s.remove();}}b.length=0;},q=function(t,s,w){s=[].concat(s);var v=s.length;while(v--){var x=t["on"+s[v]];if(typeof x==="function"){try{x.call(t,w||t);}catch(u){m(u);}}}},f=function(t,u){var v=this,B=t.type,E=false,x,w,s=function(){var F=l().createObjectURL(t);b.push(F);return F;},A=function(){q(v,"writestart progress write writeend".split(" "));},D=function(){if(E||!x){x=s(t);}w.location.href=x;v.readyState=v.DONE;A();},z=function(F){return function(){if(v.readyState!==v.DONE){return F.apply(this,arguments);}};},y={create:true,exclusive:false},C;v.readyState=v.INIT;if(!u){u="download";}if(g){x=s(t);n.href=x;n.download=u;if(j(n)){v.readyState=v.DONE;A();return;}}if(h.chrome&&B&&B!==c){C=t.slice||t.webkitSlice;t=C.call(t,0,t.size,c);E=true;}if(o&&u!=="download"){u+=".download";}if(B===c||o){w=h;}else{w=h.open();}if(!p){D();return;}k+=t.size;p(h.TEMPORARY,k,z(function(F){F.root.getDirectory("saved",y,z(function(G){var H=function(){G.getFile(u,y,z(function(I){I.createWriter(z(function(J){J.onwriteend=function(K){w.location.href=I.toURL();b.push(I);v.readyState=v.DONE;q(v,"writeend",K);};J.onerror=function(){var K=J.error;if(K.code!==K.ABORT_ERR){D();}};"writestart progress write abort".split(" ").forEach(function(K){J["on"+K]=v["on"+K];});J.write(t);v.abort=function(){J.abort();v.readyState=v.DONE;};v.readyState=v.WRITING;}),D);}),D);};G.getFile(u,{create:false},z(function(I){I.remove();H();}),z(function(I){if(I.code===I.NOT_FOUND_ERR){H();}else{D();}}));}),D);}),D);},d=f.prototype,a=function(s,t){return new f(s,t);};d.abort=function(){var s=this;s.readyState=s.DONE;q(s,"abort");};d.readyState=d.INIT=0;d.WRITING=1;d.DONE=2;d.error=d.onwritestart=d.onprogress=d.onwrite=d.onabort=d.onerror=d.onwriteend=null;h.addEventListener("unload",i,false);return a;}(self));
var BlobBuilder=BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||(function(j){"use strict";var c=function(v){return Object.prototype.toString.call(v).match(/^\[object\s(.*)\]$/)[1];},u=function(){this.data=[];},t=function(x,v,w){this.data=x;this.size=x.length;this.type=v;this.encoding=w;},k=u.prototype,s=t.prototype,n=j.FileReaderSync,a=function(v){this.code=this[this.name=v];},l=("NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR").split(" "),r=l.length,o=j.URL||j.webkitURL||j,p=o.createObjectURL,b=o.revokeObjectURL,e=o,i=j.btoa,f=j.atob,m=false,h=function(v){m=!v;},d=j.ArrayBuffer,g=j.Uint8Array;u.fake=s.fake=true;while(r--){a.prototype[l[r]]=r+1;}try{if(g){h.apply(0,new g(1));}}catch(q){}if(!o.createObjectURL){e=j.URL={};}e.createObjectURL=function(w){var x=w.type,v;if(x===null){x="application/octet-stream";}if(w instanceof t){v="data:"+x;if(w.encoding==="base64"){return v+";base64,"+w.data;}else{if(w.encoding==="URI"){return v+","+decodeURIComponent(w.data);}}if(i){return v+";base64,"+i(w.data);}else{return v+","+encodeURIComponent(w.data);}}else{if(real_create_object_url){return real_create_object_url.call(o,w);}}};e.revokeObjectURL=function(v){if(v.substring(0,5)!=="data:"&&real_revoke_object_url){real_revoke_object_url.call(o,v);}};k.append=function(z){var B=this.data;if(g&&z instanceof d){if(m){B.push(String.fromCharCode.apply(String,new g(z)));}else{var A="",w=new g(z),x=0,y=w.length;for(;x<y;x++){A+=String.fromCharCode(w[x]);}}}else{if(c(z)==="Blob"||c(z)==="File"){if(n){var v=new n;B.push(v.readAsBinaryString(z));}else{throw new a("NOT_READABLE_ERR");}}else{if(z instanceof t){if(z.encoding==="base64"&&f){B.push(f(z.data));}else{if(z.encoding==="URI"){B.push(decodeURIComponent(z.data));}else{if(z.encoding==="raw"){B.push(z.data);}}}}else{if(typeof z!=="string"){z+="";}B.push(unescape(encodeURIComponent(z)));}}}};k.getBlob=function(v){if(!arguments.length){v=null;}return new t(this.data.join(""),v,"raw");};k.toString=function(){return"[object BlobBuilder]";};s.slice=function(y,v,x){var w=arguments.length;if(w<3){x=null;}return new t(this.data.slice(y,w>1?v:this.data.length),x,this.encoding);};s.toString=function(){return"[object Blob]";};return u;}(self));

//for IE
var saveInIE = function(data, fileName) {
	if (document.execCommand) {
        var oWin = window.open("about:blank", "_blank");
        oWin.document.write(data);
        oWin.document.close();
        var success = oWin.document.execCommand('SaveAs', true, fileName);
        oWin.close();
        if (!success)
            alert("Sorry, your browser does not support this feature");
    } else {
    	alert("Sorry, your browser does not support save as command");
    }
};




//for Safari, the problem is fileName doesn't work
var saveInSafari = function(data, fileName) {
	//text/plain
	//application/octet-stream
	var uriContent = "data:application/octet-stream;filename=" + fileName + "," + encodeURIComponent(data);
	window.open(uriContent, fileName);
	//alert(newWindow);
};

	return {
		saveToCsvUtf8: function(content, fileName) {
			var link = document.createElement("a");
			link.setAttribute("href", "data:text/csv;charset=utf-8,\uFEFF" + content);
			link.setAttribute("download", fileName);
			link.click();
		},

		isChineseName: function(str) {
			return /[\u4e00-\u9fa5]/.test(str);
		},

		/**
		Now the input format is chinese + pinyin such as 张zhan 三san,
		We will split it into both chinese full name and pinyin full name,
		return is a array [ '张三'， 'zhang san']
		!!Now between chinese and pinyin there are some special char like \, + or space
		//As some foreigner such as taiwai/hongkong still have the chinese name, so need judge it smartly
		*/
		parseChineseName: function(surname, firstName) {
			var result = [];
			var isChinese = /[\u4e00-\u9fa5]/.test(surname) || /[\u4e00-\u9fa5]/.test(firstName);

			if ( isChinese) {
				var first = '\u4e00', last = '\u9fa5';
				var fullChinese='', fullEnglish='', c;
				for (var i=0; i<surname.length; i++) {
					c = surname.charAt(i);
					if ( c >= first && c<last) {
						fullChinese += c;
					} else if ( (c >= 'a' && c <= 'z') || ( c>='A' && c<= 'Z')) {
						fullEnglish += c;
					}
				}
				for ( i=0; i<firstName.length; i++) {
					c = firstName.charAt(i);
					if ( c >= first && c<last) {
						fullChinese += c;
					} else if ( (c >= 'a' && c <= 'z') || ( c>='A' && c<= 'Z')) {
						fullEnglish += c;
					}
				}
				result.push( fullChinese);
				result.push( fullEnglish);
			} else {
				var fullName = firstName + " " + surname;
				//need check with hr??
				result.push(fullName);
				result.push(fullName);
			}
			return result;
		},

		saveToFile : function(str, fileName) {
			if($.browser.msie) {
				saveInIE(str, fileName);
			} else if($.browser.safari) {
				//there is a length limitation in URL
				saveInSafari(str, fileName);
			} else {
				var bb = new BlobBuilder();
				bb.append(str);
				localSaveAs(bb.getBlob("text/plain;charset=utf-8"), fileName);
			}
		},

		info: function( info ) {
		    MessageBox.information(info);
		},
		
		warn: function( msg ) {
			MessageBox.warning(msg);
		},

		showError: function( msg, error ) {
			if (error) {
				//one special case, the UI part time out, so need tell user
				if (error.message == "Response did not contain a valid OData result"
					&& (error.responseText.indexOf("<!DOCTYPE ")==0) ) {
					MessageBox.error("Your session have been time out, the application will be reload after close the dialog!");
					window.location.reload();
					return;
				}
			
// message: "HTTP request failed"
// responseText: "<html><head><title>SAP - Error report</title><style><!--H1 {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;font-size:22px;} H2 {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;font-size:16px;} H3 {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;font-size:14px;} BODY {font-family:Tahoma,Arial,sans-serif;color:black;background-color:white;} B {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;} P {font-family:Tahoma,Arial,sans-serif;background:white;color:black;font-size:12px;}A {color : black;}A.name {color : black;}HR {color : #525D76;}--></style> </head><body><h1>HTTP Status 500 - org.apache.cxf.interceptor.Fault: Can't approved because it exceeds maximum allowed numbers</h1><HR size="1" noshade="noshade"><p><b>type</b> Exception report</p><p><b>message</b> <u>org.apache.cxf.interceptor.Fault: Can't approved because it exceeds maximum allowed numbers</u></p><p><b>description</b> <u>The server encountered an internal error that prevented it from fulfilling this request.</u></p><p><b>exception</b> <pre>java.lang.RuntimeException: org.apache.cxf.interceptor.Fault: Can't approved because it exceeds maximum allowed numbers↵	org.apache.cxf.interceptor.AbstractFaultChainInitiatorObserver.onMessage(AbstractFaultChainInitiatorObserver.java:116)↵	org.apache.cxf.phase.PhaseInterceptorChain.doIntercept(PhaseInterceptorChain.java:331)↵	org.apache.cxf.transport.ChainInitiationObserver.onMessage(ChainInitiationObserver.java:121)↵	org.apache.cxf.transport.http.AbstractHTTPDestination.invoke(AbstractHTTPDestination.java:239)↵	org.apache.cxf.transport.servlet.ServletController.invokeDestination(ServletController.java:223)↵	org.apache.cxf.transport.servlet.ServletController.invoke(ServletController.java:203)↵	org.apache.cxf.transport.servlet.ServletController.invoke(ServletController.java:137)↵	org.apache.cxf.transport.servlet.CXFNonSpringServlet.invoke(CXFNonSpringServlet.java:158)↵	org.apache.cxf.transport.servlet.AbstractHTTPServlet.handleRequest(AbstractHTTPServlet.java:243)↵	org.apache.cxf.transport.servlet.AbstractHTTPServlet.doPost(AbstractHTTPServlet.java:163)↵	javax.servlet.http.HttpServlet.service(HttpServlet.java:755)↵	org.apache.cxf.transport.servlet.AbstractHTTPServlet.service(AbstractHTTPServlet.java:219)↵	org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:52)↵</pre></p><p><b>root cause</b> <pre>org.apache.cxf.interceptor.Fault: Can't approved because it exceeds maximum allowed numbers↵	org.apache.cxf.service.invoker.AbstractInvoker.createFault(AbstractInvoker.java:162)↵	org.apache.cxf.service.invoker.AbstractInvoker.invoke(AbstractInvoker.java:128)↵	org.apache.cxf.jaxrs.JAXRSInvoker.invoke(JAXRSInvoker.java:198)↵	org.apache.cxf.jaxrs.JAXRSInvoker.invoke(JAXRSInvoker.java:261)↵	org.apache.cxf.jaxrs.JAXRSInvoker.invoke(JAXRSInvoker.java:100)↵	org.apache.cxf.interceptor.ServiceInvokerInterceptor$1.run(ServiceInvokerInterceptor.java:58)↵	org.apache.cxf.interceptor.ServiceInvokerInterceptor.handleMessage(ServiceInvokerInterceptor.java:94)↵	org.apache.cxf.phase.PhaseInterceptorChain.doIntercept(PhaseInterceptorChain.java:271)↵	org.apache.cxf.transport.ChainInitiationObserver.onMessage(ChainInitiationObserver.java:121)↵	org.apache.cxf.transport.http.AbstractHTTPDestination.invoke(AbstractHTTPDestination.java:239)↵	org.apache.cxf.transport.servlet.ServletController.invokeDestination(ServletController.java:223)↵	org.apache.cxf.transport.servlet.ServletController.invoke(ServletController.java:203)↵	org.apache.cxf.transport.servlet.ServletController.invoke(ServletController.java:137)↵	org.apache.cxf.transport.servlet.CXFNonSpringServlet.invoke(CXFNonSpringServlet.java:158)↵	org.apache.cxf.transport.servlet.AbstractHTTPServlet.handleRequest(AbstractHTTPServlet.java:243)↵	org.apache.cxf.transport.servlet.AbstractHTTPServlet.doPost(AbstractHTTPServlet.java:163)↵	javax.servlet.http.HttpServlet.service(HttpServlet.java:755)↵	org.apache.cxf.transport.servlet.AbstractHTTPServlet.service(AbstractHTTPServlet.java:219)↵	org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:52)↵</pre></p><p><b>root cause</b> <pre>java.lang.Error: Can't approved because it exceeds maximum allowed numbers↵	com.sap.csr.model.Registration.createUpdateModifiedTime(Registration.java:497)↵	sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)↵	sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:57)↵	sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)↵	java.lang.reflect.Method.invoke(Method.java:606)↵	org.eclipse.persistence.internal.security.PrivilegedAccessHelper.invokeMethod(PrivilegedAccessHelper.java:420)↵	org.eclipse.persistence.internal.jpa.metadata.listeners.EntityListener.invokeMethod(EntityListener.java:326)↵	org.eclipse.persistence.internal.jpa.metadata.listeners.EntityClassListener.invokeMethod(EntityClassListener.java:75)↵	org.eclipse.persistence.internal.j….eclipse.persistence.descriptors.DescriptorEventManager.notifyEJB30Listeners(DescriptorEventManager.java:684)↵	org.eclipse.persistence.descriptors.DescriptorEventManager.executeEvent(DescriptorEventManager.java:229)↵	org.eclipse.persistence.internal.queries.DatabaseQueryMechanism.updateObjectForWriteWithChangeSet(DatabaseQueryMechanism.java:1001)↵	org.eclipse.persistence.queries.UpdateObjectQuery.executeCommitWithChangeSet(UpdateObjectQuery.java:84)↵	org.eclipse.persistence.internal.queries.DatabaseQueryMechanism.executeWriteWithChangeSet(DatabaseQueryMechanism.java:301)↵	org.eclipse.persistence.queries.WriteObjectQuery.executeDatabaseQuery(WriteObjectQuery.java:58)↵	org.eclipse.persistence.queries.DatabaseQuery.execute(DatabaseQuery.java:904)↵	org.eclipse.persistence.queries.DatabaseQuery.executeInUnitOfWork(DatabaseQuery.java:803)↵	org.eclipse.persistence.queries.ObjectLevelModifyQuery.executeInUnitOfWorkObjectLevelModifyQuery(ObjectLevelModifyQuery.java:108)↵	org.eclipse.persistence.queries.ObjectLevelModifyQuery.executeInUnitOfWork(ObjectLevelModifyQuery.java:85)↵	org.eclipse.persistence.internal.sessions.UnitOfWorkImpl.internalExecuteQuery(UnitOfWorkImpl.java:2896)↵	org.eclipse.persistence.internal.sessions.AbstractSession.executeQuery(AbstractSession.java:1857)↵	org.eclipse.persistence.internal.sessions.AbstractSession.executeQuery(AbstractSession.java:1839)↵	org.eclipse.persistence.internal.sessions.AbstractSession.executeQuery(AbstractSession.java:1790)↵	org.eclipse.persistence.internal.sessions.CommitManager.commitChangedObjectsForClassWithChangeSet(CommitManager.java:273)↵	org.eclipse.persistence.internal.sessions.CommitManager.commitAllObjectsWithChangeSet(CommitManager.java:131)↵	org.eclipse.persistence.internal.sessions.AbstractSession.writeAllObjectsWithChangeSet(AbstractSession.java:4263)↵	org.eclipse.persistence.internal.sessions.UnitOfWorkImpl.commitToDatabase(UnitOfWorkImpl.java:1441)↵	org.eclipse.persistence.internal.sessions.UnitOfWorkImpl.commitToDatabaseWithPreBuiltChangeSet(UnitOfWorkImpl.java:1587)↵	org.eclipse.persistence.internal.sessions.RepeatableWriteUnitOfWork.writeChanges(RepeatableWriteUnitOfWork.java:455)↵	org.eclipse.persistence.internal.jpa.EntityManagerImpl.flush(EntityManagerImpl.java:874)↵	org.apache.olingo.odata2.jpa.processor.core.access.data.JPAProcessorImpl.processUpdate(JPAProcessorImpl.java:382)↵	org.apache.olingo.odata2.jpa.processor.core.access.data.JPAProcessorImpl.process(JPAProcessorImpl.java:237)↵	org.apache.olingo.odata2.jpa.processor.core.ODataJPAProcessorDefault.updateEntity(ODataJPAProcessorDefault.java:137)↵	org.apache.olingo.odata2.core.Dispatcher.dispatch(Dispatcher.java:92)↵	org.apache.olingo.odata2.core.ODataRequestHandler.handle(ODataRequestHandler.java:130)↵	org.apache.olingo.odata2.core.rest.ODataSubLocator.handle(ODataSubLocator.java:167)↵	org.apache.olingo.odata2.core.rest.ODataSubLocator.handlePost(ODataSubLocator.java:90)↵	sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)↵	sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:57)↵	sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)↵	java.lang.reflect.Method.invoke(Method.java:606)↵	org.apache.cxf.service.invoker.AbstractInvoker.performInvocation(AbstractInvoker.java:180)↵	org.apache.cxf.service.invoker.AbstractInvoker.invoke(AbstractInvoker.java:96)↵	org.apache.cxf.jaxrs.JAXRSInvoker.invoke(JAXRSInvoker.java:198)↵	org.apache.cxf.jaxrs.JAXRSInvoker.invoke(JAXRSInvoker.java:261)↵	org.apache.cxf.jaxrs.JAXRSInvoker.invoke(JAXRSInvoker.java:100)↵	org.apache.cxf.interceptor.ServiceInvokerInterceptor$1.run(ServiceInvokerInterceptor.java:58)↵	org.apache.cxf.interceptor.ServiceInvokerInterceptor.handleMessage(ServiceInvokerInterceptor.java:94)↵	org.apache.cxf.phase.PhaseInterceptorChain.doIntercept(PhaseInterceptorChain.java:271)↵	org.apache.cxf.transport.ChainInitiationObserver.onMessage(ChainInitiationObserver.java:121)↵	org.apache.cxf.transport.http.AbstractHTTPDestination.invoke(AbstractHTTPDestination.java:239)↵	org.apache.cxf.transport.servlet.ServletController.invokeDestination(ServletController.java:223)↵	org.apache.cxf.transport.servlet.ServletController.invoke(ServletController.java:203)↵	org.apache.cxf.transport.servlet.ServletController.invoke(ServletController.java:137)↵	org.apache.cxf.transport.servlet.CXFNonSpringServlet.invoke(CXFNonSpringServlet.java:158)↵	org.apache.cxf.transport.servlet.AbstractHTTPServlet.handleRequest(AbstractHTTPServlet.java:243)↵	org.apache.cxf.transport.servlet.AbstractHTTPServlet.doPost(AbstractHTTPServlet.java:163)↵	javax.servlet.http.HttpServlet.service(HttpServlet.java:755)↵	org.apache.cxf.transport.servlet.AbstractHTTPServlet.service(AbstractHTTPServlet.java:219)↵	org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:52)↵</pre></p><p><b>note</b> <u>The full stack trace of the root cause is available in the SAP logs.</u></p><HR size="1" noshade="noshade"><h3>SAP</h3></body></html>"
// statusCode: 500
// statusText: "Internal Server Error"
				//as now server use special format like [[#  #]]
				var startPos = error.responseText.indexOf("[[#");
				if (startPos != -1) {
					var endPos = error.responseText.indexOf("#]");
					if (endPos != -1)
						msg += error.responseText.substring(startPos+3,endPos);
				}
				var detailMsg = error.message + " Status Text:" + error.statusText + "\r\nReason: " + error.responseText;
				MessageBox.error(msg, {
					details: detailMsg
				});
			} else {
		    	MessageBox.error(msg);
		    }
		},
		
		showToast : function( msg ) {
		    MessageToast.show(msg);
		},

		getMyAttachmentUrl: function( userId) {
		    // var url = Config.getConfigure().AttachmentUrl;
		    var url = "/Attachments?$filter=UserId eq '" + userId + "'";
		    return url;
		},

		getAttachmentUploaderUrl: function( userId, type, fileName) {
			//??avoid issue,fileName will remove space
			fileName= fileName.trim();
			var url = Config.getConfigure().AttachmentLoaderUrl;
			//for the file name, we need escape
			url += "?UserId=" + userId + "&Type=" + type + "&FileName=" + fileName;
			return url;
		},

		getAttachmentDownloadUrl: function( userId, type) {
			var url = Config.getConfigure().AttachmentLoaderUrl;
			url += "?UserId=" + userId + "&Type=" + type ;
			return url;
		},


		getRelativeAttachmentDownloadUrl: function( userId, type) {
			var url = Config.getConfigure().RelativeAttachmentLoaderUrl;
			url += "?UserId=" + userId + "&Type=" + type ;
			return url;
		},


		setTableColumnsFilterSortProperty: function( table ) {
		    var aCol = table.getColumns();
		    for (var i=0; i < aCol.length; i++) {
		    	var  col = aCol[i];

		    	//team can't do fitler
				var bFilterable = true;
				var id = col.getId();
				if (id.indexOf("TeamCol") != -1) {
					bFilterable = false;
				} 

		    	var template = col.getTemplate();
		    	var prop = "text";
		    	if (template instanceof sap.m.ObjectStatus) {
		    		prop = "state";
		    	}

		    	var binding = template.getBindingInfo(prop);

			    if (binding && binding.parts && binding.parts.length ==1) {
			    	var path = binding.parts[0].path;
			 
			    	col.setSortProperty(path);
			    	if (bFilterable)
			    		col.setFilterProperty(path);
			    }
		    }
		},

		_getExportColumns: function( table ) {
		    var aCol = table.getColumns();
		    var ret = [];
		    for (var i=0; i < aCol.length; i++) {
		    	var  col = aCol[i];
		    	if (!col.getVisible())
		    		continue;

		    	var template = col.getTemplate();
		    	var prop = "text";
		    	if (template instanceof sap.m.ObjectStatus) {
		    		prop = "state";
		    	} 

		    	var binding = template.getBindingInfo(prop);
			    if (binding && binding.parts && binding.parts.length ==1) {
			    	var path = binding.parts[0].path;

			    	var label = col.getLabel();
			    	var entry = 
			    	 {
			            name: label.getText(), 
			            template: {
			                content: {
			                    path: path
			                }
			            }
			        };
			        ret.push(entry);
			    }
		    }

		    return ret;
		},
		
		exportTableContent: function( oTable, fileName ) {
			var binding = oTable.getBinding('rows');
			if (!binding)
				return;

		    var oExport = new Export({
			    // Type that will be used to generate the content. Own ExportType's can be created to support other formats
			    exportType: new ExportTypeCSV({
			        separatorChar: ","
			    }),

			    // Pass in the model created above
			    models: binding.getModel(),

			    // binding information for the rows aggregation 
			    rows: {
			        path: binding.getPath() 
			    },

			    // column definitions with column name and binding info for the content
			    columns:  this._getExportColumns(oTable),
			});

			var that = this;
			oExport.generate().then(function(sContent) {
				// that.saveToFile(sContent, fileName);
				//the second column is idPassport, also add ="" in order to show full id
				//In different platform they may use \r\n or just \n , so here use \n for safety
				var aLine = sContent.split('\n');
				var result = [];
				result.push( aLine[0].trim() );
				for (var i=1; i<aLine.length; i++) {
					var line = aLine[i].trim();
					var aCol = line.split(',');
					aCol[1] = '="' + aCol[1] + '"';
					result.push( aCol.join(',') );
				}
				that.saveToCsvUtf8(result.join("\r\n"), fileName);
			});
		},

	};
});