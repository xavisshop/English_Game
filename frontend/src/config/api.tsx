// API配置文件
const API_CONFIG = {
  // 在Render部署后，将此URL替换为实际的后端URL
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
};

export default API_CONFIG;