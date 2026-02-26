const supabase = require('../supabaseClient');

// @desc    Mark attendance
// @route   POST /api/attendance/mark
exports.markAttendance = async (req, res) => {
    const { studentId, subject, status, date } = req.body;

    if (!supabase) {
        return res.status(503).json({ message: 'Database connection not initialized.' });
    }

    try {
        // Validate student exists
        const { data: student, error: studentError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', studentId)
            .single();

        if (studentError || !student || student.role !== 'student') {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Insert attendance record
        const { data: attendance, error } = await supabase
            .from('attendance')
            .insert([
                {
                    student_id: studentId,
                    faculty_id: req.user.id,
                    subject,
                    status,
                    date: date || new Date().toISOString().split('T')[0]
                }
            ])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ message: 'Attendance marked successfully', attendance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get student's attendance history
// @route   GET /api/attendance/my-history
exports.getMyAttendance = async (req, res) => {
    if (!supabase) {
        return res.json([]);
    }

    try {
        const { data: history, error } = await supabase
            .from('attendance')
            .select(`
                *,
                faculty:profiles!attendance_faculty_id_fkey(name)
            `)
            .eq('student_id', req.user.id)
            .order('date', { ascending: false });

        if (error) throw error;
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all attendance records for a class (Faculty view)
// @route   GET /api/attendance/all
exports.getAllAttendance = async (req, res) => {
    if (!supabase) {
        return res.json([]);
    }

    try {
        const { data: history, error } = await supabase
            .from('attendance')
            .select(`
                *,
                student:profiles!attendance_student_id_fkey(name, username)
            `)
            .eq('faculty_id', req.user.id)
            .order('date', { ascending: false });

        if (error) throw error;
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
