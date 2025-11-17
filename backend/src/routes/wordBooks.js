const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  crawlWordBook,
  getWordBooks,
  getWordBookById,
  createWordBook,
  updateWordBook,
  deleteWordBook,
} = require('../controllers/wordBookController');

const router = express.Router();

router.route('/')
  .get(getWordBooks)
  .post(protect, authorize('teacher'), createWordBook);

router.route('/crawl')
  .post(protect, authorize('teacher'), crawlWordBook);

router.route('/:id')
  .get(getWordBookById)
  .put(protect, authorize('teacher'), updateWordBook)
  .delete(protect, authorize('teacher'), deleteWordBook);

module.exports = router;