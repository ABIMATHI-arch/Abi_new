const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all students
// @route   GET /api/users/students
// @access  Private/Faculty
router.get('/students', protect, authorize('faculty'), async (req, res) => {
    if (!supabase) {
        return res.json([]);
    }

    try {
        const { data: students, error } = await supabase
            .from('profiles')
            .select('id, name, username')
            .eq('role', 'student');

        if (error) throw error;

        // Map id to _id for frontend compatibility if needed, or keep it as id
        const formattedStudents = students.map(s => ({
            ...s,
            _id: s.id // Maintain compatibility with frontend script looking for ._id
        }));

        res.json(formattedStudents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
