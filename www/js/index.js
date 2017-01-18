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
        this.receivedEvent('deviceready');
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
			  }
			});
		});
		
    },
	
	loadUrl: function (url) {
		console.log('load url : ' + url);
		this.url = url;
		this.reload();
	},
	
	reload: function () {
		if(this.browser) {
			this.browser.close();	
		}
		$('body').hide();//hiding admin page to user. 
		this.browser = window.inAppBrowserXwalk.open(this.url, {toolbarHeight: '0'});
		this.goFullScreen();
	},
	goFullScreen: function () {
		if(!this.fullScreen) {
			var that = this;
			this.fullScreen = true;
			window.ShellExec.exec(['su', '-c', 'service call activity 42 s16 com.android.systemuis'], function(res){
				if(res.exitStatus !== 0) {
					console.error('fullscreen error ' + res.output);
					that.fullScreen = false;
				}
			});
		}
	},
	exitFullScreen: function () {
		var that = this;
		this.fullScreen = false;
		window.ShellExec.exec(['su', '-c', 'LD_LIBRARY_PATH=/vendor/lib:/system/lib am startservice -n com.android.systemui/.SystemUIService'], function(res){
			if(res.exitStatus !== 0) {
				console.error('exit fullscreen error ' + res.output);
			}
		});
	},
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();