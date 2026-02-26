const express = require('express');
const router = express.Router();
const { markAttendance, getMyAttendance, getAllAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.post('/mark', protect, authorize('faculty'), markAttendance);
router.get('/my-history', protect, authorize('student'), getMyAttendance);
router.get('/all', protect, authorize('faculty'), getAllAttendance);

module.exports = router;
