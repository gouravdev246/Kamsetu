const express = require('express');
const router = express.Router();

const { createReport, updateReportStatus, toggleUpvote } = require('../controllers/report.controller');
const { allReport, getReportById, getGlobalStats, getReportsByUser } = require('../controllers/getReport');

const { getMunicipalityStats, getTopContributors } = require('../controllers/leaderboard');

router.post('/create', createReport);
router.get('/all', allReport);
router.get('/stats/municipalities', getMunicipalityStats);
router.get('/stats/contributors', getTopContributors);
router.patch('/status/:id', updateReportStatus);
router.patch('/:id/upvote', toggleUpvote);
router.get('/global-stats', getGlobalStats);
router.get('/user/:userId', getReportsByUser);
router.get('/:id', getReportById);

module.exports = router;