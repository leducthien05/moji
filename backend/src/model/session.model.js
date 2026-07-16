import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        refreshToken: {
            type: String,
            required: true
        },
        expriresAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);
// Tự động xóa khi hết hạn
sessionSchema.index({ expriresAt: 1 }, { expireAfterSeconds: 0 });

const Session = mongoose.model("Session", sessionSchema);
export default Session;