# Happy61 童年照+梦想+AI称号+勋章项目

## 目录结构

```
/happy61
  ├─ backend/           # 后端 Node.js + Express + TypeScript
  ├─ frontend/          # 前端 Vue3 + Vite + html2canvas
```

## 启动方式

### 1. 后端
```
cd backend
npm install
# 配置 .env 文件，添加 DEEPSEEK_API_KEY
npm run start
```

### 2. 前端
```
cd frontend
npm install
npm run dev
```

## 主要功能
- 用户上传照片生成童年照
- 输入梦想，AI生成专属称号
- 分配勋章，生成专属海报
- 一键保存/分享，带公众号二维码

## 依赖
- 后端：express, multer, axios, cors, dotenv, typescript, ts-node
- 前端：vue3, vite, html2canvas

## 环境变量
- 后端需配置 `.env` 文件，内容如下：
```
DEEPSEEK_API_KEY=你的DeepSeek API Key
``` 