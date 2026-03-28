const express = require('express');
const router = express.Router();

const { getAllContacts, seedContacts, createContact, updateContact, deleteContact } = require('../controllers/contact.controller');
const verifyAdmin = require('../middleware/verifyAdmin');

router.get('/all', getAllContacts);
router.post('/seed', seedContacts);

// Protected Admin Routes
router.post('/create', verifyAdmin, createContact);
router.patch('/:id', verifyAdmin, updateContact);
router.delete('/:id', verifyAdmin, deleteContact);

module.exports = router;
