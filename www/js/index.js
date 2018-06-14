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
    fullScreen: false,
    url: '',
    apiUrl: '',
    browser: null,
    initDevice: function () {
        document.addEventListener('deviceready', () => {
            this.initJxcore();
            this.initJQuery();
        }, false);
    },

    initJxcore: function () {
        jxcore.isReady(() => {
            console.log('JXCORE ready!');

            jxcore('app.js').loadMainFile((ret, err) => {
                if (err) {
                    console.error('JXCORE err' + JSON.stringify(err));
                } else {
                    console.log('JXCORE Loaded');
                    //jxcore_ready();
                    jxcore('getVersion').register(function (callback) {
                        cordova.getAppVersion.getVersionNumber(callback);
                    });

                    jxcore('loadUrl').register( (url) => { this.jxc_loadUrl(url); });
                    jxcore('reload').register(() => { this.jxc_reload(); });
                    jxcore('exit').register( () => { this.jxc_exitFS(); });
                    jxcore('fullscreen').register(() => { this.jxc_goFS(); });
                }
            });
        });
    },
    initJQuery: function() {
        const textField = new mdc.textfield.MDCTextField(document.querySelector('.mdc-text-field'));
        $(document).ready(() => {
            this.hideRefreshApi();

            $('#refreshButtonUrl').click(() => { this.refreshAPIUrl();});
            $('#refreshButton').click(() => { this.testApi();});
            $('#errDetails').click(() => { $('#details').toggle(); });

            $('#windowedLbl').hide();

            $('.mdc-switch input:checkbox').change(function() {
                if($('.mdc-switch input').is(':checked') ) {
                    $('#windowedLbl').hide();
                    $('#fsLabel').show();
                } else {
                    $('#windowedLbl').show();
                    $('#fsLabel').hide();
                }


            });

            $('#loadUrlBtn').click(() => {this.loadUrl($('#url-field').val(), $('.mdc-switch input').is(':checked') );});


            this.refreshAPIUrl();
        });
    },

    //U.I management callback& funcs
    apiGoLoading: function () {
        $('#apiStatus').show();
        $('#apiFail').hide();
        $('#apiOk').hide();
        $('#refreshButton i').addClass('animate-spin');
    },
    apiStopLoading: function () {
        $('#refreshButton i').removeClass('animate-spin');
    },
    dispAPIUrl: function (url) {
        $('#apiUrl').text(url);
    },
    dispAPIErr: function (err, debugErr) {
        $('#apiStatus').show();
        $('#apiFail').show();
        $('#apiFail .err-msg').text(err);
        if(debugErr) {
            $('#errDetails').show();
            $('#details').text(debugErr);
        }
    },
    dispAPIOK: function (msg) {
        $('#apiStatus').show();
        $('#apiOk').show();
        $('#apiOk .msg').text(msg);
        $('#loadUrlBtn').removeAttr('disabled');
    },
    hideRefreshApi: function() {
        $('#apiStatus').hide();
        $('#apiFail').hide();
        $('#apiOk').hide();
        $('#errDetails').hide();
        $('#details').hide();
    },

    refreshAPIUrl: function () {
        this.hideRefreshApi();
        $('#refreshButtonUrl').addClass('animate-spin');
        if(typeof networkinterface === 'undefined') {
            $('#refreshButtonUrl').removeClass('animate-spin');
            this.dispAPIUrl('error getting ip');
        } else {
            networkinterface.getWiFiIPAddress((ipInfo) => {
                this.dispAPIUrl( '[wifi] http://' + ipInfo.ip + ':1664' );
                this.apiUrl = 'http://' + ipInfo.ip + ':1664';
                $('#refreshButtonUrl').removeClass('animate-spin');
                this.testApi(this.apiUrl);
            }, function () {
                networkinterface.getCarrierIPAddress( (ipInfo) => {
                    this.dispAPIUrl( '[carrier] http://' + ipInfo.ip + ':1664' );
                    this.apiUrl = 'http://' + ipInfo.ip + ':1664';
                    $('#refreshButtonUrl').removeClass('animate-spin');
                    this.testApi(this.apiUrl);
                }, (error) => {
                    $('#refreshButtonUrl').removeClass('animate-spin');
                    this.dispAPIUrl('error getting ip : ' + error);
                });
            });
        }
    },
    testApi: function () {
        this.apiGoLoading();
        if (apiUrl) {
            $.get(apiUrl + '/version').done(( data ) => {
                if(data.app === 'kioskApp') {
                    this.dispAPIOK('OK, version = ' + data.version);
                } else {
                    this.dispAPIErr('wrong app name : ' + data.app);
                }
                this.apiStopLoading();
            }).fail((ex) => {
                this.dispAPIErr('api call fail :(' ,JSON.stringify(ex) );
                this.apiStopLoading();
            });
        }
    },
    // browsing management funcs
    goFullScreen : function () {
        if(!this.fullScreen) {
            this.fullScreen = true;
            window.ShellExec.exec(['su', '-c', 'service call activity 42 s16 com.android.systemui'], (res) => {
                if(res.exitStatus !== 0) {
                    console.error('fullscreen error ' + res.output);
                    this.fullScreen = false;
                }
            });
        }
    },
    exitFullscreen: function () {
        this.fullScreen = false;
        window.ShellExec.exec(['su', '-c', 'LD_LIBRARY_PATH=/vendor/lib:/system/lib am startservice -n com.android.systemui/.SystemUIService'], function(res){
            if(res.exitStatus !== 0) {
                console.error('exit fullscreen error ' + res.output);
            }
        });
    },
    loadUrl: function(url, kiosk) {
        console.log('load url : ' + url);
        this.url = url;
        this.reloadBrowser();
        if(kiosk) {
            this.goFullScreen();
        }
    },
    reloadBrowser: function ()  {
        if(this.browser) {
            this.browser.close();
        }
        $('body').hide();//hiding admin page to user.
        this.browser = window.inAppBrowserXwalk.open(this.url, {toolbarHeight: '0'});
    },

    //jxcore callbacks
    jxc_loadUrl: function (url) {
        this.loadUrl(url, true);
    },
    jxc_reload: function () {
        this.reloadBrowser();
    },
    jxc_exitFS: function () {
        this.exitFullscreen();
    },
    jxc_goFS: function () {
        this.goFullScreen();
    }
};


app.initDevice();