import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required.'],
        trim: true,
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Please provide a name.'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email.'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address.',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password.'],
        minlength: [6, 'Password must be at least 6 characters long.'],
    },
    memberSince: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
