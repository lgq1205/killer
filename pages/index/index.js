const app = getApp()

Page({
  data: {
    array:[],
    img_list:['image/Qnan.jpg', 'image/Qyu.jpg', 
    'image/nv2.jpg', 'image/lie2.jpg', 'image/bai2.jpg', 
    'image/shou2.jpg', 'image/min2.jpg', 'image/lang2.jpg', 
    'image/langwang2.jpg', 'image/bailangwang2.jpg'],
    max_num : 1,
    img_id : 0,

    avatarAuto: 'image/Qnv.jpg', // 系统头像
		avatarUser: 'image/Qnan.jpg', // 用户头像
		isAnimation: true, // 是否开启动画
		viewHeight: 0, // 设置srcoll-view的高度
		canSend: false, // 是否可发送
		chatDataArray: [], // 对话内容
		useMsg: '', // 用户输入框内的信息
		toView: 'toFooter', // 定位到底部，用于处理消息容器滑动到最底部
		serviceMsg: '你好呀，朋友。我是一个轻量级聊天机器人。前端使用scroll-view构建聊天UI容器，后端数据来源于的图灵机器人API v2.0。这是一个简单的聊天小程序Demo。', // 客服对话信息

  },

  onLoad: function() {
      const list = []
      for(var i = 0; i < this.data.max_num; ++i) {
        const item = {
            img_id : this.data.img_id
        }
          list.push(item)
      }

      this.setData({
        array : list
      })
      const that = this;
      that.getBtnHeight();  // 处理 设备可显示高度
  },

  imgclick: function(e) {
    console.log(e)
    var current_id = Number(e.currentTarget.id)
    let tmp_img_id = this.data.array[current_id].img_id
    tmp_img_id = (tmp_img_id + 1) % this.data.img_list.length
      this.setData({
        [`array[${current_id}].img_id`] : tmp_img_id,
      })
  },
  changenum: function(e) {
    const m_num = e.detail.value
    console.log(m_num)
    this.setData({
      max_num : m_num
    })
    this.onLoad()
  },
  // 监听 滑动事件
	scroll(e) {
		console.log(e)
	},

	// 处理 滑动到底部 动效
	tapMove() {
		this.setData({ toView: 'toFooter' });
	},

	// 监听 底部输入框
	bindInputValue: function (e) {
		const useMsg = e.detail.value;
		if (useMsg.length !== 0) {
			this.setData({ useMsg, canSend: true });
		} else {
			this.setData({ canSend: false });
		}
	},
  // 发送聊天信息 
	formSubmit: function (e) {
		const that = this, canSend = that.data.canSend;
		if (canSend) {
			let useMsg = that.data.useMsg, serviceMsg = that.data.serviceMsg, chatDataArray = that.data.chatDataArray, waitting = '正在回复ing...';
			let chatData = { serviceMsg: waitting, useMsg }, oldChatDataArray = chatDataArray.concat(chatData);
			that.setData({ useMsg: '', canSend: false, chatDataArray: oldChatDataArray });
      that.tapMove(); // 执行第一次滑动 定位到底部
			// 接入图灵机器人
			// 更多 图灵机器人 Api接口说明，详见文档 -> https://www.kancloud.cn/turing/www-tuling123-com/718227
			let params = {
				"reqType": 0,
				"perception": { "inputText": { "text": useMsg } },
				"userInfo": {
					"apiKey": "",  // 此处填入图灵机器人申请的ApiKey，如不填写会提示你：apiKey格式不合法！
					"userId": "duoguyu.com"  // 此处为用户的唯一标识符，openId或userId
				}
			};
			wx.request({
				url: 'http://openapi.tuling123.com/openapi/api/v2',
				data: params,
				method: 'POST',
				header: { 'Content-Type': 'application/json' },
				success: function (res) {
					const serviceMsg = res.data.results[0].values.text;  // 得到图灵接口返回的文本信息

					// 延迟1s 回复
					setTimeout(() => {
						// 修饰动画 - 正在回复中 变回原值
						const i = oldChatDataArray.length - 1;
						oldChatDataArray[i].serviceMsg = serviceMsg;
						that.setData({ chatDataArray: oldChatDataArray });
						that.tapMove(); // 执行第二次滑动 定位到底部
					}, 1000);
				},
				fail: function () {
					// fail  
				},
				complete: function () {
					// complete  
				}
			});
		} else {
			console.log('当前还不能发送');
		}

	},

	// 处理 设备可显示高度
	getBtnHeight: function () {
		const that = this, query = wx.createSelectorQuery();
		query.select('#footerBtnGroup').boundingClientRect();
		query.selectViewport().scrollOffset();
		query.exec(function (res) {
			const _h = res[0].height * 2 - 15;
			let windowHeight = wx.getSystemInfoSync().windowHeight;
			let windowWidth = wx.getSystemInfoSync().windowWidth;
			const viewHeight = parseInt(750 * windowHeight / windowWidth - _h);
			that.setData({ viewHeight });
			that.tapMove();
		});
	},


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
	onReady: function () {
		this.animation = wx.createAnimation(); // 创建动画。

	},
})
