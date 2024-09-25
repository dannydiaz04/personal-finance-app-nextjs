import mongoose from 'mongoose';
import { Category } from './Category';

interface ICategoryTarget {
    category: mongoose.Schema.Types.ObjectId;
    targetAmount: number;
    remainingAmount: number; // Add this line
}

interface IIncome {
    user_id: mongoose.Schema.Types.ObjectId;
    amount: number;
    description: string;
    date: Date;
    categoryTargets: ICategoryTarget[];
}


const IncomeSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: { 
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    categories: [{
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        },
        targetAmount: {
            type: Number,
            required: true
        },
        remainingAmount: { // Add this field
            type: Number,
            required: true
        }
    }]
}, {
    timestamps: true 
});

// Pre-save hook to calculate and set targetAmounts
IncomeSchema.pre('save', async function (next) {
    if (this.isModified('amount') || this.isNew) {
        const categories = await Category.find({ userId: this.user_id });
        this.categories = categories.map(category => ({
            category: category._id,
            targetAmount: this.amount * (category.target / 100),
            remainingAmount: this.amount * (category.target / 100) // Initialize remainingAmount
        })) as any; // Type assertion to bypass type check
    }
    next();
});

export const Income = mongoose.models.Income || mongoose.model<IIncome>('Income', IncomeSchema);