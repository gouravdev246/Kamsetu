const express = require('express');
const router = express.Router();

const createReport = require('../controllers/report.controller');
const { allReport, getReportById } = require('../controllers/getReport');

router.post('/create', createReport);
router.get('/all', allReport);
router.get('/:id', getReportById);

module.exports = router;