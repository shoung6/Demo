
var app=(function(){
	var $=this;
	$.DownFreshLock=false;
	$.Waiting=false;
	$.ra=0;
	$.refresh_height=0;
	$.waiting_upfresh=false;//上啦加载锁定
	$.init=function(){
		
	};
	
	    //开新页面
    $.openPage = function (pageUrl,extra){
        mui.openWindow({
            url: pageUrl,
            id: pageUrl,
            styles: {
                scrollIndicator: 'none'
            },
            show: {
                aniShow: 'pop-in'
            },
            waiting: {
                autoShow: false
            },
            extras: extra
        });
    }
	//获取验证码效果
	$.sendSMS=function (obj) {
		var i=50;
	    var html='剩余 ('+i+'s)';
	    var timer=window.setInterval(function () {
	    	i--;
	    	html='剩余( '+i+'s)';
	    	obj.innerHTML=html;
	    	if(i<=0){
	    		obj.classList.remove('active');
	    		obj.innerHTML='获取验证码';
	    		window.clearInterval(timer);
	    	}
	    },1000);
	    obj.classList.add('active');
	    obj.innerHTML=html;
	};
	//ajax
	/*
		使用：
		app.ajax({
			url:'/User/user_save',
			data:json_obj,
			callback:function(data){
				//这里写东西
			},errorback:function(a){
				
			}
		});
	*/
	$.ajax=function(settings){
		//var siteURL='http://192.168.31.208:8080/App/Index/get_index_info';
		var siteURL=window.localStorage.siteUrl;
		var json_str=JSON.stringify(settings.data);
		console.log(settings.url+"上传数据"+json_str);
		mui.ajax(siteURL+settings.url,{
			type:"post",
			data:{data:json_str},
			dataType:'json',
			async:true,
			timeout:20000,
			beforeSend:function (request) {
				 request.setRequestHeader("ACUID", window.localStorage.UID);
				 request.setRequestHeader("ACUUID", plus.device.uuid);
				 request.setRequestHeader("ACPHONE", plus.os.name);
				 request.setRequestHeader("ACMODEL", plus.device.model);
				 request.setRequestHeader("ACTIME", (new Date()).getTime());
			},
			success:function (json) {
//			    console.log(JSON.stringify(json));
				//console.log(siteURL+settings.url);
				try{json.ErrorCode;}catch(e){console.log('服务器端数据格式不正确');console.log(json);return;}
				if(json.ErrorCode==0){
					if(json.Data){
					if(json.ErrorMsg.length>0){mui.toast(json.ErrorMsg);}
					console.log(settings.url+"获得数据"+JSON.stringify(json.Data));
					settings.callback(json.Data,siteURL+settings.url);
					}else{console.log('无数据内容');}
				}else{
					if(settings.errorback){
						settings.errorback();
					}
					console.log('sql='+json.ErrorSql);
					console.log(json.ErrorMsg); 
					mui.toast(json.ErrorMsg);
				}
			},error:function (a,b,c) {
				if(settings.errorback){
					settings.errorback(a);
				}
				console.log(a.response);
				console.log('请检查url地址:'+siteURL+settings.url+"与手机网络");
				mui.toast('网络请求失败');
			}
		});
	}
	//是否为空字符串
	$.empty=function(str,len){
		if(len){len--;}else{len=0};
		try{
			if(typeof str !='string'){
				return true;
			}
			if(str.replace(/(^s*)|(s*$)/g, "").length <=len){
				return true;
			}
			return false;
		}catch(e){
			return true;
		}
	}
	//国内手机号码
	$.isPhone=function (phone) {
		try{
			var reg=/^((1[0-9]{2})+\d{8})$/i;
			if(!reg.test(phone)){
				return false;
			}
			return true;
		}catch(e){
			return false;
		}
	}
	//是否为邮箱
	$.isEmail=function (email) {
		try{
			var reg  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if(!reg.test(email)){
			return false;
			}
			return true;
		}catch(e){
			return false;
		}
	}
	//是否为数字
	$.intval=function (str) {
		try{
			if(!isNaN(str)){
				return str;
			}else{
				return 0;
			}
		}catch(e){
			return 0;
		}
	}
	
//  var Share = {};
//  Share.info={
//    name:'专注科技分享',
//    head_imge:"../images/100x100.png",
//    introduce:'专注科技',
//    href:'http://www.baidu.com'
//  };
//  wrhShare(Share);
  $.wrhShare = function(Share){
    var shares = {};
    init=function(){
          plus.share.getServices( function(s){
              shares={};
              for(var i in s){
                  var t=s[i];
                  shares[t.id]=t;
              }
          }, function(e){
             mui.toast( "获取分享服务列表失败："+e.message );
      });
  
      };
      shareAction=function(id,ex){
      var s=null;
          if(!id||!(s=shares[id])){
              mui.toast( "无效的分享服务！" );
              return;
          }
          if ( s.authenticated ) {
               shareMessage(s,ex);
          } else {
              s.authorize( function(){
                  shareMessage(s,ex);
              },function(e){
                  mui.toast( "认证授权失败："+e.code+" - "+e.message );
              });
          }
    };
    shareMessage=function(s,ex){
      var sharecount = 0;
      plus.nativeUI.showWaiting();
      var msg = {
        extra:{
          scene: ex
        } 
      };
      msg.href = Share.info.href;
      msg.title = Share.info.name;
      msg.content = Share.info.introduce;
      var img = plus.io.convertAbsoluteFileSystem(Share.info.head_imge.replace('file://',''));
      msg.thumbs = [img];
      if(sharecount > 0){
        msg.thumbs = ["img.src"];
      }
      console.log(JSON.stringify(msg))
      s.send(msg,function(){
        plus.nativeUI.closeWaiting();
        var strtmp = "分享到"+ s.description +"成功!";
        plus.nativeUI.toast('返回成功',{
          verticalAlign:'center'
        });
        sharecount = 0;
      },function(e){
        plus.nativeUI.closeWaiting();
        if(e.code == -2){
          plus.nativeUI.toast('已取消分享',{
            verticalAlign:'center'
          });
          sharecount = 0;
        }else if(e.code == -3 || e.code == -8){
          if(++sharecount < 2){
            shareMessage(s,ex);
          }else{
            sharecount = 0;
            plus.nativeUI.toast('分享失败',{
              verticalAlign:'center'
            });
          }
        }else{
          console.error('分享失败:' + JSON.stringify(e))
        }
      });
    };
      init();
    var ids=[{id:"weixin",ex:"WXSceneSession"},{id:"weixin",ex:"WXSceneTimeline"},{id:"qq"}],
    bts = [{title:"发送给微信好友"},{title:"分享到微信朋友圈"},{title:"分享到QQ好友"}];
    plus.nativeUI.actionSheet({cancel:"取消",buttons:bts},
      function(e){var i = e.index;if(i > 0){shareAction(ids[i - 1].id, ids[i - 1].ex)}}
    );
  }
	
	
	//获取窗口高度
//	$.windowHeight=function () {
//		return Math.ceil(plus.screen.resolutionHeight-plus.navigator.getStatusbarHeight());
//	}
	//获取窗口宽度
//	$.windowWidth=function () {
//		return Math.ceil(window.screen.availWidth/3);
//	}
	/*
	 	上传照片功能
		使用方法 
		app.getPhoto(function(imageData){
			document.querySelector('#box').src=imageData;
		},true);
		参数：callback 回调方法
		参数：compress 是否压缩，默认为压缩
	*/
	$.getPhoto=function(callback,compress){
		compress=compress?compress:true;
		var btns = [{title: "拍照"}, {title: "从相册选择"}];
		//var btns - [{title:"nihao"},{title:"nihuai"}];
		plus.nativeUI.actionSheet({
			//title: "修改头像",
			cancel: "取消",
			buttons: btns
		}, function(btn) {
			switch (btn.index) {
				case 1:cameraImage();break;
				case 2:galleryImg();break;
				default:break;
			}
		});
		function cameraImage() {//相机
			plus.camera.getCamera().captureImage(function(e) {
				plus.io.resolveLocalFileSystemURL(e, function(entry) {
					var obj = entry.toLocalURL() + "?version=" + new Date().getTime();
					appendFile(obj,1);
				}, function(e) {
					console.log("读取拍照文件错误：" + e.message);
				});
			}, function(e) {}, {filename: "_doc/temp.jpg"});
		}
		function galleryImg() { //相册
			plus.gallery.pick(function(e) {
				console.log(e);
				plus.io.resolveLocalFileSystemURL(e, function(entry) {
					var obj = entry.fullPath+ "?version=" + new Date().getTime();
					appendFile(obj,2);//处理图片的地方
				}, function(e) {
					console.log("读取拍照文件错误：" + e.message);
				});
			}, function(e) {}, {filter: "image"})
		};
		function appendFile(path,imgType){
			var waiting=plus.nativeUI.showWaiting("图片处理中");
			var img = new Image();
		    img.src = path;
		    img.onload = function () {
		    	EXIF.getData(img, function() {
	            	Orientation=EXIF.getTag(img, 'Orientation');
	            	var that = this;
				    var w = that.width,h = that.height;
					var canvas = document.createElement('canvas');
			        var ctx = canvas.getContext('2d');
				    
		        	if(h <= w){
		        		if(compress){
							scale = w / h ;
							w = 480 || w;
							h = w/scale ;
						}
						if(Orientation==8||Orientation==6){
							canvas.setAttribute('width',h);
							canvas.setAttribute('height',w);
						}else{
							canvas.setAttribute('width',w);
							canvas.setAttribute('height',h);
						}
						
						var x=Math.ceil(w/2);
						var y=Math.ceil(h/2);
						if(Orientation==8){
							ctx.translate(y,x);
							ctx.rotate(-90*Math.PI/180);
							ctx.drawImage(that, -x,-y,w,h);
						}else if(Orientation==6){
							ctx.translate(y,x);
							ctx.rotate(90*Math.PI/180);
							ctx.drawImage(that, -x,-y,w,h);
						}else if(Orientation==3){
							ctx.translate(x,y);
							ctx.rotate(180*Math.PI/180);
							ctx.drawImage(that, -x,-y,w,h);
						}else{
							ctx.drawImage(that, 0,0,w,h);
						}
						
					}else if(w < h){
						if(compress){
							scale = h / w;
							h = 480 || h;
							w = h / scale;
						}
						canvas.setAttribute('width',w);
						canvas.setAttribute('height',h);
						ctx.drawImage(that,0,0,w,h);
					}
		        	var base64 = canvas.toDataURL('image/jpeg', 1 || 0.8 );   //1最清晰，越低越模糊。
		        	plus.nativeUI.closeWaiting(waiting);
		        	callback(base64);
		        });
		        
		    }
		};
		
	}
	
	return $;
})();

