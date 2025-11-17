const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getWords,
  getWordById,
  createWord,
  updateWord,
  deleteWord,
  importWords,
} = require('../controllers/wordController');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getWords)
  .post(protect, authorize('teacher'), createWord);

router.route('/import')
  .post(protect, authorize('teacher'), importWords);

router.route('/:id')
  .get(getWordById)
  .put(protect, authorize('teacher'), updateWord)
  .delete(protect, authorize('teacher'), deleteWord);

module.exports = router;