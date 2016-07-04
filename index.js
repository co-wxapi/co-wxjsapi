'use strict';
var WxBase = require('co-wxbase');
var wxsign = require('co-wxsign');
class WxJSAPI extends WxBase {
  constructor(config){
    super(config);
  }

  allAPIs(){
    return ['onMenuShareTimeline',
      'onMenuShareAppMessage',
      'onMenuShareQQ',
      'onMenuShareWeibo',
      'onMenuShareQZone',
      'startRecord',
      'stopRecord',
      'onVoiceRecordEnd',
      'playVoice',
      'pauseVoice',
      'stopVoice',
      'onVoicePlayEnd',
      'uploadVoice',
      'downloadVoice',
      'chooseImage',
      'previewImage',
      'uploadImage',
      'downloadImage',
      'translateVoice',
      'getNetworkType',
      'openLocation',
      'getLocation',
      'hideOptionMenu',
      'showOptionMenu',
      'hideMenuItems',
      'showMenuItems',
      'hideAllNonBaseMenuItem',
      'showAllNonBaseMenuItem',
      'closeWindow',
      'scanQRCode',
      'chooseWXPay',
      'openProductSpecificView',
      'addCard',
      'chooseCard',
      'openCard'];
  }

  *getTicket(accessToken){
    if ( !accessToken ) {
      accessToken = yield this.provider.getAccessToken();
    }
    var url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`;
    var result = yield this.jsonRequest(url, 'GET');
    return result;
  }

  *sign(url, ticket) {
    if ( !ticket ) ticket = yield this.provider.getJSAPITicket();
    var pos = url.indexOf('#');
    if ( pos >= 0 ) {
      url = url.substr(0, pos);
    }
    var params = {
      noncestr: wxsign.generateNonceStr(),
      jsapi_ticket: ticket,
      timestamp: new Date().getTime(),
      url: encodeURIComponent(url)
    };
    var sign = wxsign.sha1Sign(params);
    return {
      nonceStr: params.noncestr,
      timestamp: params.timestamp,
      signature: sign
    }
  }

  *wxConfig(url,jsApiList,debug,ticket){
    if ( !ticket ) ticket = yield this.provider.getJSAPITicket();
    console.log('ticket', ticket);
    var config = yield this.sign(url, ticket);
    config.debug = !!debug;
    config.jsApiList = jsApiList || this.allAPIs();
    return config;
  }
}

module.exports = function(config){
  var api = new WxJSAPI(config);
  return api;
}
