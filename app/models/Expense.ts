import mongoose from 'mongoose';
import { Income } from './Income';
import { Category } from './Category';

const ExpenseSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subcategory: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
}, { 
    timestamps: true 
});

// Add this method to the schema
ExpenseSchema.methods.updateRemainingAmounts = async function() {
    const latestIncome = await Income.findOne({ user_id: this.user_id }).sort({ date: -1 });
    
    if (latestIncome) {
        const categoryIndex = latestIncome.categories.findIndex(
            cat => cat.category.toString() === this.category
        );

        if (categoryIndex !== -1) {
            latestIncome.categories[categoryIndex].remainingAmount -= this.amount;
            await latestIncome.save();
        }
    }
};

// Add a post-save hook to call the new method
// ExpenseSchema.post('save', async function() {
//     await this.updateRemainingAmounts();
// });

// Add a static method to get category remaining amounts
ExpenseSchema.statics.getCategoryRemainingAmounts = async function(userId: mongoose.Types.ObjectId) {
    const latestIncome = await Income.findOne({ user_id: userId }).sort({ date: -1 });
    if (!latestIncome) return [];

    const categories = await Category.find({ userId });
    const expenses = await this.aggregate([
        { $match: { user_id: userId } },
        { $group: {
            _id: "$category",
            totalAmount: { $sum: "$amount" }
        }}
    ]);

    return categories.map(category => {
        const incomeCategory = latestIncome.categories.find(
            cat => cat.category.toString() === category._id.toString()
        );
        const expense = expenses.find(exp => exp._id === category.name);
        const remainingAmount = incomeCategory ? 
            incomeCategory.remainingAmount - (expense ? expense.totalAmount : 0) : 
            0;

        return {
            category: category.name,
            remainingAmount,
            targetAmount: incomeCategory ? incomeCategory.targetAmount : 0
        };
    });
};

export const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);

