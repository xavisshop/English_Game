# 英语单词学习应用部署指南

## 系统要求

- Node.js >= 16.x
- MongoDB >= 4.x
- npm 或 yarn

## 部署步骤

### 1. 克隆代码

```bash
git clone <repository-url>
cd english_word_app
```

### 2. 安装后端依赖

```bash
cd backend
npm install
```

### 3. 配置环境变量

在 `backend/.env` 文件中配置以下环境变量：

```env
# 服务器端口
PORT=5000

# MongoDB连接字符串
MONGODB_URI=mongodb://localhost:27017/english-word-app

# JWT密钥（生产环境请使用强密码）
JWT_SECRET=your_strong_secret_key

# JWT过期时间
JWT_EXPIRES_IN=7d
```

### 4. 安装前端依赖

```bash
cd ../frontend
npm install
```

### 5. 构建前端应用

```bash
npm run build
```

### 6. 启动应用

```bash
# 在根目录下
npm start
```

或者分别启动前后端：

```bash
# 启动后端
cd backend
npm start

# 启动前端
cd ../frontend
npm start
```

## 首次访问设置

1. 启动应用后，访问 `http://localhost:3000`
2. 系统会自动检测是否已创建教师账户
3. 如果是首次访问，会引导您创建教师账户
4. 创建教师账户后，您可以开始创建词书、班级和添加学生

## 生产环境部署

### 使用 PM2 部署（推荐）

1. 安装 PM2：
```bash
npm install -g pm2
```

2. 构建前端应用：
```bash
cd frontend
npm run build
```

3. 使用 PM2 启动后端：
```bash
cd ../backend
pm2 start src/index.js --name english-word-app
```

4. 配置 Nginx 反向代理：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/english_word_app/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 目录结构

```
english_word_app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── config/
│   │   └── index.js
│   ├── .env
│   ├── .gitignore
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── .gitignore
│   └── package.json
├── package.json
└── README.md
```

## 功能说明

### 用户角色

1. **教师用户**
   - 创建和管理词书
   - 创建和管理班级
   - 为班级分配词书
   - 查看学生学习进度

2. **学生用户**
   - 学习教师分配的词书
   - 参与单词游戏
   - 查看个人学习进度

### 核心功能

1. **词书管理**
   - 自动爬取词书
   - 手动创建词书
   - 单词录入和管理
   - 批量导入单词

2. **班级管理**
   - 创建和管理班级
   - 添加和移除学生
   - 为班级分配词书

3. **单词游戏**
   - 多种游戏模式
   - 闯关模式
   - 学习进度跟踪

4. **学习系统**
   - 单词卡片学习
   - 进度可视化
   - 复习提醒

## 技术栈

### 后端
- Node.js + Express.js
- MongoDB + Mongoose
- JWT 认证
- Puppeteer (词书爬取)
- Winston (日志记录)

### 前端
- React + TypeScript
- Ant Design
- Styled Components
- Redux Toolkit
- React Router

## 故障排除

### 常见问题

1. **MongoDB连接失败**
   - 检查MongoDB服务是否启动
   - 检查 `.env` 文件中的 `MONGODB_URI` 配置

2. **端口被占用**
   - 修改 `.env` 文件中的 `PORT` 配置
   - 或停止占用端口的进程

3. **前端页面空白**
   - 检查后端API是否正常运行
   - 检查浏览器控制台错误信息

### 日志查看

后端日志文件位于 `backend/logs/` 目录：
- `error.log` - 错误日志
- `combined.log` - 综合日志

## 安全建议

1. 生产环境务必使用强密码和密钥
2. 配置HTTPS证书
3. 定期备份数据库
4. 限制服务器访问权限
5. 定期更新依赖包