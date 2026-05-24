const { createTag, getTags, updateTag, deleteTag } = require('../controller/tagController');

const router = require('express').Router();

router.post('/create', createTag);
router.post('/get', getTags);
router.post('/update', updateTag);
router.post('/delete', deleteTag);

module.exports = router;
             