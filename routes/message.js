const express = require('express');
// to access params from the parent router
const router = express.Router({ mergeParams: true });
const { createMessage, getMessage, deleteMessage } = require('../services/messages');

// routes
router.post('/', createMessage);
router.get('/:message_id', getMessage);
router.delete('/:message_id', deleteMessage);

module.exports = router;