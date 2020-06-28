(function( window, undefined ) {
	"use strict";
	var JSTool = {
		init: function(container){
			//禁止右击出现浏览器菜单
			stopEvent("contextmenu", document);

			container.style.overflow = "hidden";
			//mind
			var mind = this.mind = new Mind(container);

			//相关事件
			stopPropagation("mousedown", mind.textBox);
			stopPropagation("mouseup", mind.textBox);

			var graph = this.graph = this.mind.Graph;
			//index
			var index = this.index = new Index(container);
			index.tabs = graph.tabs;
			// index.rail.close();
			//editor
			var editor = this.editor = new Editor(container);
			editor.setMenuLis(this.editoMenuLis);
			// editor.rail.close();
			//district
			var district = this.district = new District(mind.svg);
			//svgMenu
			var svgMenu = this.svgMenu = new Menu(container);
			this.svgMenu.addMenuLis(this.svgMenuLis);
			svgMenu.setBorder({
				right: editor.editor.clientWidth,
				left: index.index.clientWidth,
			});
			//nodeMenu
			var nodeMenu = this.nodeMenu = new Menu(container);
			this.nodeMenu.addMenuLis(this.nodeMenuLis);
			this.nodeMenu.closePanel(this.mind.svg);
			nodeMenu.setBorder({
				right: editor.editor.clientWidth,
				left: index.index.clientWidth,
			});

			editor.editor.addEventListener("mousedown", function(e){
				svgMenu.close();
				nodeMenu.close();
			});
			editor.editor.addEventListener("mouseup", function(e){
				district.close();
			});
			//每次移动之后，重新确定svg菜单右边界
			editor.rail.afterMove(function(rail){
				svgMenu.setBorder({
					right: editor.editor.clientWidth,
				})
			});
			//每次移动之后，重新确定svg菜单右边界
			index.rail.afterMove(function(rail){
				svgMenu.setBorder({
					left: index.index.clientWidth,
				})
			});
			editor.afterFinishEdit(function (editor) {
				if ( editor.node != null ) {
					editor.node.content = editor.content.innerHTML;
				}
			});
			container.addEventListener("mousedown", function(e){
				//关闭菜单
				svgMenu.close();
			});
			container.addEventListener("mouseup", function(e){
				//显示菜单
				if ( e.button == 2 && !mind.movedMind) {
					svgMenu.show(e.clientX, e.clientY);
				}
			});
			container.addEventListener("mousemove", function(e){
				//选区选中节点
				if ( district.isShow ) {
					var coord1 = {},coord2 = {};
					coord1.sX = district.coord.sX < district.coord.eX ? district.coord.sX : district.coord.eX;
					coord1.sY = district.coord.sY < district.coord.eY ? district.coord.sY : district.coord.eY;
					coord1.eX = district.coord.sX > district.coord.eX ? district.coord.sX : district.coord.eX;
					coord1.eY = district.coord.sY > district.coord.eY ? district.coord.sY : district.coord.eY;
					for (var i = graph.show.length - 1; i >= 0; i--) {
						coord2.sX = graph.show[i].coord.x + mind.coord.x;
						coord2.sY = graph.show[i].coord.y + mind.coord.y;
						coord2.eX = coord2.sX + graph.show[i].size.width;
						coord2.eY = coord2.sY + graph.show[i].size.height;
						if ( rectOverlap(coord1, coord2) ) {

							mind.selectNode(graph.show[i]);
						}else{
							mind.unselectNode(graph.show[i]);
						}
					}
				}
			});
			mind.afterSelectNode(function(nodeObj){
				if ( nodeObj != null ) {
					editor.node = nodeObj
					editor.setTitle(nodeObj.title);
					editor.setContent(nodeObj.content);
				}else{
					//富文本框结束编辑
					editor.finishEdit();
					editor.node = null;
					editor.setTitle();
					editor.setContent();
				}
			});
			mind.afterAddNode(function(nodeObj){
				var node = nodeObj.node;
				node.addEventListener("mousedown", function(e){
					JSTool.nodeMenu.close();
					if ( e.button == 2 ) {
						JSTool.nodeMenu.show(e.clientX, e.clientY);
					}
				});
				node.addEventListener("mouseup", function(e){
					var district = JSTool.district;
					if ( district.isShow ) {
						district.close();
					}
				});
				JSTool.svgMenu.closePanel(node);

				stopPropagation("mousedown", node);
				stopPropagation("mouseup", node);

				index.addChapter(nodeObj);
			});

			mind.readGraphData({"mind":{"coord":{"x":-18,"y":37}},"roots":[0],"nodes":[{"coord":{"x":436,"y":340},"title":"JSTool","form":"rect","structure":"tree","root":0,"size":{"width":70.34375,"height":31},"isShow":true,"selected":false,"pre":-1,"key":{"纯JavaScript":true,"插件":true},"content":"<b>JavaScript工具插件</b><div><u>下划线</u></div><div><i>斜体</i><br><div><a href=\"www.baidu.com\">链接</a></div></div><div>测试</div><div>右键点击主页面可出现菜单，</div><div>右键点击节点可出现菜单</div><div><br></div>","offsetCoord":{"x":-407,"y":213},"treeArea":{"right":214,"left":92}},{"coord":{"x":581.34375,"y":248.5},"title":"Menu","form":"rect","structure":"tree","root":1,"size":{"width":64.4375,"height":31},"isShow":true,"selected":false,"pre":0,"key":{"插件":true},"content":"菜单<div><br></div><div><b>JavaScript工具插件</b><div><u>下划线</u></div><div><i>斜体</i><br><div><a href=\"www.baidu.com\">链接</a></div></div><div>测试</div><div>右键点击主页面可出现菜单，</div><div>右键点击节点可出现菜单</div></div>","close":false,"offsetCoord":{"x":0,"y":0},"treeArea":{"height":31},"treeSide":1},{"coord":{"x":286.796875,"y":309.5},"title":"District","form":"rect","structure":"tree","root":2,"size":{"width":74.203125,"height":31},"isShow":true,"selected":false,"pre":1,"key":{"插件":true},"content":"选区<div><br></div><div><b>JavaScript工具插件</b><div><u>下划线</u></div><div><i>斜体</i><br><div><a href=\"www.baidu.com\">链接</a></div></div><div>测试</div><div>右键点击主页面可出现菜单，</div><div>右键点击节点可出现菜单</div></div>","offsetCoord":{"x":0,"y":0},"treeSide":0},{"coord":{"x":581.34375,"y":340},"title":"Mind","form":"rect","structure":"tree","root":3,"size":{"width":59.984375,"height":31},"isShow":true,"selected":false,"pre":2,"key":{"插件":true},"content":"节点可视化区域<div><br></div><div><b>JavaScript工具插件</b><div><u>下划线</u></div><div><i>斜体</i><br><div><a href=\"www.baidu.com\">链接</a></div></div><div>测试</div><div>右键点击主页面可出现菜单，</div><div>右键点击节点可出现菜单</div></div>","offsetCoord":{"x":0,"y":0},"treeArea":{"height":92},"treeSide":1},{"coord":{"x":716.328125,"y":309.5},"title":"Node","form":"rect","structure":"tree","root":4,"size":{"width":62.5,"height":31},"isShow":true,"selected":false,"pre":3,"key":{},"content":"节点模型<div><br></div><div><b>JavaScript工具插件</b><div><u>下划线</u></div><div><i>斜体</i><br><div><a href=\"www.baidu.com\">链接</a></div></div><div>测试</div><div>右键点击主页面可出现菜单，</div><div>右键点击节点可出现菜单</div></div>","offsetCoord":{"x":0,"y":0},"treeSide":1},{"coord":{"x":716.328125,"y":370.5},"title":"Path","form":"rect","structure":"tree","root":5,"size":{"width":54.59375,"height":31},"isShow":true,"selected":false,"pre":4,"key":{},"content":"关系线<div><br></div><div><b>JavaScript工具插件</b><div><u>下划线</u></div><div><i>斜体</i><br><div><a href=\"www.baidu.com\">链接</a></div></div><div>测试</div><div>右键点击主页面可出现菜单，</div><div>右键点击节点可出现菜单</div></div>","offsetCoord":{"x":0,"y":0},"treeSide":1},{"coord":{"x":294.578125,"y":370.5},"title":"Editor","form":"rect","structure":"tree","root":6,"size":{"width":66.421875,"height":31},"isShow":true,"selected":false,"pre":5,"key":{"插件":true},"content":"富文本框<div><br></div><div><b>JavaScript工具插件</b><div><u>下划线</u></div><div><i>斜体</i><br><div><a href=\"www.baidu.com\">链接</a></div></div><div>测试</div><div>右键点击主页面可出现菜单，</div><div>右键点击节点可出现菜单</div></div>","offsetCoord":{"x":0,"y":0},"treeSide":0},{"coord":{"x":581.34375,"y":431.5},"title":"Index","form":"rect","structure":"tree","root":7,"size":{"width":62.875,"height":31},"isShow":true,"selected":false,"pre":6,"key":{"插件":true},"content":"搜索<div><br></div><div><b>JavaScript工具插件</b><div><u>下划线</u></div><div><i>斜体</i><br><div><a href=\"www.baidu.com\">链接</a></div></div><div>测试</div><div>右键点击主页面可出现菜单，</div><div>右键点击节点可出现菜单</div></div>","offsetCoord":{"x":0,"y":0},"treeSide":1}],"paths":[{"head":0,"end":1,"tab":[],"isShow":true},{"head":0,"end":2,"tab":[],"isShow":true},{"head":0,"end":3,"tab":[],"isShow":true},{"head":3,"end":4,"tab":[],"isShow":true},{"head":3,"end":5,"tab":[],"isShow":true},{"head":0,"end":6,"tab":[],"isShow":true},{"head":0,"end":7,"tab":[],"isShow":true}],"tabs":[]});
		},
		svgMenuLis: [
			{
				title: "添加节点",
				description: "初始结构为树结构",
				fun: function () {
					var
						nodeObj = JSTool.mind.addNode({
								coord: JSTool.svgMenu.coord,
								form: "rect",
								structure: "tree",
								title: "主题节点"
							});
				}
			},
			{
				title: "保存数据",
				children:[
				{
					title: "本地缓存",
					fun: function () {
						var data = JSTool.mind.getGraphData();
						console.log(data);
						alert("功能还未完善,请等待新版本");
					},
				},
				{
					title: "TXT",
					fun: function () {
						var txt = JSTool.mind.getGraphData();

						var urlObject = window.URL || window.webkitURL || window;
						var export_blob = new Blob([txt]);
						var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
						save_link.href = urlObject.createObjectURL(export_blob);
						save_link.download = "JSTool";
						var ev = document.createEvent("MouseEvents");
						ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
						save_link.dispatchEvent(ev);
					},
				},
				{
					title: "XMM",
					description: "可转化为MindMaster",
					fun: function () {
						alert("功能还未完善,请等待新版本");
					},

				}
				]
			},
			{
				title: "导入数据",
				fun: function () {
					alert("功能还未完善,请等待新版本");
				}
			},
			{
				title: "JSMind",
				fun: function () {
					// for(var i=0;i<JSTool.mind.Graph.nodes.length;i++){
					// 	var nodeObj = JSTool.mind.Graph.nodes[i];
					// }
					console.log(JSTool.index.tabs);
					alert("功能还未完善,请等待新版本");
				}
			},
		],
		nodeMenuLis: [
			{
				title: "节点操作",
				children: [
					{
						title: "添加",
						description: "根据当前的模型，添加下级节点",
						fun: function () {
							var nodeObj = JSTool.mind.selectingNode;
							JSTool.mind.addChild(JSTool.mind.selectingNode);
						}
					},
					{
						title: "删除",
						description: "删除该节点，以及该节点的下级节点",
						fun: function () {
							let
								node = JSTool.mind.selectingNode,
								root = JSTool.mind.getRoot(node);
							JSTool.mind.delNode(node);
							JSTool.mind.tidyNode(root, true);
						}
					},
					{
						title: "展开",
						description: "展开显示该节点的下级节点(不包括自定义联系的节点)",
						fun: function () {
							let
								node = JSTool.mind.selectingNode;
							if ( node.close && node.pre ) {
								JSTool.mind.closeChild(node);
							}
						}
					},
					{
						title: "隐藏",
						description: "隐藏该节点的下级节点(不包括自定义联系的节点)",
						fun: function () {
							let	node = JSTool.mind.selectingNode;
							if ( !node.close && node.nexts.length > 0 && node.pre ) {
								JSTool.mind.closeChild(node);
							}
						}
					},
				]
			},
			{
				title: "添加联系",
				description: "与其他节点建立自定义联系，或者添加自定义联系的节点",
				fun: function () {
					alert("功能还未完善,请等待新版本");
				}
			},
			{
				title: "模型设置",
				children: [
					{
						title: "树结构",
						fun: function () {
							alert("功能还未完善,请等待新版本");
						}
					},
					{
						title: "时间轴",
						fun: function () {
							alert("功能还未完善,请等待新版本");
						}
					},
					{
						title: "列表结构",
						fun: function () {
							alert("功能还未完善,请等待新版本");
						}
					},
					{
						title: "鱼骨结构",
						fun: function () {
							alert("功能还未完善,请等待新版本");
						}
					},
					{
						title: "组织目录",
						fun: function () {
							alert("功能还未完善,请等待新版本");
						}
					},
				]
			},
			{
				title: "布局整理",
				fun: function () {
					JSTool.mind.tidyNode(JSTool.mind.selectingNode, false);
					JSTool.mind.clearAllChildOffset(JSTool.mind.selectingNode);
				}
			},
		],
		editoMenuLis: [
			{
				allow: "1",
				title: "编辑",
				icon: "iconeditNode",
				fun: function(e, bar){
					if ( JSTool.mind.selectingNode == null ) {
						alert("请选择节点");
						return;
					}
					var
						editor = JSTool.editor,
						content = editor.content,
						button = e.target,
						menu = editor.bar.getElementsByClassName("jstool_editor_menu");
					if ( content.getAttribute("contenteditable") == "true" ) {
						editor.finishEdit();
					}else{
						editor.startEdit();
					}

				}
			},{
				allow: "0",
				title: "添加链接",
				icon: "iconcharulianjie",
				fun: function(e, bar){
					if ( e.target.getAttribute("data-allow") == "0" ) {
						return ;
					}
					var sLnk=prompt('添加链接','http:\/\/');
					if(sLnk&&sLnk!=''&&sLnk!='http://'){
						document.execCommand("createlink", false, sLnk);
					}
				}
			},{
				allow: "0",
				title: "取消链接",
				icon: "iconquxiaolianjie",
				fun: function(e, bar){
					if ( e.target.getAttribute("data-allow") == "0" ) {
						return ;
					}
					var selection = document.getSelection(),
						range = selection.getRangeAt(0),
						start = range.startContainer,
						end = range.endContainer,
						startNode = {node: range.startContainer, offset: range.startOffset},
						endNode = {node: range.endContainer, offset: range.endOffset},
						startA = null,
						endA = null,
						a = null,
						acs = [],
						parentNode = null;

					while( start != JSTool.editor.content || end != JSTool.editor.content ){
						if ( start.nodeName === "A" ) {
							startA = start;
						}
						if ( end.nodeName === "A" ) {
							endA = end;
						}
						if ( start != JSTool.editor.content ) {
							start = start.parentNode;
						}
						if ( end != JSTool.editor.content ) {
							end = end.parentNode;
						}
					}
					JSTool.editor.cancellink(startA);
					if ( startA !== endA) {
						JSTool.editor.cancellink(endA);
					}
					var as = JSTool.editor.content.getElementsByTagName("a");
					for (let i = 0; i < as.length; i++) {
						if ( selection.containsNode(as[i]) ) {
							JSTool.editor.cancellink(as[i]);
							i--;
						}
					}
				}
			},{
				allow: "0",
				title: "加粗",
				icon: "iconzitijiacu",
				fun: function(e, bar){
					if ( e.target.getAttribute("data-allow") == "0" ) {
						return ;
					}
					document.execCommand("Bold", false);
				}
			},{
				allow: "0",
				title: "下划线",
				icon: "iconzitixiahuaxian",
				fun: function(e, bar){
					if ( e.target.getAttribute("data-allow") == "0" ) {
						return ;
					}
					document.execCommand("Underline", false);
				}
			},{
				allow: "0",
				title: "倾斜",
				icon: "iconzitixieti",
				fun: function(e, bar){
					if ( e.target.getAttribute("data-allow") == "0" ) {
						return ;
					}
					document.execCommand("Italic", false);
				}
			},{
				allow: "0",
				title: "添加图像",
				icon: "iconaddImage",
				fun: function(e, bar){
					if ( e.target.getAttribute("data-allow") == "0" ) {
						return ;
					}
					alert("功能还未完善,请等待新版本");
				}
			},{
				allow: "0",
				title: "列表数据",
				icon: "iconlist",
				fun: function(e, bar){
					if ( e.target.getAttribute("data-allow") == "0" ) {
						return ;
					}
					alert("功能还未完善,请等待新版本");
				}
			},{
				allow: "0",
				title: "数学符号",
				icon: "iconicon-test",
				fun: function(e, bar){
					if ( e.target.getAttribute("data-allow") == "0" ) {
						return ;
					}
					alert("功能还未完善,请等待新版本");
				}
			}],
		editNodeContent: function (){
			var
				content = JSTool.editor.content,
				contenteditable = content.getAttribute("contenteditable");
			if ( contenteditable == "true" ) {

			}
		}
	};
	function Index(container){
		this.container = container;
		this.chapters = [];
		this.init();
	}
	Index.prototype = {
		constructor: Index,
		init: function(){
			var
				index = this,
				jstool_index = index.index = document.createElement("div"), rail,
				jstool_index_body = index.body = document.createElement("div"),
				jstool_index_bar = index.bar = document.createElement("div"),
				jstool_index_refresh = index.search = document.createElement("div"),
				jstool_index_search = index.search = document.createElement("div"),
				jstool_index_search_input = index.input = document.createElement("div"),
				jstool_index_search_icon = index.icon = document.createElement("i"),
				jstool_index_chapters = index.chapters = document.createElement("div");
			jstool_index.className = "jstool_index";
			jstool_index_body.className = "jstool_index_body";
			jstool_index_bar.className = "jstool_index_bar";
			jstool_index_refresh.className = "jstool_index_refresh iconfont iconrefresh";
			jstool_index_refresh.title = "刷新";
			jstool_index_search.className = "jstool_index_search";
			jstool_index_search_icon.className = "jstool_index_search_icon iconfont iconsearch";
			jstool_index_search_input.className = "jstool_index_search_input";
			jstool_index_search_input.setAttribute("contenteditable", "true");
			jstool_index_chapters.className = "jstool_index_chapters";

			jstool_index.appendChild(jstool_index_body);
			jstool_index_body.appendChild(jstool_index_bar);
			jstool_index_body.appendChild(jstool_index_chapters);
			jstool_index_bar.appendChild(jstool_index_refresh);
			jstool_index_bar.appendChild(jstool_index_search);
			jstool_index_search.appendChild(jstool_index_search_input);
			jstool_index_search.appendChild(jstool_index_search_icon);
			index.container.appendChild(jstool_index);

			jstool_index_search_icon.addEventListener("click", function(){
				index.searchContent = jstool_index_search_input.innerText;
				if ( index.searchContent === "" ) {
					return;
				}
				let
					showChapter = [],
					nodes = JSTool.mind.Graph.nodes;//继续耦合，继续炸

				for(let key in index.tabs){
					if ( key.search(index.searchContent) != -1 ) {//关键字内包含存在搜索内容
						for(let i = 0;i < index.tabs[key].length;i++){
							if ( showChapter.indexOf(index.tabs[key][i] == -1) ) {//数组内还不存在节点
								showChapter.push(index.tabs[key][i]);
							}
						}
					}
				}
				for (let i = 0; i < nodes.length; i++) {
					if ( nodes[i].title.search(index.searchContent) != -1 ) {//标题内内包含存在搜索内容
						if ( showChapter.indexOf(nodes[i]) == -1 ) {//数组内还不存在节点
							showChapter.push(nodes[i]);
						}
					}
					if ( nodes[i].content && nodes[i].content.search(index.searchContent) != -1 ) {//标题内内包含存在搜索内容
						if ( showChapter.indexOf(nodes[i]) == -1 ) {//数组内还不存在节点
							showChapter.push(nodes[i]);
						}
					}
				}
				jstool_index_chapters.innerHTML = "";
				for (let i = 0; i < showChapter.length; i++) {
					index.addChapter(showChapter[i]);
				}
			});
			jstool_index_refresh.addEventListener("mousedown", function(e){
				index.refresh = true;
				jstool_index_chapters.innerHTML = "";
				index.tabs = {};
				let nodes = JSTool.mind.Graph.nodes;//继续耦合，继续炸
				for (let i = 0; i < nodes.length; i++) {
					index.addChapter(nodes[i]);
				}
				index.refresh = false;
			});
			rail = index.rail = new Rail({
				container: jstool_index, 
				body: jstool_index_body,
				side: 1,//左边
				width: 250
			});
			jstool_index_body.style.width = rail.width + "px";
		},
		selectIndex: function(){

		},
		addChapter: function(obj){
			let
				index = this,
				chapter = document.createElement("div"),
				titleCon = document.createElement("div"),
				title = document.createElement("div"),
				showTabs = document.createElement("div"),
				tab = document.createElement("div"),
				keys = document.createElement("div"),
				addNewkey = document.createElement("div"),
				newKey = document.createElement("div"),
				addButton = document.createElement("div");

			chapter.className = "index_chapter";
			chapter.obj = obj;//耦合赋值，对应节点
			titleCon.className = "chapter_titleCon";
			title.className = "chapter_title";
			title.innerText = obj.title;
			showTabs.className = "chapter_showTabs iconfont iconshow";
			showTabs.show = false;
			showTabs.title = "展开";
			tab.className = "chapter_tabs";
			chapter.tab = showTabs.tab = tab;//整个tab操作节点

			tab.style.display = "none";
			keys.className = "chapter_keys";
			chapter.keys = keys;//包含所有关键字的dom节点
			addNewkey.className = "chapter_addNewkey";

			newKey.className = "chapter_newKey";
			newKey.setAttribute("contenteditable", "true");

			addButton.className = "chapter_addButton";
			addButton.innerText = "添加";

			addButton.addEventListener("click", function(e){
				index.addKey(chapter, newKey.innerText);
			});

			chapter.appendChild(titleCon);
			titleCon.appendChild(title);
			titleCon.appendChild(showTabs);
			chapter.appendChild(tab);
			tab.appendChild(keys);
			tab.appendChild(addNewkey);
			addNewkey.appendChild(newKey);
			addNewkey.appendChild(addButton);
			index.chapters.appendChild(chapter);

			title.addEventListener("click", function(e){//耦合得更厉害了，炸了！
				JSTool.mind.unselectNode();
				JSTool.mind.selectNode(chapter.obj);
			});
			showTabs.addEventListener("click", function(e){
				index.showHideChapter(showTabs);
			});

			for(let key in obj.key){
				index.addKey(chapter, key);
			}
		},
		addKey: function(chapter, key){//耦合了，GG，时间关系，先完成再说。Orz
			let index = this;
			if ( chapter.obj["key"][key] && !index.refresh) {
				return;
			}
			if ( !index.tabs[key] ) {
				index.tabs[key] = [];
			}
			if ( index.tabs[key].indexOf(chapter.obj) == -1) {
				index.tabs[key].push(chapter.obj);
			}
			chapter.obj["key"][key] = true;//直接属性接上，不是很适合，不过先完成再说
			let
				tab = document.createElement("div"),
				keyName = document.createElement("div"),
				cancle = document.createElement("div");

			tab.className = "chapter_key";
			keyName.className = "key_name";
			keyName.innerText = key;

			cancle.className = "cancle_key iconfont iconcancel";
			tab.key = key;
			tab.obj = chapter.obj;
			cancle.tab = tab;

			tab.appendChild(keyName);
			tab.appendChild(cancle);
			chapter.keys.appendChild(tab);

			keyName.addEventListener("click", function(e){//丧心病狂，不管耦合了，先实现再说
				JSTool.mind.unselectNode();
				let nodes = index.tabs[this.innerText];
				for (var i = 0; i < nodes.length; i++) {
					console.log(nodes[i].node);
					JSTool.mind.selectNode(nodes[i]);
				}
			});
			cancle.addEventListener("click", function(e){
				index.delKey( cancle );
			});
		},
		delKey: function( cancle ){//继承上一个函数的耦合，更加GG，Orz！时间关系，先完成再说。
			cancle.tab.parentNode.removeChild(cancle.tab);
			cancle.tab.obj.key[cancle.tab.key] = undefined;
		},
		delChapter: function(){

		},
		showHideChapter: function(button){
			if ( button.show ) {
				button.className = "chapter_showTabs iconfont iconshow";
				button.show = false;
				button.title = "展开标签";
				button.tab.style.display = "none";
			}else{
				button.className = "chapter_showTabs iconfont iconhide";
				button.show = true;
				button.title = "隐藏标签";
				button.tab.style.display = "flex";
			}
		},
		hideChapter: function(button){

		},
		setchapters: function(){

		},
		search: function(){

		},
	}
	function Editor(container){
		this.container = container;
		this.node = null;
		this.init();
	}
	Editor.prototype = {
		constructor: Editor,
		init: function(){
			var
				jstool_editor = this.editor = document.createElement("div"),
				jstool_editor_body = this.body = document.createElement("div"),
				jstool_editor_title = this.title = document.createElement("div"),
				jstool_editor_bar = this.bar = document.createElement("div"),
				jstool_editor_content = this.content = document.createElement("div"),
				rail = this.rail = new Rail({
					container: jstool_editor, 
					body: jstool_editor_body,
					side: 0,//右边
					width: 300
				});
			jstool_editor.className = "jstool_editor";
			jstool_editor_body.style.width = rail.width + "px";
			jstool_editor_body.className = "jstool_editor_body";
			jstool_editor_title.className = "jstool_editor_title";
			jstool_editor_bar.className = "jstool_editor_bar";
			jstool_editor_content.className = "jstool_editor_content";

			this.setTitle("JSEditor");

			this.container.appendChild(jstool_editor);
			jstool_editor.appendChild(jstool_editor_body);
			jstool_editor_body.appendChild(jstool_editor_title);
			jstool_editor_body.appendChild(jstool_editor_bar);
			jstool_editor_body.appendChild(jstool_editor_content);
		},
		setModel: function(){

		},
		setMenuLis: function(bar){
			for(var i = 0; i < bar.length; i++){
				var
					content = this.content,
					menu = document.createElement("div");
				menu.className = "jstool_editor_menu icon iconfont " + bar[i].icon;
				menu.title = bar[i].title;
				menu.fun = bar[i].fun;
				menu.setAttribute("data-allow", bar[i].allow);
				menu.addEventListener("mouseup", function (e) {
					e.target.fun(e, bar);
					content.focus();
				});
				this.bar.appendChild(menu);
			}
			this.menu = this.bar.getElementsByClassName("jstool_editor_menu");
		},
		setTitle: function(title){
			if ( title == undefined ) {
				this.title.innerText = "JSEditor";
				return ;
			}
			var t = title.split("\n");
			if ( t.length > 1) {
				this.title.innerText = "";
				for(var i=0; i<t.length; i++){
					this.title.innerText += t[i] + " ";
				}
			}else{
				this.title.innerText = t;
			}
		},
		setContent: function(content) {
			if ( content == undefined ) {
				this.content.innerHTML = "";
				return ;
			}
			this.content.innerHTML = content;
		},
		startEdit: function () {
			this.content.setAttribute("contenteditable", "true");
			this.content.focus();
			for (var i = 0; i < this.menu.length; i++) {
				switch (i) {
					case 0:
						this.menu[i].className = "jstool_editor_menu iconfont iconshiyongwendang";
						this.menu[i].title = "结束编辑";
						break;
					default:
						this.menu[i].setAttribute("data-allow", "1");
						break;
				}
			}
			this.afterStartEditing = true;
		},
		finishEdit: function(){
			if ( this.content.getAttribute("contenteditable") == null ) {
				return ;
			}
			this.afterFinishEditing = true;
			this.content.removeAttribute("contenteditable");
			for (var i = 0; i < this.menu.length; i++) {
				switch (i) {
					case 0:
						this.menu[i].className = "jstool_editor_menu iconfont iconeditNode";
						this.menu[i].title = "开始编辑";
						break;
					default:
						this.menu[i].setAttribute("data-allow", "0");
						break;
				}
			}
		},
		afterFinishEdit: function(callback){
			Object.defineProperty(this, "afterFinishEditing", {
				get: function () {
					return this._afterFinishEdit;
				},
				set: function(afterFinishEditing){
					this._afterFinishEdit = afterFinishEditing;
					callback(this);
				}
			});
		},
		cancellink: function(a){
			if ( a !== null ) {
				var parent = a.parentNode,
					acs = [];
				for (let i = 0; i < a.childNodes.length; i++) {
					acs[i] = a.childNodes[i];
				}
				parent.replaceChild(acs[0] ,a);
				for (let i = 1; i < acs.length; i++) {
					if (parent.lastChild == acs[i-1]) {
						parent.appendChild(acs[i]);
					} else {
						parent.insertBefore(acs[i], acs[i-1].nextSibling);
					}
				}
			}
		}
	}
	function Rail(argu){
		this.container = argu.container;
		this.body = argu.body;
		this.initWidth = this.width = argu.width;
		this.startX ;
		this.side = this.showSide = argu.side;
		this.startMoveFlag = false;
		this.movingFlag = false;
		this.finishMoveFlag = false;
		this.init();
	}
	Rail.prototype = {
		constructor: Rail,
		init: function(){
			var
				railObj = this,
				rail = this.rail = document.createElement("div"),
				rail_move = this.move = document.createElement("div"),
				rail_hide = this.hide = document.createElement("div");

			rail.className = "rail";
			rail_move.className = "rail_move";

			if ( this.side == 0 ) {//右边
				rail_hide.className = "rail_hide iconfont iconclose_right";
				rail.appendChild(rail_hide);
				rail.appendChild(rail_move);
			}else{//左边
				rail_hide.className = "rail_hide iconfont iconclose_left";
				rail.appendChild(rail_move);
				rail.appendChild(rail_hide);
			}


			this.container.appendChild(rail);
			//显示展开
			rail_hide.addEventListener("mousedown", function(e){
				railObj.finishMoveFlag = false;
				if ( railObj.side == railObj.showSide ) {
					railObj.close();
				}else{
					railObj.show();
				}
			});
			//移动改变大小
			rail_move.addEventListener("mousedown", function(e){
				if ( railObj.side != railObj.showSide ) {
					railObj.initWidth = railObj.width = 0;
					railObj.setBodyWidth(0);
					railObj.show();
				}
				railObj.finishMoveFlag = false;
				railObj.startMoveFlag = true;
				
				railObj.startX = e.clientX;
				railObj.container.style["z-index"] = 10;
			});
			this.container.addEventListener("mousemove", function(e){
				railObj.moveRail(e);
			});
			document.addEventListener("mousemove", function(e){
				railObj.moveRail(e);
			});
			this.container.addEventListener("mouseup", this.finishMove.bind(this) );
			document.addEventListener("mouseup", this.finishMove.bind(this) );
		},
		setSide: function(side){
			if ( side == 0 ) {
				this.side = 0;
				this.hide.className = "rail_hide iconfont iconclose_right";
			}else{
				this.side = 1;
				this.hide.className = "rail_hide iconfont iconclose_left";
			}
		},
		setBodyWidth: function(width){
			this.body.style.width = width + "px";
		},
		moveRail: function(e){
			if ( this.startMoveFlag ) {
				this.movingFlag = true;
				let
					offset = this.startX - e.clientX,
					railWidth = this.rail.getBoundingClientRect().width,
					initContainerWidth = this.initWidth + railWidth,
					containerWidth = this.width + railWidth;

				if ( this.showSide == 0 ) {//右边
					if ( initContainerWidth + offset >= document.body.clientWidth ) {
						this.width = this.body.style.width = document.body.clientWidth - railWidth;
					}else{
						this.width = this.body.style.width = this.initWidth + offset;
					}
				}else{
					if ( initContainerWidth - offset >= document.body.clientWidth ) {
						this.width = this.body.style.width = document.body.clientWidth - railWidth;
					}else{
						this.width = this.body.style.width = this.initWidth - offset;
					}
				}
			}
		},
		finishMove: function(){
			this.container.style["z-index"] = 1;
			if ( this.startMoveFlag ) {
				this.startMoveFlag = false;
				this.movingFlag = false;
				this.finishMoveFlag = true;
				this.initWidth = this.width;
			}
		},
		afterMove: function(callback){
			Object.defineProperty(this, "finishMoveFlag", {
				get: function () {
					return this._finishMoveFlag;
				},
				set: function(finishMoveFlag){
					if ( finishMoveFlag ) {
						callback(this);
					}
					this._finishMoveFlag = finishMoveFlag;
				}
			});
		},
		show: function(){
			this.side = this.showSide;
			this.setSide(this.side);
			this.body.style.display = "block";
		},
		close: function(){
			this.side = !this.showSide;
			this.setSide(this.side);
			this.body.style.display = "none";
		}
	}
	function Mind(container){
		this.container = container;
		this.coord = {x:0,y:0};
		this.startMoveMind = false;
		this.startMoveMindCoord = {};
		this.offsetCoord  = {};
		this.movedMind = false;

		this.nodePadding = 30;
		this.nodeInterval = 75;

		this.editingNode = null;
		this._selectingNode = this.selectingNode = null;

		//移动相关的周期标志
		this.startMoveNodesCooed = {};
		this.startMoveNodesFlag = false;
		this.movingNodesFlag = false;
		this.finishMoveNodesFlag = false;
		this.willMoveNodes = [];
		this.init();
	};
	Mind.prototype = {
		constructor: Mind,
		Graph: {
			//节点
			nodes: [],
			//根节点
			root: [],
			//已经展示的节点
			show: [],
			//记录删除的节点
			deleted_nodes: [],
			//节点之间的关系线
			paths: [],
			//记录删除的关系线
			deleted_paths: [],
			//被选中的节点
			selects: [],
			//标签节点集合
			tabs:{},
		},
		init: function(){
			var
				mind = this,
				svg = mind.svg =  document.createElementNS("http://www.w3.org/2000/svg","svg"),
				nodes = mind.nodes = document.createElementNS("http://www.w3.org/2000/svg","g"),
				paths = mind.paths = document.createElementNS("http://www.w3.org/2000/svg","g"),
				textBox = mind.textBox = document.createElement("div");
			svg.setAttribute("class", "mind_svg");
			svg.setAttribute("width","100%");
			svg.setAttribute("height","100%");
			nodes.setAttribute("class", "mind_nodes");

			nodes.setAttribute("transform", "translate("+mind.coord.x+" "+mind.coord.y+")");
			paths.setAttribute("class", "mind_paths");
			textBox.className = "mind_box";
			textBox.style.display = "none";
			textBox.style.position = "absolute";
			nodes.appendChild(paths);
			svg.appendChild(nodes);
			mind.container.appendChild(svg);
			mind.container.appendChild(textBox);
			//编辑完成
			textBox.onblur = mind.editedNodeTitle.bind(mind);
			svg.addEventListener("mousedown", function(e){
				//取消所有选中
				mind.unselectNode();
				//重算移动记录
				mind.movedMind = false;
				//准备开始移动
				if ( e.button == 2 ) {
					mind.startMoveMind = true;
					mind.startMoveMindCoord.x = e.clientX;
					mind.startMoveMindCoord.y = e.clientY;
				}
			});
			svg.addEventListener("mousemove", function(e){ //移动节点背景
				mind.offsetCoord.x = e.clientX - mind.startMoveMindCoord.x;
				mind.offsetCoord.y = e.clientY - mind.startMoveMindCoord.y;
				if ( mind.startMoveMind && (mind.offsetCoord.x != 0 && mind.offsetCoord.y != 0)) {
					mind.svg.setAttribute("data-grabbing", "1");
					mind.movedMind = true;
					mind.nodes.setAttribute("transform", "translate("+ (mind.offsetCoord.x+mind.coord.x) +" "+ (mind.offsetCoord.y+mind.coord.y) +")");
				}
			});
			svg.addEventListener("drop", function(e){ //拖拽，读取文件
				var files = e.dataTransfer.files; //获取文件对象
				if(files.length == 0){ //检测是否是拖拽文件到页面的操作 
					return false; 
				}else if ( files.length > 1 ) {
					alert("只能读取一个文件");
					return false;
				}else{
					var reader = new FileReader();
					reader.onload = function(e){
						mind.readGraphData(e.target.result);
					};
					reader.readAsText(files[0]);
				}
			});
			stopDefault("dragover", svg);//这里，应该直接输入一个数组就够了，不过，时间限制，先完成功能再说
			stopDefault("dragenter", svg);
			stopDefault("drop", svg);
			stopDefault("dragleave", svg);

			document.addEventListener("mouseup", function(e){
				//移动结束
				mind.startMoveMind = false;
				if ( e.button == 2 && mind.movedMind ) {
					if ( mind.svg.contains(e.target) ) {
						mind.coord.x += e.clientX - mind.startMoveMindCoord.x;
						mind.coord.y += e.clientY - mind.startMoveMindCoord.y;
					}else{
						mind.coord.x += mind.offsetCoord.x;
						mind.coord.y += mind.offsetCoord.y;
					}
					mind.offsetCoord.x = mind.offsetCoord.y = 0;
					mind.svg.removeAttribute("data-grabbing");
				}
			});
			//节点移动相关
			document.addEventListener("mousemove", function(e){
				mind.movingNodes(e);
			});
			document.addEventListener("mouseup", function(e){
				if ( e.button == 0 ) {
					mind.finishMoveNodes(e);
				}
			});
			this.afterEditTitle(function(finishEditNodeTitleFlag){
				mind.setTreeAreaAfterEditTtile(finishEditNodeTitleFlag);
				mind.tidyNode(mind.getRoot(finishEditNodeTitleFlag), true);
			});
		},
		addNode: function(argu){
			var	mind = this,
				nodeObj = new Node({
					container: mind.nodes,
					coord: {
						x: argu.coord.x - this.coord.x,
						y: argu.coord.y - this.coord.y
					},
					form: argu.form,
					structure: argu.structure,
					title: argu.title,
					root: argu.root,
				}),
				node = nodeObj.node;
			mind.Graph.nodes.push(nodeObj);
			if ( nodeObj.root == nodeObj ) {
				this.Graph.root.push(nodeObj);
			}
			mind.showNode(nodeObj);
			mind.unselectNode();
			mind.selectNode(nodeObj);
			mind.nodeInit(nodeObj);
			//标志，已经增加了一个节点
			mind.addNodeFlag = nodeObj;
			//相对布局的节点偏移量
			nodeObj.offsetCoord  = {x: 0, y: 0};
			return nodeObj;
		},
		nodeInit: function(nodeObj){
			var	mind = this,
				node = nodeObj.node;
			node.addEventListener("mouseenter", function(e){
				if ( nodeObj.selected ) {
					return ;
				}
				node.setAttribute("type", "hover");
			});
			node.addEventListener("mouseleave", function(e){
				if ( nodeObj.selected ) {
					return ;
				}
				node.removeAttribute("type");
			});
			//选中节点
			node.addEventListener("mousedown", function(e){
				//左键
				if ( e.button == 0 ) {
					if ( !e.ctrlKey ) {
						if ( nodeObj.selected ) {
						}else{
							mind.unselectNode();
							mind.selectNode(nodeObj);
						}
					}else{
						if ( nodeObj.selected ) {
							mind.unselectNode(nodeObj);
						}else{
							mind.selectNode(nodeObj);
						}
					}
				}
				//右键
				else if ( e.button == 2 ) {
					mind.unselectNode();
					mind.selectNode(nodeObj);
				}
				if ( e.button == 0 ) {
					//移动节点
					mind.startMoveNodes(e);
				}
			});
			node.addEventListener("mouseup", function(e){
				mind.finishMoveNodes(e);
				if ( !mind.finishMoveNodesFlag && !e.ctrlKey ) {
					mind.unselectNode();
					mind.selectNode(nodeObj);
				}
			});
			//编辑节点
			node.addEventListener("dblclick", function(e){
				if ( e.ctrlKey ) {
					return;
				}
				mind.editingNodeTitle(nodeObj);
			});
			//移动节点
			node.addEventListener("mousemove", function(e){
				mind.movingNodes(e);
			});
		},
		addChild: function(parent){
			var	child , path;
			if (parent.form == "rect") {
				child = this.addNode({
					//相对父节点，位置偏移量需要转为0
					coord: {
						x: parent.coord.x + this.coord.x,
						y: parent.coord.y + this.coord.y
					},
					form: "rect",
					structure: "tree",
					title: "主题节点",
					root: parent.root,
				});
				path = new Path({
					container: this.paths,
					head: parent,
					end: child
				});
				this.Graph.paths.push(path);
				parent.nexts.push(path);
				child.pre = path;
				path.show();
			}
			this.setAreaChild(child);//每增加一个新的子节点，就去更改他的父节点的area值，直到根节点
			this.tidyNode(this.getRoot(child), true);//更改完毕之后，开始整理节点布局，计算偏差
			return child;
		},
		delNode: function(node, isChild){
			let
				index, 
				mind = this;
			if ( !isChild ) {//第一次执行
				let offset = -((node.treeArea) ? (node.treeArea.height) : node.size.height);
				if ( node.pre && node.pre.head.nexts.length > 1) {
					offset -= this.nodePadding;
    				mind.setTreeAreaFromChild(node, offset);
				}
			}

			if ( node.selected ) {
				mind.unselectNode(node);
			}
			if ( node.isShow ) {
				index = mind.Graph.show.indexOf(node);
				mind.Graph.show.splice(index, 1);
			}
			if ( node.root == node && node.pre == null ) {
				index = mind.Graph.root.indexOf(node);
				mind.Graph.root.splice(index, 1);
			}
			index = mind.Graph.nodes.indexOf(node);
			mind.Graph.nodes.splice(index, 1);
			if(node.isShow){
		    	node.container.removeChild(node.node);
				
			}

			if ( node.pre ) {
				let parent = node.pre.head,
					nextIndex = parent.nexts.indexOf(node.pre),
					preIndex = mind.Graph.paths.indexOf(node.pre);
				parent.nexts.splice(nextIndex, 1);
				mind.Graph.paths.splice(preIndex, 1);
				if(node.pre.isShow){
					node.pre.container.removeChild(node.pre.path);
				}
			}
			if ( node.tabs.length > 0 ) {
				node.tabs.forEach(function(item, index, array){
					let i = mind.Graph.paths.indexOf(item);
					mind.Graph.paths.splice(i, 1);
					item.container.removeChild(item.path);
				});
			}
			if ( node.nexts.length > 0 ) {
				for (let i = 0; i < node.nexts.length; i++) {
					mind.delNode(node.nexts[i].end, true);
					i--;
				}
			}
			node = null;
		},
		afterAddNode: function(callback){
			Object.defineProperty(this, "addNodeFlag", {
				get: function () {
					return this._addNodeFlag;
				},
				set: function(addNodeFlag){
					this._addNodeFlag = addNodeFlag;
					callback(addNodeFlag);
				}
			});
		},
		closeChild: function(nodeObj){
			let offset = 0,mind = this;
			if ( nodeObj.close == true) {//节点已经关闭，准备打开
				nodeObj.close = false;

				let treeArea = 0;
				nodeObj.nexts.forEach(function(item, index, array){
					let node = item.end;
					treeArea += ((node.treeArea == undefined) ? node.size.height : node.treeArea.height);
					if ( index != 0 ) {
						treeArea += mind.nodePadding;
					}
				});
				if ( nodeObj.size.height < treeArea ) {
					offset = treeArea - nodeObj.size.height;
				}
				nodeObj.treeArea = { height: treeArea };
				mind.operateAllChild(nodeObj, function(nodeObj){
					mind.showNode(nodeObj);
					// nodeObj.node.style.display = "block";
					// nodeObj.pre.path.style.display = "block";
				});
			}else{//节点已经打开，准备关闭，即将这个节点看作是叶子节点
				nodeObj.close = true;
				if ( nodeObj.treeArea && nodeObj.size.height < nodeObj.treeArea.height ) {
					offset = nodeObj.size.height - nodeObj.treeArea.height;
				}else{

				}
				nodeObj.treeArea = undefined;
				
				mind.operateAllChild(nodeObj, function(nodeObj){
					mind.hideNode(nodeObj);
					// nodeObj.node.style.display = "none";
					// nodeObj.pre.path.style.display = "none";
					if ( nodeObj.close ) {
						return 1;
					}
				});
			}
			mind.setTreeAreaFromChild(nodeObj, offset);
			mind.tidyNode(mind.getRoot(nodeObj), true);
		},
		setNodeCoord: function(nodeObj, coord){
			nodeObj.setCoord(coord);
			if ( nodeObj.pre ) {
				nodeObj.pre.setCoord();
			}
			if ( nodeObj.nexts.length > 0 ) {
				for(let i = 0;i < nodeObj.nexts.length; i++){
					 nodeObj.nexts[i].setCoord();
				}
			}
			if ( nodeObj.tabs.length > 0 ) {
				for(let i = 0;i < nodeObj.tabs.length; i++){
					 nodeObj.tabs[i].setCoord();
				}
			}
			this.movedNodeFlag = nodeObj;
		},
		clearAllChildOffset: function(parent){
			this.operateAllChild(parent ,function(nodeObj){
				nodeObj.offsetCoord.x = 0;
				nodeObj.offsetCoord.y = 0;
			});
		},
		tidyNode: function(parent, offset){
			let mind = this;
			if ( parent.nexts.length > 0 && !parent.close) {//有子节点，需要整理，且子节点显示
				if ( parent.structure == "tree" ) {//数据结构是tree
					if ( parent.pre == null ) {//根节点，双边
						let
							leftStart = parent.getCentre().cY - parent.treeArea.left/2,
							rightStart = parent.getCentre().cY - parent.treeArea.right/2;
						parent.nexts.forEach(function(item, index, array){
							let node = item.end,
								nodeHeight = ((node.treeArea == undefined || node.size.height > node.treeArea.height || node.close) ? node.size.height : node.treeArea.height),
								x , y;
							if ( node.treeSide === 1 ) {//右边
								x = parent.coord.x + parent.size.width + mind.nodeInterval;
								y = rightStart + nodeHeight/2 - node.size.height/2;
								if ( offset ) {
									x += node.offsetCoord.x;
									y += node.offsetCoord.y;
								}
								mind.setNodeCoord(node, { x: x,y: y, });
								rightStart += mind.nodePadding + nodeHeight;
							}else{//左边
								x = parent.coord.x - node.size.width - mind.nodeInterval;
								y = leftStart + nodeHeight/2 - node.size.height/2;
								if ( offset && !node.close) {
									x += node.offsetCoord.x;
									y += node.offsetCoord.y;
								}
								mind.setNodeCoord(node, { x: x,y: y, });
								leftStart += mind.nodePadding + nodeHeight;
							}
							if ( node.isShow && !node.close) {
								mind.tidyNode(node, offset);
							}
						});
					}
					else {//节点，单边
						let start = parent.getCentre().cY - parent.treeArea.height/2;
						parent.nexts.forEach(function(item, index, array){
							let node = item.end,
								nodeHeight = ((node.treeArea == undefined || node.size.height > node.treeArea.height || node.close) ? node.size.height : node.treeArea.height),
								x , y;
							x = parent.coord.x + ((node.treeSide == 1) ? (parent.size.width + mind.nodeInterval) : -(node.size.width + mind.nodeInterval));
							y = start + nodeHeight/2 - node.size.height/2;
							if ( offset && !node.close) {
								x += node.offsetCoord.x;
								y += node.offsetCoord.y;
							}
							mind.setNodeCoord(node, { x: x,y: y, });
							start += mind.nodePadding + nodeHeight;
							if ( node.isShow && !node.close) {
								mind.tidyNode(node, offset);
							}
						});
					}
				}
			}else{
				return;
			}
		},
		setAreaChild: function(child){

			this.setTreeAreaFromChild(child);
		},
		setTreeAreaFromChild: function(child, offset){
			var prePath = child.pre,
				parent = prePath.head;
			if ( parent.pre == null ) {//根节点，双边
				if ( offset == undefined ) {//偏移值未知，即child为新添加的子节点
					if ( (parent.nexts.indexOf(child.pre)) % 2 == 0) {
						child.treeSide = 1//右边方向
						if ( parent.treeArea == undefined ) {//未设置过子节点
							parent.treeArea = {right: child.size.height};
						}else{
							parent.treeArea.right += this.nodePadding + child.size.height;
						}
					}else{
						child.treeSide = 0//左边方向
						if ( parent.treeArea.left == undefined ) {
							parent.treeArea.left = child.size.height;
						}else{
							parent.treeArea.left += this.nodePadding + child.size.height;
						}
					}
				}else{
					if ( child.treeSide == 1 ) {
						parent.treeArea.right += offset;
					}else{
						parent.treeArea.left += offset;
					}
				}
			}else {//子孙节点单边//设置在树结构种的方向
				child.treeSide = parent.treeSide;
				if ( offset == undefined ) {//偏移值未知，即child为新添加的子节点
					if ( parent.treeArea === undefined ) {//child是父节点的第一个新添加的子节点
						parent.treeArea = {height: child.size.height};
						return;
					}else{
						var oldTreeArea = parent.treeArea.height;
						parent.treeArea.height += (this.nodePadding + child.size.height);
						if ( oldTreeArea > parent.size.height ) {
							this.setTreeAreaFromChild(parent, parent.treeArea.height - oldTreeArea);
						}else {
							if ( parent.treeArea.height > parent.size.height ) {
								this.setTreeAreaFromChild(parent, parent.treeArea.height - parent.size.height);
							}else{
								return;
							}
						}
					}
				}else{//偏移值已知，即child为新添加的子节点的祖先节点
					parent.treeArea.height += offset;
					this.setTreeAreaFromChild(parent, offset);
				}
			}
		},
		setChildrenTreeSide: function(nodeObj, side){//0左1右
			// nodeObj.treeSide = side;
			this.operateAllChild(nodeObj, function(nodeObj){
				// nodeObj.treeSide = side;
			});
		},
		setOrganAreaFromChild: function(child, offset){
		},
		setTreeAreaAfterEditTtile: function(node){
			if ( !node.pre ) {//根节点，不需要改变子孙节点高度
				return;
			}
			if ( node.nexts.length == 0 || node.treeArea == undefined){//被改变大小的节点没有孩子节点或者隐藏了孩子节点
				this.setTreeAreaFromChild(node, node.size.height - node.oldSize.height);
			}
			else if ( node.size.height > node.oldSize.height ) {
				if ( node.oldSize.height > node.treeArea.height ) {
					this.setTreeAreaFromChild(node, node.size.height - node.oldSize.height);
				}else{
					if ( node.size.height > node.treeArea.height ) {
						this.setTreeAreaFromChild(node, node.size.height - node.treeArea.height);
					}
				}
			}
			else if ( node.size.height < node.oldSize.height ) {
				if ( node.oldSize.height < node.treeArea.height ) {

				}else{
					if ( node.size.height < node.treeArea.height) {
						this.setTreeAreaFromChild(node, node.treeArea.height - node.oldSize.height);
					}else{
						this.setTreeAreaFromChild(node, node.size.height - node.oldSize.height);
					}
				}
			}
		},
		startMoveNodes: function(e){
			this.finishMoveNodesFlag = false;
			this.startMoveNodesFlag = true;
			this.startMoveNodesCooed.x = e.clientX;
			this.startMoveNodesCooed.y = e.clientY;

			let willMoveNodes = [],
				selects = this.Graph.selects,
				con = {};
			//获取选中节点中的，相互之间，深度最低的祖先节点
			for(let i = 0; i < selects.length; i++){
				//跳过
				if ( con[i] ) {
					continue ;
				}
				let
					select = selects[i],
					node = select;
				while( select.pre ){
					select = select.pre.head;
					let index = selects.indexOf(select);
					if ( index != -1 ) {
						node = select;
						con[index] = true;//可以跳过第index次
					}
				}
				if ( willMoveNodes.indexOf(node) == -1 ) {//如果不存在的话，添加
					willMoveNodes.push(node);
				}
			}
			for(let i = 0; i < willMoveNodes.length; i++){
				var nodeObj = willMoveNodes[i];
				willMoveNodes[i].initialCoord = {
					x: nodeObj.coord.x,
					y: nodeObj.coord.y
				};
			}
			this.willMoveNodes = willMoveNodes;
		},
		movingNodes: function(e){
			let mind = this;
			if ( mind.startMoveNodesFlag ) {
				if ( e.clientX != mind.startMoveNodesCooed.x || e.clientY != mind.startMoveNodesCooed.y) {
					mind.movingNodesFlag = true;
					//只要执行一次就好了
					mind.startMoveNodesFlag = false;
					for(let i = 0; i < mind.willMoveNodes.length; i++){
						mind.operateAllChild(mind.willMoveNodes[i], function(nodeObj){
							mind.hideNode(nodeObj);
							if ( nodeObj.close ) {
								return 1;
							}
						});
					}
				}
			}
			if ( mind.movingNodesFlag ) {
				mind.svg.setAttribute("data-grabbing", "1");
				for(let i = 0; i < mind.willMoveNodes.length; i++){
					let nodeObj = mind.willMoveNodes[i],
						offsetX = e.clientX - mind.startMoveNodesCooed.x,
						offsetY = e.clientY - mind.startMoveNodesCooed.y;
					mind.setNodeCoord(nodeObj, {
						x: nodeObj.initialCoord.x + (offsetX),
						y: nodeObj.initialCoord.y + (offsetY),
					});
				}
			}
		},
		finishMoveNodes: function(e){
			let mind = this;
			if ( mind.startMoveNodesFlag ||  mind.movingNodesFlag) {
				if ( mind.movingNodesFlag ) {
					mind.svg.removeAttribute("data-grabbing");
					for(let i = 0; i < mind.willMoveNodes.length; i++){
						var node = mind.willMoveNodes[i];
						node.offsetCoord.x += e.clientX - mind.startMoveNodesCooed.x;
						node.offsetCoord.y += e.clientY - mind.startMoveNodesCooed.y;
						mind.operateAllChild(node, function(nodeObj){
							mind.showNode(nodeObj);
							if ( nodeObj.close ) {
								return 1;
							}
						});
						mind.tidyNode(node, true);
					}
				}
				mind.startMoveNodesCooed.x = undefined;
				mind.startMoveNodesCooed.y = undefined; 
				for(var i = 0; i < mind.willMoveNodes.length; i++){
					mind.willMoveNodes[i].initialCoord = null;
				}
				//直接false,不判断了
				mind.startMoveNodesFlag = false;
				mind.movingNodesFlag = false;
				mind.finishMoveNodesFlag = true;
				mind.willMoveNodes = null;
			}
		},
		showNode: function(nodeObj){
			nodeObj.show();
			this.Graph.show.push(nodeObj);
			if ( nodeObj.pre ) {
				nodeObj.pre.show();
			}
			if ( nodeObj.tabs.length > 0 ) {
				for(let i = 0;i < nodeObj.tabs.length; i++){
					 nodeObj.tabs[i].show();
				}
			}
		},
		hideNode: function(nodeObj){
			nodeObj.hide();
			var index = this.Graph.show.indexOf(nodeObj);
			if ( index != -1 ) {
				this.Graph.show.splice(index, 1);
			}
			if ( nodeObj.pre ) {
				nodeObj.pre.hide();
			}
			if ( nodeObj.tabs.length > 0 ) {
				for(let i = 0;i < nodeObj.tabs.length; i++){
					 nodeObj.tabs[i].hide();
				}
			}
		},
		selectNode: function(nodeObj){
			if ( !nodeObj.selected ) {
				nodeObj.select();
				this.Graph.selects.push(nodeObj);
				this.selectingNode = nodeObj;
			}
		},
		unselectNode: function(nodeObj){
			if ( nodeObj == undefined ) {
				for (var i = this.Graph.selects.length - 1; i >= 0; i--) {
					this.Graph.selects[i].unselect();
				}
				this.Graph.selects = [];
				this.selectingNode = null;
				return ;
			}
			if ( nodeObj.selected ) {
				var index = this.Graph.selects.indexOf(nodeObj);
				this.Graph.selects.splice(index, 1);
				if ( index > 0 ) {
					//选中的节点取消选中之后，退回上一个被选中过的节点
					this.selectingNode = this.Graph.selects[index - 1];
				}else if ( index == 0 ) {
					//没有选中过节点
					this.selectingNode = null;
				}
				nodeObj.unselect();
			}
		},
		afterSelectNode: function(callback){
			Object.defineProperty(this, "selectingNode", {
				get: function () {
					return this._selectingNode;
				},
				set: function(nodeObj){
					this._selectingNode = nodeObj;
					callback(nodeObj);
				}
			});
		},
		afterEditTitle: function(callback){
			Object.defineProperty(this, "finishEditNodeTitleFlag", {
				get: function () {
					return this._finishEditNodeTitleFlag;
				},
				set: function(finishEditNodeTitleFlag){
					this._finishEditNodeTitleFlag = finishEditNodeTitleFlag;
					callback(finishEditNodeTitleFlag);
				}
			});
		},
		editingNodeTitle: function(nodeObj){
			this.editingNode = nodeObj;
			var
				textBox = this.textBox,
				node_texts = nodeObj.node_texts,
				title = nodeObj.title,
				shape = node_texts.getBoundingClientRect();
			textBox.setAttribute("contenteditable", "true");
			textBox.style.left = shape.x + "px";
			textBox.style.top = shape.y + "px";
			textBox.style["min-width"] = shape.width + "px";
			textBox.style["min-height"] = shape.height + "px";
			textBox.style.display = "block";
			textBox.innerHTML = title;
			textBox.focus();

			nodeObj.oldSize = {
				width: nodeObj.size.width,
				height: nodeObj.size.height,
			}
		},
		editedNodeTitle: function(){
			var
				nodeObj = this.editingNode,
				textBox = this.textBox;
			nodeObj.setRectTitle(textBox.innerHTML);
			this.finishEditNodeTitleFlag = nodeObj;
			textBox.removeAttribute("contenteditable");
			textBox.style.display = "none";
			textBox.style.left = null;
			textBox.style.top = null;
			nodeObj.oldSize = null;
			this.editingNode = null;
		},
		getRoot: function(nodeObj){
			var root = nodeObj;
			while(root.pre){
				root = root.pre.head;
			}
			return root;
		},
		operateAllChild: function(nodeObj, callback){
			let mind = this, nexts = nodeObj.nexts;

			if ( nexts.length > 0 ) {
				for (let i = 0; i < nexts.length; i++) {
					let con = callback(nexts[i].end);
					if( con === 0 ){
						break;
					}else if ( con === 1 ) {
						continue;
					}
					mind.operateAllChild(nexts[i].end, callback)
				}
			}
		},
		clearAll: function(){
			this.Graph.nodes = [];
			this.Graph.root = [];
			this.Graph.show = [];
			this.Graph.deleted_nodes = [];
			this.Graph.paths = [];
			this.Graph.deleted_paths = [];
			this.Graph.selects = [];
			this.Graph.tabs = [];

			this.paths.innerHTML = "";
			let nodes = this.nodes.getElementsByClassName("node");
			for (var i = 0; i < nodes.length; i++) {
				this.nodes.removeChild(nodes[i]);
				i--;
			}
		},
		getGraphData: function(){
			var
				mind = this,data = {},roots=[],nodes = [],paths = [],tabs = [];
			data.mind = {
				coord: {
					x: mind.coord.x,
					y: mind.coord.y,
				}
			};
			mind.Graph.root.forEach(function(item, index, array){
				let root = mind.Graph.nodes.indexOf(item);
				roots.push(root);
			});
			data.roots = roots;
			mind.Graph.nodes.forEach(function(item, index, array){
				let node = {};
				for(let key in item){
					switch (key) {
						case "container": 
							break;
						case "root": 
							node[key] = array.indexOf(item[key]);
							break;
						case "pre": 
							if ( item[key] == null ) {
								node[key] = -1;
							}else{
								node[key] = mind.Graph.paths.indexOf(item[key]);
							}
							break;
						case "nexts": 
							let nexts = [];
							for(let i = 0; i < item[key].length; i++){
								nexts[i] = mind.Graph.paths.indexOf(item[key][i]);
							}
							break;
						case "tabs":
							break;
						default:
							if ( item[key] == null ) {
							}else if ( item[key].nodeType == 1) {
							}else if ( typeof item[key] == "function" ) {
							}else{
								node[key] = item[key];
							}
							break;
					};
				};
				nodes.push(node);
			});
			data.nodes = nodes;
			mind.Graph.paths.forEach(function(item, index, array){
				let path = {};
				for(let key in item){
					switch (key) {
						case "head":
						case "end":
							path[key] = mind.Graph.nodes.indexOf(item[key]);
							break;
						default:
							if ( item[key] == null ) {
							}else if ( item[key].nodeType == 1) {
							}else if ( typeof item[key] == "function" ) {
							}else{
								path[key] = item[key];
							}
							break;
					}
				}
				paths.push(path);
			});
			data.paths = paths;
			for(let key in mind.Graph.tabs){
			}
			data.tabs = tabs;
			return JSON.stringify(data);
		},
		readGraphData: function(data){//这一块，体现了整体代码的需求规划失误，导致复用性差，很多功能只能自己重复再写一遍，Orz。要死了，毕设结束了，我要架构好代码结构！
			let dataJson = data, mind = this;
			mind.clearAll();
			if ( typeof data == "string" ) {
				dataJson = JSON.parse(data);
			}
			mind.coord.x = dataJson.mind.coord.x;
			mind.coord.y = dataJson.mind.coord.y;
			mind.nodes.setAttribute("transform", "translate("+mind.coord.x+" "+mind.coord.y+")");

			for (let i = 0; i < dataJson.nodes.length; i++) {
				let	node = dataJson.nodes[i],
					nodeObj = null,
					parent,	path;
				nodeObj = new Node({
					container: mind.nodes,
					coord: {
						x: node.coord.x - mind.coord.x,
						y: node.coord.y - mind.coord.y
					},
					form: node.form,
					structure: node.structure,
					title: node.title,
				});

				nodeObj.content = node.content;
				for(let key in node.key){
					nodeObj.key[key] = false;
				}
				// console.log("nodeObj.node:", nodeObj.node ,"nodeObj.key:", nodeObj.key);
				mind.Graph.nodes.push(nodeObj);
				nodeObj.close = node.close;
				if ( node.isShow ) {
					nodeObj.show();
					mind.Graph.show.push(nodeObj);
				}else{
					nodeObj.setCoord(nodeObj.coord);
					nodeObj.size.height = node.size.height;
					nodeObj.size.width = node.size.width;
				}

				mind.unselectNode();
				mind.selectNode(nodeObj);
				mind.nodeInit(nodeObj);
				//标志，已经增加了一个节点
				mind.addNodeFlag = nodeObj;

				nodeObj.offsetCoord = {
					x: node.offsetCoord.x,
					y: node.offsetCoord.y,
				}
				if ( node.pre == -1) {
					mind.Graph.root.push(nodeObj);
					nodeObj.treeArea = {
						right: node.treeArea.right,
						left: node.treeArea.left
					}
				}else{
					if (node.treeArea) {
						nodeObj.treeArea = {
							height: node.treeArea.height,
						}
					}
					nodeObj.treeSide = node.treeSide;
					parent = mind.Graph.nodes[dataJson.paths[node.pre].head];//我应该把数据和dom分离的...好痛苦...Orz

					path = new Path({
						container: mind.paths,
						head: parent,
						end: nodeObj
					});
					if ( dataJson.paths[node.pre].isShow ) {
						path.show();
						path.setCoord();
					}
					mind.Graph.paths.push(path);
					parent.nexts.push(path);
					nodeObj.pre = path;
				}
			}
		},
	};
	function Node(argu){
		this.coord = {x: argu.coord.x,y: argu.coord.y};
		this.title = argu.title;
		//节点可视化图形类别
		this.form = argu.form;
		//节点组织结构
		this.structure = argu.structure;
		//节点组织结构根节点
		this.root = (argu.root == undefined) ? this : argu.root;
		this.size = {};
		//标志，是否显示
		this.isShow = false;
		this.selected = false;
		this.container = argu.container;
		//该节点在组织结构的下级节点
		this.nexts = [];
		//该节点在组织结构的上级节点
		this.pre = null;
		//该节点的任意关系节点
		this.tabs = [];
		//关键字
		this.key = {};

		this.init();
	}
	Node.prototype = {
		constructor: Node,
		init: function(){
			var
				node = this.node = document.createElementNS("http://www.w3.org/2000/svg","g"),
				node_back = this.node_back = document.createElementNS("http://www.w3.org/2000/svg","g"),
				node_texts = this.node_texts = document.createElementNS("http://www.w3.org/2000/svg","g"),
				node_back_path = this.node_back_path = document.createElementNS("http://www.w3.org/2000/svg","path");

			node.appendChild(node_back);
			node_back.appendChild(node_back_path);
			node_back.appendChild(node_texts);

			var
				nodeAttr = {
					"class": "node",
				},
				backAttr = {
					"class": "node_background",
					"transform": "translate(0.5 0.5)",
				},
				backPAttr = {
					"class": "node_background_path",
				},
				textsAttr = {
					"class": "node_texts",
				};
			set(node, nodeAttr);
			set(node_texts, textsAttr);
			set(node_back, backAttr);
			set(node_back_path, backPAttr);
			return node;
		},
		setRectTitle: function( title ){
			if ( this.isShow == false ) {
				return;
			}
			title = title.replace(/<br>/g,"");
			if ( title == "") {
				return;
			}
			var
				titles = title.split("\n"),
				node = this.node,
				node_back = this.node_back,
				node_back_path = this.node_back_path,
				node_texts = this.node_texts,
				node_text = [],
				width = 0,
				height = 0,
				horizontal = 10,
				vertical = 5,
				gap = 4,
				radius = 5;
			while( titles[0] == "" ){
				titles.splice(0, 1);
			}
			while( titles[titles.length - 1] == "" ){
				titles.pop();
			}
			if ( titles.length == 0 ) {
				return;
			}
			this.title = node_texts.innerHTML = "";
			for(var i = 0; i < titles.length; i++){
				this.title += titles[i];
				if ( i != titles.length - 1) {
					this.title += "\n";
				}
			}
			for (var i = 0; i < titles.length; i++) {
				var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
				text.innerHTML = (titles[i]);
				node_texts.appendChild(text);
				var	textY = vertical - text.getBBox().y*(i+1) + i*gap;
				text.setAttribute("x",horizontal);
				text.setAttribute("y",textY);
				text.setAttribute("height", 21);
				width = (width < text.getBBox().width) ? text.getBBox().width : width;
				height += 21;
			}
			width += 2 * horizontal;
			height += 2 * vertical;
			this.node_back_path.setAttribute("d","M0,"+radius+
				" A"+radius+","+radius+" 0 0,1 "+radius+",0"+" H"+(width-radius)+
				" A"+radius+","+radius+" 0 0,1 "+width+","+radius+" V"+(height-radius)+
				" A"+radius+","+radius+" 0 0,1 "+(width-radius)+","+height+" H"+radius+
				" A"+radius+","+radius+" 0 0,1 0,"+(height-radius)+" V"+radius);
			this.size.width = width;
			this.size.height = height;
		},
		setCoord: function( coord ){
			this.node.setAttribute("transform", "translate("+ coord.x +" "+ coord.y +")");
			this.coord.x = coord.x;
			this.coord.y = coord.y;
		},
		show: function(){
			this.isShow = true;
			this.container.appendChild(this.node);
			if( this.title != undefined ){
				if ( this.form == "rect" ) {
					this.setRectTitle(this.title);
				}
			}
			this.setCoord(this.coord);
		},
		hide: function(){
			this.isShow = false;
			this.container.removeChild(this.node);
		},
		select: function(){
			this.selected = true;
			this.node.setAttribute("type", "select");
		},
		unselect: function(){
			this.node.removeAttribute("type");
			this.selected = false;
		},
		getCentre: function(){
			return {
				cX: this.coord.x + (this.size.width/2),
				cY: this.coord.y + (this.size.height/2)
			}
		}
	}
	function Path(argu){
		this.container = argu.container;
		this.head = argu.head;
		this.end = argu.end;
		this.tab = (argu.tab == undefined) ? [] : argu.tab;
		this.isShow = false;
		this.init();
	}
	Path.prototype = {
		constructor: Path,
		init: function(){
			var
				path = this.path = document.createElementNS("http://www.w3.org/2000/svg","g"),
				line = this.path_line = document.createElementNS("http://www.w3.org/2000/svg","path"),
				tab = this.path_tab = document.createElementNS("http://www.w3.org/2000/svg","g"),
				tab_back = this.path_tab_back = document.createElementNS("http://www.w3.org/2000/svg","path");

			path.appendChild(line);
			tab.appendChild(tab_back);
			path.appendChild(tab);
			// this.container.appendChild(path);

			var
				pathAttr = {
					"class": "path",
				},
				lineAttr = {
					"class": "path_line",
					"fill": "none",
					"stroke": "black",
					"stroke-width": "1",
				},
				tabAttr = {
					"class": "tab",
				},
				tabBAttr = {
					"class": "tab_back",
				};
				set(path, pathAttr);
				set(line, lineAttr);
				set(tab, tabAttr);
				set(tab_back, tabBAttr);

				this.setCoord();
		},
		setCoord: function(){
			if ( ! this.isShow ) {
				return;
			}
			var
				head = this.head,
				end = this.end,
				sX = this.head.getCentre().cX,
				sY = this.head.getCentre().cY,
				eX = this.end.getCentre().cX,
				eY = this.end.getCentre().cY;
			this.path_line.setAttribute( "d", "M"+sX+" "+sY+" Q"+(sX)+" "+(eY)+","+eX+" "+eY );
		},
		show: function(){
			this.isShow = true;
			this.container.appendChild(this.path);
		},
		hide: function(){
			this.isShow = false;
			this.container.removeChild(this.path);
		}
	};
	function District(panel){
		this.isShow = false;
		this.coord = {};
		this.panel = panel;
		this.init();
	};
	District.prototype = {
		constructor: District,
		coord: {},
		init: function(){
			var
				districtObj = this,
				panel = this.panel,
				district = this.district = document.createElement("div");
			district.className = "jstool_district";
			district.setAttribute("data-show","0");
			document.body.appendChild(district);
			panel.addEventListener("mousedown", function(e){
				if ( districtObj.isShow ) {
					districtObj.close();
				}
				else if ( e.button == 0) {
					var
						scrollX = document.documentElement.scrollLeft || document.body.scrollLeft,
						scrollY = document.documentElement.scrollTop || document.body.scrollTop,
						x = e.pageX || e.clientX + scrollX,
						y = e.pageY || e.clientY + scrollY;
					districtObj.show(x, y);
				}
			});
			panel.addEventListener("mousemove", function(e){
				districtObj.move(e);
			});
			district.addEventListener("mousemove", function(e){
				districtObj.move(e);
			});
			document.addEventListener("mouseup", function(e){
				if ( e.button == 0 ) {
					districtObj.close();
				}
			});
			stopPropagation("mousedown", district);
			return district;
		},
		move: function(e){
			if ( !this.isShow ) {
				return;
			}
			var
				scrollX = document.documentElement.scrollLeft || document.body.scrollLeft,
				scrollY = document.documentElement.scrollTop || document.body.scrollTop,
				eX = this.coord.eX = e.pageX || e.clientX + scrollX,
				eY = this.coord.eY = e.pageY || e.clientY + scrollY,
				sX = this.coord.sX,
				sY = this.coord.sY;
			this.district.style.left = (eX > sX ? sX : eX) +"px"; 
			this.district.style.top = (eY > sY ? sY : eY) +"px";
			this.district.style.width = Math.abs(eX-sX)+"px";
			this.district.style.height = Math.abs(eY-sY)+"px";
		},
		show: function(x, y){
			this.isShow = true;
			this.district.setAttribute("data-show","1");
			this.coord.sX = this.coord.eX = this.district.style.left = x;
			this.coord.sY = this.coord.eY = this.district.style.top = y;
		},
		close: function(){
			if ( !this.isShow ) {
				return;
			}
			this.isShow = false;
			this.district.setAttribute("data-show","0");
			this.district.style.left =
			this.district.style.top = 
			this.district.style.width = 
			this.district.style.height = "0px";
		},
	};
	var Menu = function(container){
		this.coord = {};
		this.panel = container;
		this.border = {};
		// this.container = container;
		this.init(container);
	};
	Menu.prototype = {
		constructor: Menu,
		init: function(){
			var
				menu = this.menu = document.createElement("ul");
			menu.className = "jstool_menu";
			document.body.appendChild(menu);
			stopPropagation("mousedown", menu);
			stopPropagation("mousemove", menu);
			stopPropagation("mouseup", menu);
			return menu;
		},
		show: function(cX, cY){
			var
				menu = this.menu,
				panel = this.panel,
				border = this.border,
				x = (this.coord.x = cX),
				y = (this.coord.y = cY),
				leftBorder = (border.left == undefined) ? panel.getBoundingClientRect().left : border.left,
				rightBorder = (border.right == undefined) ? (leftBorder + panel.clientWidth) : panel.clientWidth - border.right,
				topBorder = (border.top == undefined) ? panel.getBoundingClientRect().top : border.top,
				bottomBorder = (border.bottom == undefined) ? (topBorder + panel.clientHeight) : panel.clientHeight - border.bottom;

			menu.style.display = 'block';
			if ( x > rightBorder || x < leftBorder ) {
				this.close();
				return;
			}
			else if (x + menu.offsetWidth >= ( rightBorder )) {
				x  = x - menu.offsetWidth;
			}
			else{
				x = x;
			}
			if ( y > bottomBorder || y < topBorder ) {
				this.close();
				return;
			}
			else if ((y + menu.offsetHeight + 1) >= ( bottomBorder )) {
				y = y - menu.offsetHeight;
			}
			else{
				y = y+1;
			}
			menu.style.left = x + 'px';
			menu.style.top = y + 'px';
		},
		close: function(){
			this.menu.style.display = 'none';
		},
		setBorder: function(border){
			if ( border.left ) {
				this.border.left = border.left;
			}
			if ( border.right ) {
				this.border.right = border.right;
			}
			if ( border.top ) {
				this.border.top = border.top;
			}
			if ( border.bottom ) {
				this.border.bottom = border.bottom;
			}
		},
		cancelBorder: function(border){
			this.border = {};
		},
		addMenuLis: function(lis, parent){
			var
				menuObj = this, cUl, pUl;
			if ( parent != undefined ) {
				cUl = document.createElement("ul");
			}
			for(var i = 0; i < lis.length; i++){
				var
					li = document.createElement("li"),
					span = document.createElement("span");
				if(lis[i].description){
					span.title = lis[i].description;
				}
				span.innerText = lis[i].title;
				li.appendChild(span);
				stopPropagation("mousedown", li);
				if ( lis[i].children != undefined ) {
					pUl = menuObj.addMenuLis(lis[i].children, li);
					li.appendChild(pUl);
				}else{
					li.addEventListener("mouseup", function(e){
						menuObj.close();
					});
					li.addEventListener("mouseup", lis[i].fun);
				}
				if ( parent != undefined ) {
					cUl.appendChild(li);
				}else{
					menuObj.menu.appendChild(li);
				}
			}
			if ( parent != undefined ) {
				parent.addEventListener("mouseenter", function(e){
					cUl.style.display = "block";
					var
						cWidth = cUl.getBoundingClientRect().width,
						cHeight = cUl.getBoundingClientRect().height,
						pWidth = this.getBoundingClientRect().width,
						pHeight = this.getBoundingClientRect().height,
						x = this.getBoundingClientRect().x + this.getBoundingClientRect().width + cWidth - 5,
						y = this.getBoundingClientRect().y + cHeight,
						panel = menuObj.panel,
						border = menuObj.border,
						leftBorder = (border.left == undefined) ? panel.getBoundingClientRect().width : border.left,
						rightBorder = (border.right == undefined) ? ( panel.clientWidth) : border.right,
						topBorder = (border.top == undefined) ? panel.getBoundingClientRect().top : border.top,
						bottomBorder = (border.bottom == undefined) ? ( panel.clientHeight) : border.bottom;

					if ( x > panel.getBoundingClientRect().width - rightBorder ) {
						cUl.style.left = null;
						cUl.style.right = pWidth - 5 + "px";
					}else{
						cUl.style.left = pWidth - 5 + "px";
						cUl.style.right = null;
					}
					if ( y > bottomBorder ) {
						cUl.style.top = null;
						cUl.style.bottom = "0";
					}else{
						cUl.style.top = "0";
						cUl.style.bottom = null;
					}
				});
				parent.addEventListener("mouseleave", function(e){
					cUl.style.display = "none";
					cUl.style.top = null;
					cUl.style.bottom = null;
					cUl.style.right = null;
					cUl.style.left = null;
				});
				cUl.addEventListener("mousedown", function(e){
					menuObj.close();
				});
				return cUl;
			}else{
				menuObj.menu.addEventListener("mousedown", function(){
					menuObj.close();
				});
			}
		},
		showPanel: function( panel ){
			var menuObj = this;
			panel.addEventListener("mouseup",function(e){
				if ( e.button == 2 ) {
					menuObj.show(e.clientX, e.clientY);
				}
			});
			panel.addEventListener("mousedown", function(e){
				menuObj.close();
			});
		},
		closePanel: function( panel ){
			var menuObj = this;
			panel.addEventListener("mousedown", function(e){
				menuObj.close();
			});
		},
	}
	//矩形的重叠判断
	function rectOverlap(coord1, coord2){
		//矩形的较大横坐标值，比另一个矩形的较小横坐标值大；纵坐标亦然。两个矩形重叠
		if ( coord1.eX > coord2.sX && coord2.eX > coord1.sX && coord1.eY > coord2.sY && coord2.eY > coord1.sY ) {
			return true;
		}else{
			return false;
		}
	};
	function stopEvent(event,ele){
		ele.addEventListener(event, function(e){
			e.stopPropagation();
			e.preventDefault();
		});
	};
	function stopDefault(event,ele){
		ele.addEventListener(event, function(e){
			e.preventDefault();
		});
	};
	function stopPropagation(event,ele){
		ele.addEventListener(event, function(e){
			e.stopPropagation();
		});
	};
	function copy(obj, copy) {
		for (var key in copy) {
			if ( !obj.hasOwnProperty(key)) {
				obj[key] = copy[key];
			}
		}
		return obj;
	};
	function set(ele,attributes){
		if(attributes != undefined && ele != undefined){
			for(var key in attributes){
				ele.setAttribute(key,attributes[key]);
			}
		}
		return ele;
	};
	function fixed(obj, keys){
		for (var i = keys.length - 1; i >= 0; i--) {
			var key = keys[i];
			Object.defineProperty(obj, key, {
				configurable: false,
				writable: false,
				enumerable: false,
				value: obj[key]
			});
		}
	};
	JSTool.init(document.body);
})( window );