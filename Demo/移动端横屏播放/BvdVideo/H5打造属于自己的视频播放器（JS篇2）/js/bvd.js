(function($) {

    var bvd = function(dom) {
    	var that = this;
		$.ready(function() {
			//获取视频元素
			that.video = document.querySelector(dom || 'video');
			//获取视频父元素
			that.vRoom = that.video.parentNode;
			//元素初始化
			that.initEm();
			//事件初始化
			that.initEvent();
			//记录信息
			that.initInfo();
			//当前播放模式 false 为 mini播放
			that.isMax = false;
		})
	}

	var pro = bvd.prototype;

	//记录信息
	pro.initInfo = function() {
		var that = this;
		//在onload状态下，offsetHeight才会获取到正确的值
		window.onload = function(){
			that.miniInfo = {//mini状态时的样式
				width: that.video.offsetWidth + 'px',
				height: that.video.offsetHeight + 'px',
				position: that.vRoom.style.position,
				transform: 'translate(0,0) rotate(0deg)'
			}
	
			var info = [
					document.documentElement.clientWidth || document.body.clientWidth,
					document.documentElement.clientHeight || document.body.clientHeigth
				],
				w = info[0],
				h = info[1],
				cha = Math.abs(h - w) / 2;
				
			that.maxInfo = {//max状态时的样式
				zIndex:99,
				width: h + 'px',
				height: w + 'px',
				position: 'fixed',
				transform: 'translate(-' + cha + 'px,' + cha + 'px) rotate(90deg)'
			}
			
		}
		
		
	}

	pro.initEm = function() {
		
		//先添加播放按钮
		this.vimg = document.createElement("img");
		this.vimg.src = 'data:image/png;base64,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';
		this.vimg.className = 'vplay';
		this.vRoom.appendChild(this.vimg);

		//添加控制条
		this.vC = document.createElement("div");
		this.vC.classList.add('controls');
		this.vC.innerHTML = '<div><div class="progressBar"><div class="timeBar"></div></div></div><div><span class="current">00:00</span>/<span class="duration">00:00</span></div><div><span class="fill">全屏</span></div>';
		this.vRoom.appendChild(this.vC);

	}

	pro.initEvent = function() {
		var that = this;
		//给播放按钮图片添加事件
		this.vimg.addEventListener('tap', function() {
			that.video.play();
		})

		//获取到元数据
		this.video.addEventListener('loadedmetadata', function() {
			that.vDuration = this.duration;
			that.vC.querySelector('.duration').innerHTML = stom(that.vDuration);
		});

		//视频播放事件
		this.video.addEventListener('play', function() {
			that.vimg.style.display = 'none';
			that.vC.classList.add('vhidden');
			that.vCt = setTimeout(function() {
				that.vC.style.visibility = 'hidden';
			}, 3400);
		})

		//视频播放中事件
		this.video.addEventListener('timeupdate', function() {
			var currentPos = this.currentTime; //获取当前播放的位置
			//更新进度条
			var percentage = 100 * currentPos / that.vDuration;
			that.vC.querySelector('.timeBar').style.width = percentage + '%';
			//更新当前播放时间
			that.vC.querySelector('.current').innerHTML = stom(currentPos);
		});

		//视频点击暂停或播放事件
		this.video.addEventListener('tap', function() {
			if(this.paused || this.ended) {
				//暂停时点击就播放
				if(this.ended) { //如果播放完毕，就重头开始播放
					this.currentTime = 0;
				}
				this.play();
			} else {
				//播放时点击就暂停
				this.pause();
			}
		})

		//暂停or停止
		this.video.addEventListener('pause', function() {
			that.vimg.style.display = 'block';
			that.vC.classList.remove('vhidden');
			that.vC.style.visibility = 'visible';
			that.vCt && clearTimeout(that.vCt);
		});

		//视频手势右滑动事件
		this.eve('swiperight',function(){
			if(that.isMax){
				return that.setVolume(0.2);
			}
			that.setCurrentTime(5);
		});
		
		//视频手势左滑动事件
		this.eve('swipeleft', function() {
			if(that.isMax){
				return that.setVolume(-0.2);
			}
			that.setCurrentTime(-5);
		});
		
		//视频手势上滑动事件
		this.eve('swipeup',function(){
			if(that.isMax){
				return that.setCurrentTime(-5);	
			}
			that.setVolume(0.2);
		});
		
		//视频手势下滑动事件
		this.eve('swipedown', function() {
			if(that.isMax){
				return that.setCurrentTime(5);	
			}
			that.setVolume(-0.2);
		});
		

		this.vC.querySelector('.fill').addEventListener('tap', function() {
			//that.nativeMax();
			that.switch();
		});

	}

	//全屏 mini 两种模式切换
	pro.switch = function() {
		var vR = this.vRoom;
		//获取需要转换的样式信息
		var info = this.isMax ? this.miniInfo : this.maxInfo;
		for(var i in info) {
			vR.style[i] = info[i];
		}
		this.isMax = !this.isMax;
		
		

		
	}
	
	

	//使用原生支持的方式播放
	pro.nativeMax = function() {
		if(!window.plus) {
			//非html5+环境
			return;
		}
		if($.os.ios) {
			console.log('ios')
			this.video.removeAttribute('webkit-playsinline');
		} else if($.os.android) {
			console.log('android');
            var url = this.video.querySelector('source').src;
			var Intent = plus.android.importClass("android.content.Intent");
			var Uri = plus.android.importClass("android.net.Uri");
			var main = plus.android.runtimeMainActivity();
			var intent = new Intent(Intent.ACTION_VIEW);
			var uri = Uri.parse(url);
			intent.setDataAndType(uri, "video/*");
			main.startActivity(intent);
		}
	}
	
	//跳转视频进度 单位 秒
	pro.setCurrentTime = function(t){
		this.video.currentTime += t;
	}
	//设置音量大小 单位 百分比 如 0.1
	pro.setVolume = function(v){
		this.video.volume += v;
	}
	//切换播放地址
	pro.setUrl = function(nUrl){
		var v = this.video;
		var source = v.querySelector('source');
		source.src = v.src = nUrl;
		source.type = 'video/'+nUrl.split('.').pop();
		v.play();
	}
	
	var events = {};
	
	//增加 或者删除事件    isBack 是否返回  这次添加事件时 被删除 的上一个 事件
	pro.eve = function(ename, callback, isBack) {
		var fn;
		if(callback && typeof(callback) == 'function') {
			isBack &&(fn = arguments.callee(ename));
			events[ename] = callback;
			this.video.addEventListener(ename, events[ename]);
			console.log('添加事件：' + ename);
		}else{
			fn = events[ename];
			fn && this.video.removeEventListener(ename, fn);
			console.log('删除事件：' + ename);
		}
		
		return fn;
	}

	function stom(t) {
		var m = Math.floor(t / 60);
		m < 10 && (m = '0' + m);
		return m + ":" + (t % 60 / 100).toFixed(2).slice(-2);
	}

	var nv = null;
	$.bvd = function(dom) {
		return nv || (nv = new bvd(dom));
	}
}(mui))