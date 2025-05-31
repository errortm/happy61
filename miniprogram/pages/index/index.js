Page({
  data: {
    toChild: '',
    loading: false,
    result: null,
    userInfo: null,
    bgIndex: 1
  },
  onInput(e) {
    this.setData({ toChild: e.detail.value });
  },
  async onGenerate() {
    if (!this.data.toChild) return;
    this.setData({ loading: true });
    const API_BASE_URL = 'https://express-rw8a-165352-6-1362038039.sh.run.tcloudbase.com';
    try {
      const res = await wx.request({
        url: API_BASE_URL + '/api/upload',
        method: 'POST',
        data: { toChild: this.data.toChild },
        header: { 'content-type': 'application/json' },
        success: (res) => {
          this.setData({ result: res.data || null });
        },
        fail: () => {
          wx.showToast({ title: '请求失败', icon: 'none' });
          this.setData({ result: null });
        },
        complete: () => {
          this.setData({ loading: false });
        }
      });
    } catch (e) {
      wx.showToast({ title: '请求失败', icon: 'none' });
      this.setData({ result: null });
      this.setData({ loading: false });
    }
  
  },
  onReset() {
    this.setData({
      toChild: '',
      result: null
    });
  },
  onLoad() {
    // 随机选一张背景图
    this.setData({ bgIndex: Math.floor(Math.random() * 10) + 1 });
  },
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于生成专属海报',
      success: (res) => {
        this.setData({ userInfo: res.userInfo });
      },
      fail: () => {
        wx.showToast({ title: '需要授权头像', icon: 'none' });
      }
    });
  },
  onSavePoster() {
    const that = this;
    const bgPath = `/pic/_Image (${that.data.bgIndex}).png`;
    if (!that.data.userInfo) {
      that.getUserProfile();
      return;
    }
    wx.showLoading({ title: '生成中...' });
    wx.getImageInfo({
      src: bgPath,
      success(bgRes) {
        wx.getImageInfo({
          src: that.data.userInfo.avatarUrl,
          success(avatarRes) {
            const ctx = wx.createCanvasContext('posterCanvas', that);
            // 绘制背景图
            ctx.drawImage(bgRes.path, 0, 0, 600, 900);
            // 半透明遮罩
            ctx.setFillStyle('rgba(255,255,255,0.85)');
            ctx.fillRect(0, 0, 600, 900);
            // 标题
            ctx.setFontSize(28);
            ctx.setFillStyle('#338bff');
            ctx.setTextAlign('center');
            ctx.fillText('时光寄语', 300, 60);
            // 分割线
            ctx.setStrokeStyle('#eee');
            ctx.moveTo(60, 90);
            ctx.lineTo(540, 90);
            ctx.stroke();
            // 我对过去的自己说
            ctx.setFontSize(20);
            ctx.setFillStyle('#222');
            ctx.setTextAlign('left');
            ctx.fillText('我对过去的自己说：', 60, 130);
            ctx.setFontSize(18);
            ctx.setFillStyle('#444');
            ctx.fillText(that.data.toChild, 60, 160);
            // 过去的我对现在说
            ctx.setFontSize(20);
            ctx.setFillStyle('#222');
            ctx.fillText('过去的我对现在说：', 60, 210);
            ctx.setFontSize(18);
            ctx.setFillStyle('#444');
            ctx.fillText(that.data.result.childReply || '', 60, 240);
            // 未来的我对现在说
            ctx.setFontSize(20);
            ctx.setFillStyle('#222');
            ctx.fillText('未来的我对现在说：', 60, 290);
            ctx.setFontSize(18);
            ctx.setFillStyle('#444');
            ctx.fillText(that.data.result.futureReply || '', 60, 320);
            // 用户头像
            ctx.save();
            ctx.beginPath();
            ctx.arc(90, 820, 40, 0, 2 * Math.PI);
            ctx.clip();
            ctx.drawImage(avatarRes.path, 50, 780, 80, 80);
            ctx.restore();
            // 用户昵称
            ctx.setFontSize(20);
            ctx.setFillStyle('#338bff');
            ctx.setTextAlign('left');
            ctx.fillText(that.data.userInfo.nickName, 150, 830);
            ctx.draw(false, () => {
              wx.canvasToTempFilePath({
                canvasId: 'posterCanvas',
                success: function(res) {
                  wx.hideLoading();
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: function() {
                      wx.showToast({ title: '已保存到相册', icon: 'success' });
                    },
                    fail: function() {
                      wx.showToast({ title: '保存失败', icon: 'none' });
                    }
                  });
                },
                fail: function() {
                  wx.hideLoading();
                  wx.showToast({ title: '生成图片失败', icon: 'none' });
                }
              }, that);
            });
          },
          fail() {
            wx.hideLoading();
            wx.showToast({ title: '头像加载失败', icon: 'none' });
          }
        });
      },
      fail() {
        wx.hideLoading();
        wx.showToast({ title: '背景图加载失败', icon: 'none' });
      }
    });
  }
});
