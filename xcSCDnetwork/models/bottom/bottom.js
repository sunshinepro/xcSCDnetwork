
mui.init();

mui.plusReady(function () {
	//获取父webView
	var parentWv=plus.webview.currentWebview();
	//创建四个子webview
	var pageList=[
		{
			url:'../main/main.html',
			id:'main'
		},
		{
			url:'../query/query.html',
			id:'query'
		},
		{
			url:'../control/control.html',
			id:'control'
		},
		{
			url:'../strategy/strategy.html',
			id:'strategy'
		}
	];

	//for循环创建四个子页面
	for (var i=0,l=pageList.length;i<l;i++) {
			var url= pageList[i].url;
			var id= pageList[i].id;
			console.info(url+"--------------"+id);
			//创建之前，先查找下id看是否有此webview
			//如果该webview已经被创建，则跳过本次创建
			if(plus.webview.getWebviewById(id)){
				continue;
			}
			var newWv=plus.webview.create(url,id,{
				bottom:'50px',//底端上移50px
				top:'0px',
				popGesture:'none'//侧滑返回功能关掉
			});
			//設置Wv顯示狀態
			//第一個Wv顯示出來，其他Wv隐藏
			//三目表达式
			i===0?newWv.show():newWv.hide();
			//把子wv追加到父wv
			parentWv.append(newWv);

	}

		//mui事件代理
		//默认显示子页面的id
		var showWv='main';
		mui('.mui-bar').on('tap','.mui-tab-item',function (e) {
			
			var showWvId=this.dataset.id;
			//我被点击了
				//alert("我被点击了");
			//如果当前显示的子页面和即将点击的页面是同一个，则什么也不做
			if(showWv===showWvId)return;
			//隐藏当前显示wv
			plus.webview.getWebviewById(showWv).hide();
			//显示即将点击的那个wv
			console.info(this.dataset.id);
			plus.webview.getWebviewById(this.dataset.id).show();
			//更新当前现实的子界面
			showWv=this.dataset.id;
		})
		
	});
