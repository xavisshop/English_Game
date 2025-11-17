const errorHandler = (err, req, res, next) => {
  // Log error
  console.error(err.stack);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(404).json({ message: '资源未找到' });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(400).json({ message: '数据重复' });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: '数据验证失败', errors });
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'token无效' });
  }

  // JWT expired
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'token已过期' });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    message: err.message || '服务器内部错误',
  });
};

module.exports = { errorHandler };