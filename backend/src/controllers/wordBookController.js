const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const WordBook = require('../models/WordBook');
const Word = require('../models/Word');
const logger = require('../utils/logger');

// Crawl word book from a website
exports.crawlWordBook = async (req, res, next) => {
  try {
    const { url, selector } = req.body;
    
    // Launch puppeteer browser
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Get page content
    const content = await page.content();
    await browser.close();
    
    // Parse content with cheerio
    const $ = cheerio.load(content);
    
    // Extract word book information (this is a simplified example)
    const title = $('h1').first().text() || 'Unknown Word Book';
    const description = $('meta[name="description"]').attr('content') || '';
    
    // Create word book
    const wordBook = await WordBook.create({
      title,
      description,
      source: url,
    });
    
    // Extract words (this is a simplified example)
    // In a real implementation, you would parse the specific structure of the website
    const words = [];
    $(selector || '.word-entry').each((i, elem) => {
      const word = $(elem).find('.word').text();
      const phonetic = $(elem).find('.phonetic').text();
      const definition = $(elem).find('.definition').text();
      
      if (word) {
        words.push({
          wordBookId: wordBook._id,
          word,
          phonetic,
          definition,
        });
      }
    });
    
    // Save words to database
    if (words.length > 0) {
      await Word.insertMany(words);
      wordBook.wordCount = words.length;
      await wordBook.save();
    }
    
    res.status(201).json({
      success: true,
      data: wordBook,
    });
  } catch (error) {
    logger.error('Crawl word book error:', error);
    next(error);
  }
};

// Get all word books
exports.getWordBooks = async (req, res, next) => {
  try {
    const wordBooks = await WordBook.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: wordBooks.length,
      data: wordBooks,
    });
  } catch (error) {
    logger.error('Get word books error:', error);
    next(error);
  }
};

// Get single word book
exports.getWordBookById = async (req, res, next) => {
  try {
    const wordBook = await WordBook.findById(req.params.id);
    
    if (!wordBook) {
      return res.status(404).json({
        success: false,
        message: '词书未找到',
      });
    }
    
    res.status(200).json({
      success: true,
      data: wordBook,
    });
  } catch (error) {
    logger.error('Get word book error:', error);
    next(error);
  }
};

// Create new word book
exports.createWordBook = async (req, res, next) => {
  try {
    const wordBook = await WordBook.create(req.body);
    
    res.status(201).json({
      success: true,
      data: wordBook,
    });
  } catch (error) {
    logger.error('Create word book error:', error);
    next(error);
  }
};

// Update word book
exports.updateWordBook = async (req, res, next) => {
  try {
    const wordBook = await WordBook.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    
    if (!wordBook) {
      return res.status(404).json({
        success: false,
        message: '词书未找到',
      });
    }
    
    res.status(200).json({
      success: true,
      data: wordBook,
    });
  } catch (error) {
    logger.error('Update word book error:', error);
    next(error);
  }
};

// Delete word book
exports.deleteWordBook = async (req, res, next) => {
  try {
    const wordBook = await WordBook.findByIdAndDelete(req.params.id);
    
    if (!wordBook) {
      return res.status(404).json({
        success: false,
        message: '词书未找到',
      });
    }
    
    // Also delete all words in this word book
    await Word.deleteMany({ wordBookId: wordBook._id });
    
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    logger.error('Delete word book error:', error);
    next(error);
  }
};