# 英语背单词网站系统架构设计

## 1. 整体架构

采用前后端分离架构：
- 前端：React应用，负责用户界面展示和交互
- 后端：Node.js + Express.js API服务，提供RESTful接口
- 数据库：MongoDB，存储用户信息、词书、单词、学习记录等数据
- 部署：Nginx反向代理，支持传统服务器部署

```
┌─────────────┐    HTTP    ┌──────────────┐    REST API    ┌──────────────┐
│   用户浏览器  │ ──────────▶ │    Nginx     │ ─────────────▶ │  Node.js     │
└─────────────┘             └──────────────┘                │  (Express)   │
                                                             └──────────────┘
                                                                      │
                                                                      ▼
                                                              ┌──────────────┐
                                                              │   MongoDB    │
                                                              └──────────────┘
```

## 2. 后端技术栈

### 2.1 核心技术
- **编程语言**：Node.js (JavaScript/TypeScript)
- **Web框架**：Express.js
- **数据库**：MongoDB (使用Mongoose作为ODM)
- **用户认证**：JWT (JSON Web Tokens)

### 2.2 功能模块相关技术
- **词书爬取**：Puppeteer + Cheerio
- **数据验证**：Joi
- **日志记录**：Winston
- **文件处理**：Multer (用于单词批量导入)
- **定时任务**：Node-cron (用于定期更新词书)

### 2.3 开发工具
- **代码质量**：ESLint + Prettier
- **测试框架**：Jest + Supertest
- **API文档**：Swagger

## 3. 前端技术栈

### 3.1 核心技术
- **框架**：React (使用Create React App)
- **状态管理**：Redux Toolkit
- **UI库**：Ant Design
- **样式**：Styled Components
- **路由**：React Router v6

### 3.2 功能实现相关技术
- **图表库**：Chart.js (用于学习进度可视化)
- **动画库**：Framer Motion (用于界面交互动画)
- **HTTP客户端**：Axios
- **表单处理**：Formik + Yup

### 3.3 开发工具
- **代码质量**：ESLint + Prettier
- **测试框架**：Jest + React Testing Library
- **构建工具**：Webpack (Create React App内置)

## 4. 数据库设计

### 4.1 主要数据集合

#### Users (用户表)
- _id: ObjectId
- username: String (唯一)
- password: String (加密存储)
- role: String (teacher/student)
- email: String
- createdAt: Date
- updatedAt: Date

#### Classes (班级表)
- _id: ObjectId
- name: String
- teacherId: ObjectId (关联Users)
- studentIds: [ObjectId] (关联Users)
- wordBookId: ObjectId (关联WordBooks)
- createdAt: Date
- updatedAt: Date

#### WordBooks (词书表)
- _id: ObjectId
- title: String
- description: String
- source: String (词书来源)
- wordCount: Number
- createdAt: Date
- updatedAt: Date

#### Words (单词表)
- _id: ObjectId
- wordBookId: ObjectId (关联WordBooks)
- word: String
- phonetic: String (音标)
- pronunciation: String (发音音频URL)
- definition: String (中文释义)
- example: String (例句)
- image: String (图片URL)
- createdAt: Date
- updatedAt: Date

#### LearningRecords (学习记录表)
- _id: ObjectId
- userId: ObjectId (关联Users)
- wordId: ObjectId (关联Words)
- familiarity: Number (熟悉度 0-5)
- lastReviewed: Date (上次复习时间)
- nextReview: Date (下次复习时间)
- createdAt: Date
- updatedAt: Date

#### GameRecords (游戏记录表)
- _id: ObjectId
- userId: ObjectId (关联Users)
- gameId: String (游戏ID)
- score: Number (得分)
- duration: Number (游戏时长)
- wordsCount: Number (单词数量)
- createdAt: Date

## 5. API设计

### 5.1 认证相关
- POST /api/auth/register - 用户注册（首次部署时创建教师账户）
- POST /api/auth/login - 用户登录
- GET /api/auth/profile - 获取用户信息
- POST /api/auth/refresh - 刷新JWT token

### 5.2 用户管理
- GET /api/users - 获取用户列表（教师权限）
- GET /api/users/:id - 获取用户详情
- PUT /api/users/:id - 更新用户信息
- DELETE /api/users/:id - 删除用户（教师权限）

### 5.3 班级管理
- GET /api/classes - 获取班级列表
- GET /api/classes/:id - 获取班级详情
- POST /api/classes - 创建班级（教师权限）
- PUT /api/classes/:id - 更新班级信息（教师权限）
- DELETE /api/classes/:id - 删除班级（教师权限）
- POST /api/classes/:id/students - 添加学生到班级（教师权限）
- DELETE /api/classes/:id/students/:studentId - 从班级移除学生（教师权限）

### 5.4 词书管理
- GET /api/wordbooks - 获取词书列表
- GET /api/wordbooks/:id - 获取词书详情
- POST /api/wordbooks - 创建词书（教师权限）
- PUT /api/wordbooks/:id - 更新词书（教师权限）
- DELETE /api/wordbooks/:id - 删除词书（教师权限）
- POST /api/wordbooks/crawl - 爬取词书（教师权限）
- POST /api/wordbooks/:id/words/import - 批量导入单词（教师权限）

### 5.5 单词管理
- GET /api/words - 获取单词列表
- GET /api/words/:id - 获取单词详情
- POST /api/words - 创建单词（教师权限）
- PUT /api/words/:id - 更新单词（教师权限）
- DELETE /api/words/:id - 删除单词（教师权限）

### 5.6 学习记录管理
- GET /api/learning-records - 获取学习记录列表
- GET /api/learning-records/:id - 获取学习记录详情
- POST /api/learning-records - 创建学习记录
- PUT /api/learning-records/:id - 更新学习记录

### 5.7 游戏记录管理
- GET /api/game-records - 获取游戏记录列表
- GET /api/game-records/:id - 获取游戏记录详情
- POST /api/game-records - 创建游戏记录

## 6. 安全性考虑

- 使用HTTPS加密传输
- JWT Token过期时间和刷新机制
- 密码使用bcrypt加密存储
- 输入验证和 sanitization (使用Joi)
- CORS配置限制跨域请求
- 速率限制防止API滥用
- 敏感信息环境变量配置

## 7. 性能优化

- 数据库索引优化
- API响应缓存 (Redis)
- 静态资源压缩和缓存 (Nginx)
- 图片懒加载和WebP格式
- 代码分割和懒加载 (React)
- 服务端渲染(SSR)或静态站点生成(SSG)优化首屏加载

## 8. 部署方案

### 8.1 服务器要求
- Node.js >= 16.x
- MongoDB >= 4.x
- Nginx >= 1.18.x

### 8.2 部署流程
1. 克隆代码到服务器
2. 安装依赖：npm install
3. 配置环境变量
4. 启动MongoDB服务
5. 构建前端应用：npm run build
6. 启动后端服务：npm start
7. 配置Nginx反向代理

### 8.3 环境变量配置
- PORT: 服务端口
- MONGODB_URI: MongoDB连接字符串
- JWT_SECRET: JWT密钥
- JWT_EXPIRES_IN: JWT过期时间
- PUPPETEER_EXECUTABLE_PATH: Puppeteer浏览器路径（可选）