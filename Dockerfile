FROM node:18-alpine

# 设置工作目录
WORKDIR /usr/src/fastify-server

# 复制依赖文件并安装依赖
COPY package*.json ./

# 安装 pnpm 全局
RUN npm install -g pnpm

RUN pnpm install

# 复制应用代码到工作目录
COPY . .

# 设置环境变量
ENV NODE_ENV=docker
ENV NODE_LOCAL=default



# 暴露 Fastify 应用将侦听的端口
EXPOSE 3000

# 定义启动命令
CMD ["node","server.js"]
