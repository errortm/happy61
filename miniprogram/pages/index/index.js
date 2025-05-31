Page({
  data: {
    toChild: '',
    loading: false,
    result: null
  },
  onInput(e) {
    this.setData({ toChild: e.detail.value });
  },
  async onGenerate() {
    if (!this.data.toChild) return;
    this.setData({ loading: true });
    // TODO: 替换为你的云托管后端域名
    const API_BASE_URL = 'https://你的云托管域名';
    try {
      const res = await wx.request({
        url: API_BASE_URL + '/api/upload',
        method: 'POST',
        data: { toChild: this.data.toChild },
        header: { 'content-type': 'application/json' },
      });
      this.setData({ result: res.data });
    } catch (e) {
      wx.showToast({ title: '请求失败', icon: 'none' });
    }
    this.setData({ loading: false });
  },
  onReset() {
    this.setData({
      toChild: '',
      result: null
    });
  }
});
