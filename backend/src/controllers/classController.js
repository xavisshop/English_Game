const Class = require('../models/Class');
const User = require('../models/User');
const logger = require('../utils/logger');

// Get all classes
exports.getClasses = async (req, res, next) => {
  try {
    let classes;
    
    // If user is teacher, get classes they created
    if (req.user.role === 'teacher') {
      classes = await Class.find({ teacherId: req.user.id }).populate('studentIds', 'username');
    } else {
      // If user is student, get classes they belong to
      classes = await Class.find({ studentIds: req.user.id });
    }
    
    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes,
    });
  } catch (error) {
    logger.error('Get classes error:', error);
    next(error);
  }
};

// Get single class
exports.getClassById = async (req, res, next) => {
  try {
    const classObj = await Class.findById(req.params.id)
      .populate('teacherId', 'username')
      .populate('studentIds', 'username')
      .populate('wordBookId', 'title');
    
    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: '班级未找到',
      });
    }
    
    // Check if user has permission to view this class
    if (req.user.role === 'student' && !classObj.studentIds.some(student => student._id.toString() === req.user.id)) {
      return res.status(403).json({
        success: false,
        message: '权限不足',
      });
    }
    
    res.status(200).json({
      success: true,
      data: classObj,
    });
  } catch (error) {
    logger.error('Get class error:', error);
    next(error);
  }
};

// Create new class
exports.createClass = async (req, res, next) => {
  try {
    const classObj = await Class.create({
      ...req.body,
      teacherId: req.user.id,
    });
    
    res.status(201).json({
      success: true,
      data: classObj,
    });
  } catch (error) {
    logger.error('Create class error:', error);
    next(error);
  }
};

// Update class
exports.updateClass = async (req, res, next) => {
  try {
    let classObj = await Class.findById(req.params.id);
    
    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: '班级未找到',
      });
    }
    
    // Check if user is the teacher of this class
    if (classObj.teacherId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '权限不足',
      });
    }
    
    classObj = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    
    res.status(200).json({
      success: true,
      data: classObj,
    });
  } catch (error) {
    logger.error('Update class error:', error);
    next(error);
  }
};

// Delete class
exports.deleteClass = async (req, res, next) => {
  try {
    const classObj = await Class.findById(req.params.id);
    
    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: '班级未找到',
      });
    }
    
    // Check if user is the teacher of this class
    if (classObj.teacherId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '权限不足',
      });
    }
    
    await classObj.remove();
    
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    logger.error('Delete class error:', error);
    next(error);
  }
};

// Add student to class
exports.addStudentToClass = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    const classObj = await Class.findById(req.params.id);
    
    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: '班级未找到',
      });
    }
    
    // Check if user is the teacher of this class
    if (classObj.teacherId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '权限不足',
      });
    }
    
    // Check if student exists and is not already in class
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(400).json({
        success: false,
        message: '学生不存在',
      });
    }
    
    if (classObj.studentIds.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: '学生已在班级中',
      });
    }
    
    classObj.studentIds.push(studentId);
    await classObj.save();
    
    res.status(200).json({
      success: true,
      data: classObj,
    });
  } catch (error) {
    logger.error('Add student to class error:', error);
    next(error);
  }
};

// Remove student from class
exports.removeStudentFromClass = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const classObj = await Class.findById(req.params.id);
    
    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: '班级未找到',
      });
    }
    
    // Check if user is the teacher of this class
    if (classObj.teacherId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '权限不足',
      });
    }
    
    // Check if student is in class
    if (!classObj.studentIds.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: '学生不在班级中',
      });
    }
    
    classObj.studentIds = classObj.studentIds.filter(id => id.toString() !== studentId);
    await classObj.save();
    
    res.status(200).json({
      success: true,
      data: classObj,
    });
  } catch (error) {
    logger.error('Remove student from class error:', error);
    next(error);
  }
};