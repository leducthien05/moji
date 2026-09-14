import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: String,
    displayName: {
        type: String,
        required: true,
        trim: true
    },
    avatarUrl: {
        type: String
    },
    avatarId: {
        type: String
    },
    bio: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        sparse: true // có thể null nhưng không được trùng 
    }   
},
{
    timestamps: true
});     

const User = mongoose.model("User", userSchema, "user");
export default User;