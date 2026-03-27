const express = require('express');
const router = express.Router();

const { createReport, updateReportStatus } = require('../controllers/report.controller');
const { allReport, getReportById } = require('../controllers/getReport');

const { getMunicipalityStats, getTopContributors } = require('../controllers/leaderboard');

router.post('/create', createReport);
router.get('/all', allReport);
router.get('/stats/municipalities', getMunicipalityStats);
router.get('/stats/contributors', getTopContributors);
router.patch('/status/:id', updateReportStatus);
router.get('/:id', getReportById);

module.exports = router;