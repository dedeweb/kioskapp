/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
	
	url: null,
  apiUrl: null,
	browser: null,
	fullScreen: false,
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
		var that = this;
        //window.inAppBrowserXwalk.open('https://webrtc.github.io/samples/src/content/getusermedia/gum/', {toolbarHeight: '0'});
		jxcore.isReady(function() {
			console.log('JXCORE ready!'); 
			
			 jxcore('app.js').loadMainFile(function(ret, err) {
			  if (err) {
				console.error('JXCORE err' + JSON.stringify(err));
			  } else {
				console.log('JXCORE Loaded');
				//jxcore_ready();
				jxcore('getVersion').register(function (callback) {
					cordova.getAppVersion.getVersionNumber(callback);
				});
				
				jxcore('loadUrl').register(function (url) { that.loadUrl(url); });
				jxcore('reload').register(function () { that.reload(); });
				jxcore('exit').register(function () { that.exitFullScreen(); });
				jxcore('fullscreen').register(function () { that.goFullScreen(); });
			  }
			});
		});
		
		$(document).ready(function () {
			$('#btnLoadUrl').click(function (){
        
        if($('#fsCheck').is(":checked")) {
          that.loadUrl($('#txtUrl').val());  
        } else {
          that.loadUrlTest($('#txtUrl').val());  
        }
			});
      
       $('#btnTestApi').click(function () {
         that.testApi(that.apiUrl);
       });
			that.displayAddress();
		});
		
    },
	testApi: function(apiUrl) {
    $('#apiCheckResult').html('...');
    if (apiUrl) {
        $.get(apiUrl + '/version').done(function( data ) {
          if(data.app === 'kioskApp') {
            $('#apiCheckResult').html('OK, version = ' + data.version);  
          } else {
            $('#apiCheckResult').html('wrong app name : ' + data.app);
          }
        }).fail(function(ex) {
          $('#apiCheckResult').html('api call fail :(' + JSON.stringify(ex) );
        });
     }
  },
	loadUrl: function (url) {
		console.log('load url : ' + url);
		this.url = url;
		this.reload();
		this.goFullScreen();
	},
  
  loadUrlTest: function(url) {
    console.log('load url test : ' + url);
		this.url = url;
		this.reload();
  },
	
	reload: function () {
		if(this.browser) {
			this.browser.close();	
		}
		$('body').hide();//hiding admin page to user. 
		this.browser = window.inAppBrowserXwalk.open(this.url, {toolbarHeight: '0'});
	},

	displayAddress: function () {
    var that = this;
    networkinterface.getWiFiIPAddress(function (ipInfo) {
      $('#srvAdr').text( '[wifi] http://' + ipInfo.ip + ':1664' );
      that.apiUrl = 'http://' + ipInfo.ip + ':1664';
      $('#btnTestApi').attr('disabled', false);
      that.testApi(that.apiUrl);
    }, function () {
      networkinterface.getCarrierIPAddress(function (ipInfo) {
        $('#srvAdr').text( '[carrier] http://' + ipInfo.ip + ':1664' );
        that.apiUrl = 'http://' + ipInfo.ip + ':1664';
        $('#btnTestApi').attr('disabled', false);
        that.testApi(that.apiUrl);
      }, function(error) {
        $('#srvAdr').text('error getting ip : ' + error);      
      });
    });
	},
	goFullScreen: function () {
		if(!this.fullScreen) {
			var that = this;
			this.fullScreen = true;
			window.ShellExec.exec(['su', '-c', 'service call activity 42 s16 com.android.systemui'], function(res){
				if(res.exitStatus !== 0) {
					console.error('fullscreen error ' + res.output);
					that.fullScreen = false;
				}
			});
		}
	},
	exitFullScreen: function () {
		this.fullScreen = false;
		window.ShellExec.exec(['su', '-c', 'LD_LIBRARY_PATH=/vendor/lib:/system/lib am startservice -n com.android.systemui/.SystemUIService'], function(res){
			if(res.exitStatus !== 0) {
				console.error('exit fullscreen error ' + res.output);
			}
		});
	}

};

app.initialize();