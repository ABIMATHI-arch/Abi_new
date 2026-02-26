const supabase = require('../supabaseClient');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    const { name, username, password, role } = req.body;

    if (!supabase) {
        return res.status(503).json({ message: 'Database connection not initialized.' });
    }

    try {
        // Check if user exists
        const { data: existingUser } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username)
            .single();

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert into Supabase
        const { data: newUser, error } = await supabase
            .from('profiles')
            .insert([
                { name, username, password: hashedPassword, role }
            ])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            _id: newUser.id,
            name: newUser.name,
            username: newUser.username,
            role: newUser.role,
            token: generateToken(newUser.id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!supabase) {
        return res.status(503).json({ message: 'Database connection not initialized. Please check your .env configuration.' });
    }

    try {
        let { data: user, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !user) {
            // AUTO-REGISTRATION: If user doesn't exist, create them
            const { role, name } = req.body;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const { data: newUser, error: createError } = await supabase
                .from('profiles')
                .insert([
                    {
                        name: name || username,
                        username,
                        password: hashedPassword,
                        role: role || 'student'
                    }
                ])
                .select()
                .single();

            if (createError) {
                console.error('❌ Supabase Create Error:', createError);
                let userMessage = 'New user creation failed.';
                if (createError.message.includes('row-level security')) {
                    userMessage = 'Database Permission Error: Please apply the RLS policies in Supabase SQL Editor.';
                }
                return res.status(401).json({
                    message: userMessage,
                    details: createError.message
                });
            }

            user = newUser;
        } else {
            // Check password for existing user
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
        }

        res.json({
            _id: user.id,
            name: user.name,
            username: user.username,
            role: user.role,
            token: generateToken(user.id)
        });
    } catch (error) {
        console.error('❌ Auth Controller Error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const { data: user, error } = await supabase
            .from('profiles')
            .select('id, name, username, role')
            .eq('id', req.user.id)
            .single();

        if (error || !user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
