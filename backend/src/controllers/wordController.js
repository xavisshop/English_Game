const Word = require('../models/Word');
const logger = require('../utils/logger');

// Get all words
exports.getWords = async (req, res, next) => {
  try {
    const words = await Word.find({ wordBookId: req.params.wordBookId });
    
    res.status(200).json({
      success: true,
      count: words.length,
      data: words,
    });
  } catch (error) {
    logger.error('Get words error:', error);
    next(error);
  }
};

// Get single word
exports.getWordById = async (req, res, next) => {
  try {
    const word = await Word.findById(req.params.id);
    
    if (!word) {
      return res.status(404).json({
        success: false,
        message: '单词未找到',
      });
    }
    
    res.status(200).json({
      success: true,
      data: word,
    });
  } catch (error) {
    logger.error('Get word error:', error);
    next(error);
  }
};

// Create new word
exports.createWord = async (req, res, next) => {
  try {
    const word = await Word.create(req.body);
    
    res.status(201).json({
      success: true,
      data: word,
    });
  } catch (error) {
    logger.error('Create word error:', error);
    next(error);
  }
};

// Update word
exports.updateWord = async (req, res, next) => {
  try {
    const word = await Word.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    
    if (!word) {
      return res.status(404).json({
        success: false,
        message: '单词未找到',
      });
    }
    
    res.status(200).json({
      success: true,
      data: word,
    });
  } catch (error) {
    logger.error('Update word error:', error);
    next(error);
  }
};

// Delete word
exports.deleteWord = async (req, res, next) => {
  try {
    const word = await Word.findByIdAndDelete(req.params.id);
    
    if (!word) {
      return res.status(404).json({
        success: false,
        message: '单词未找到',
      });
    }
    
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    logger.error('Delete word error:', error);
    next(error);
  }
};

// Import words from CSV or JSON
exports.importWords = async (req, res, next) => {
  try {
    // This is a simplified implementation
    // In a real application, you would parse the uploaded file
    const words = req.body.words || [];
    
    // Add wordBookId to each word
    const wordsWithBookId = words.map(word => ({
      ...word,
      wordBookId: req.params.wordBookId,
    }));
    
    // Insert words
    const insertedWords = await Word.insertMany(wordsWithBookId);
    
    res.status(201).json({
      success: true,
      count: insertedWords.length,
      data: insertedWords,
    });
  } catch (error) {
    logger.error('Import words error:', error);
    next(error);
  }
};