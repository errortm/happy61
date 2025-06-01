<template>
  <div class="childhood-page start-bg">
    <div v-if="!result" class="start-container">
      <div class="main-title">时光寄语</div>
      <div class="sub-title">给童年的自己留一句话，听听TA和未来的你怎么说。</div>
      <div class="input-card">
        <div class="input-label">你想对童年的自己说什么？</div>
        <textarea v-model="toChild" placeholder="例如：小时候要尽情地玩，开心。" rows="4" class="input-apple" />
        <button @click="generate" :disabled="!toChild || loading" class="btn-apple main-btn">
          {{ loading ? '生成中...' : '生成时光寄语' }}
        </button>
      </div>
    </div>
    <div v-if="result" class="poster-content-wrapper" :style="posterBgStyle">
      <div class="poster-bg-image"></div>
      <div class="poster-bg-mask"></div>
      <div class="poster-content" ref="poster">
        <div class="section-card">
          <div class="section-title">我对过去的自己说：</div>
          <div class="section-content">{{ toChild }}</div>
        </div>
        <div class="section-card">
          <div class="section-title">过去的我对现在说：</div>
          <div class="section-content">{{ result?.childReply || '你很棒，要一直开心哦！' }}</div>
        </div>
        <div class="section-card">
          <div class="section-title">未来的我对现在说：</div>
          <div class="section-content">{{ result?.futureReply || '相信自己，未来无限可能！' }}</div>
        </div>
        <div class="poster-bottom">
          <!-- 删除二维码img标签，避免html2canvas重复截图 -->
        </div>
      </div>
    </div>
    <button v-if="result" @click="savePoster" class="btn-apple share-btn">保存/分享海报</button>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted, onUnmounted } from 'vue';
import html2canvas from 'html2canvas';

const toChild = ref('');
const loading = ref(false);
const result = ref<any>(null);
const cardShow = ref(false);

// 静态测试数据，后续可用微信授权替换
const userInfo = {
  avatar: '/avatar.jpg', // 请将测试头像放在 public 目录下
  nickname: '小明'
};

// 10张背景图
const bgImages = Array.from({length: 10}, (_, i) => `/poster-bg/_Image(${i+1}).png`);
const selectedBgIndex = ref(0);
let bgCounter = 0;
const isUserSelected = ref(false);

onMounted(() => {
  // 自动轮播逻辑可去除或保留，按需
});
onUnmounted(() => {
  // 清理定时器（如有）
});

const posterBgStyle = computed(() => ({
  backgroundImage: `url(${bgImages[selectedBgIndex.value]})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}));

async function generate() {
  if (!toChild.value) return;
  loading.value = true;
  cardShow.value = false;
  // 顺序切换背景图
  selectedBgIndex.value = bgCounter;
  bgCounter = (bgCounter + 1) % bgImages.length;
  isUserSelected.value = true;
  // 调用后端AI接口
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ toChild: toChild.value })
  });
  result.value = await res.json();
  loading.value = false;
  await nextTick();
  cardShow.value = true;
}

async function savePoster() {
  const posterEl = (document.querySelector('.poster-content-wrapper') as HTMLElement);
  if (!posterEl) return;
  // 只用html2canvas生成基础内容
  const baseCanvas = await html2canvas(posterEl, { backgroundColor: null });
  // 新建一个同尺寸的新canvas
  const canvas = document.createElement('canvas');
  canvas.width = baseCanvas.width;
  canvas.height = baseCanvas.height;
  const ctx = canvas.getContext('2d');
  // 只绘制html2canvas生成的内容
  ctx.drawImage(baseCanvas, 0, 0);
  // 保存图片
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = '时光机寄语海报.png';
  link.click();
}
</script>

<style scoped>
.start-bg {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 0;
}
.start-container {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 64px;
  background: #f5f7fa;
}
.main-title {
  font-size: 2.4rem;
  font-weight: 900;
  color: #222;
  letter-spacing: 2px;
  text-align: center;
  font-family: 'SourceHanRoundedSC', 'PingFang SC', Arial, sans-serif;
  margin-bottom: 12px;
}
.sub-title {
  font-size: 1.13rem;
  color: #6b7685;
  text-align: center;
  margin-bottom: 38px;
  font-family: 'PingFang SC', 'SourceHanRoundedSC', Arial, sans-serif;
}
.input-card {
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 2px 16px 0 #e0eaff33;
  padding: 32px 24px 24px 24px;
  width: 420px;
  max-width: 96vw;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 32px;
}
.input-label {
  font-size: 1.13rem;
  color: #222;
  font-weight: 700;
  margin-bottom: 12px;
  font-family: 'PingFang SC', 'SourceHanRoundedSC', Arial, sans-serif;
}
.input-apple {
  width: 100%;
  border-radius: 12px;
  border: 1.5px solid #e0eaff;
  background: #f8fafc;
  padding: 16px 14px;
  font-size: 1.08rem;
  font-family: 'SourceHanRoundedSC', 'PingFang SC', Arial, sans-serif !important;
  box-shadow: none;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  margin-bottom: 22px;
  resize: none;
}
.input-apple:focus {
  border: 1.5px solid #007aff;
  box-shadow: 0 2px 8px 0 #b3e0ff33;
}
.main-btn {
  width: 100%;
  font-size: 1.18rem;
  border-radius: 12px;
  padding: 16px 0;
  font-weight: 800;
  background: linear-gradient(90deg, #338bff 0%, #38cfff 100%);
  box-shadow: 0 4px 16px 0 #b3e0ff33;
  margin-top: 0;
}
.childhood-page {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 32px;
  position: relative;
}
.poster-content-wrapper {
  position: relative;
  width: 380px;
  max-width: 96vw;
  margin-bottom: 24px;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 8px 32px 0 rgba(60,60,60,0.10);
  background: transparent;
}
.poster-bg-image {
  position: absolute;
  left: 0; top: 0; right: 0; bottom: 0;
  background: url('/poster-bg/_Image (7).png') center center/cover no-repeat;
  opacity: 0.55;
  z-index: 1;
  pointer-events: none;
  border-radius: 32px;
}
.poster-bg-mask {
  position: absolute;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(44,62,80,0.7);
  z-index: 2;
  pointer-events: none;
  border-radius: 32px;
  overflow: hidden;
}
.poster-content {
  position: relative;
  z-index: 3;
  padding: 38px 18px 100px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.section-card {
  background: transparent;
  border-radius: 22px;
  box-shadow: none;
  padding: 18px 0 14px 0;
  margin-bottom: 18px;
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.section-title {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 900;
  margin-bottom: 8px;
  letter-spacing: 1.2px;
  font-family: 'SourceHanRoundedSC', 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  text-shadow: 0 2px 8px #0004;
  position: relative;
  padding-bottom: 6px;
}
.section-title::after {
  content: '';
  display: block;
  width: 38px;
  height: 3px;
  border-radius: 2px;
  margin-top: 7px;
  background: linear-gradient(90deg, #fff8 0%, #fff2 100%);
}
.section-content {
  color: #fff;
  font-size: 0.9rem;
  line-height: 2.1;
  margin-bottom: 2px;
  margin-top: 8px;
  text-align: left;
  font-family: 'SourceHanSerifSC', 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  font-weight: 400;
  letter-spacing: 0.2px;
  text-shadow: 0 2px 8px #0003;
}
.poster-bottom {
  position: absolute;
  left: 0; right: 0; bottom: 18px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 24px;
}
.qrcode {
  width: 180px; height: 180px; border-radius: 12px; box-shadow: 0 2px 8px 0 #b3e0ff33;
}
.form-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  margin-top: 18px;
  z-index: 1;
  width: 100vw;
  max-width: 420px;
}
.input-apple {
  width: 320px; max-width: 96vw;
  border-radius: 16px;
  border: none;
  background: #f3f6fa;
  padding: 12px 16px;
  font-size: 1.08rem;
  font-family: 'SourceHanRoundedSC', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif !important;
  box-shadow: 0 2px 8px 0 #e0eaff22;
  outline: none;
  transition: box-shadow 0.3s;
}
.input-apple:focus {
  box-shadow: 0 4px 16px 0 #b3e0ff33;
}
.btn-apple {
  width: 220px; max-width: 90vw;
  padding: 14px 0;
  border: none;
  border-radius: 22px;
  background: linear-gradient(90deg, #007aff 0%, #38cfff 100%);
  color: #fff;
  font-size: 1.18rem;
  font-weight: 700;
  box-shadow: 0 4px 16px 0 #b3e0ff44;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
  margin-top: 0;
  letter-spacing: 1px;
}
.btn-apple:disabled {
  background: #e0e0e0;
  color: #aaa;
  box-shadow: none;
}
.btn-apple:not(:disabled):hover {
  background: linear-gradient(90deg, #0051c7 0%, #38cfff 100%);
  transform: scale(1.04);
  box-shadow: 0 6px 24px 0 #38cfff55;
}
.share-btn {
  margin-top: 0;
  background: linear-gradient(90deg, #38cfff 0%, #4f8cff 100%);
}
@media (max-width: 480px) {
  .poster-content-wrapper, .input-apple { width: 98vw; max-width: 98vw; }
  .btn-apple { width: 96vw; max-width: 96vw; }
  .form-area { max-width: 98vw; }
  .poster-content { padding: 14px 6px 80px 6px; }
  .section-card { max-width: 98vw; padding: 12px 0 10px 0; }
  .qrcode { width: 180px; height: 180px; }
}
</style> 