const supabase = require('./supabaseClient');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const users = [
    {
        name: 'Demo Faculty',
        username: 'faculty',
        password: 'password123',
        role: 'faculty'
    },
    {
        name: 'Demo Student',
        username: 'student',
        password: 'password123',
        role: 'student'
    }
];

const seedDB = async () => {
    try {
        console.log('Seeding Supabase Database...');

        if (!supabase) {
            console.error('❌ Supabase not initialized. Check your credentials in .env');
            process.exit(1);
        }

        for (const user of users) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);

            const { error } = await supabase
                .from('profiles')
                .upsert([
                    { ...user, password: hashedPassword }
                ], { onConflict: 'username' });

            if (error) {
                console.error(`Error seeding user ${user.username}:`, error.message);
            } else {
                console.log(`User ${user.username} seeded/updated.`);
            }
        }

        console.log('Database Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
