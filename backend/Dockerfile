# 使用官方 Node 镜像
FROM node:18

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制所有后端代码
COPY . .

# 构建 TypeScript 代码
RUN npm run build

# 暴露 80 端口
EXPOSE 80

# 启动服务
CMD ["node", "dist/index.js"]