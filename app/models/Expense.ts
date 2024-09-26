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
ExpenseSchema.statics.getCategoryRemainingAmounts = async function(userId: string) {
    console.log('Starting getCategoryRemainingAmounts for user:', userId);

    // Fetch all categories to create a name-to-id mapping
    const categories = await Category.find({});
    const categoryNameToIdMap = new Map(
        categories.map(cat => [cat.name, cat._id.toString()])
    );

    console.log('Fetched categories:', categories.length);

    const incomes = await Income.find({ user_id: userId });
    const expenses = await Expense.find({ user_id: userId });

    console.log('Fetched incomes:', incomes.length);
    console.log('Fetched expenses:', expenses.length);

    const categoryMap = new Map();

    // Process incomes
    incomes.forEach(income => {
        income.categories.forEach((cat: { category: { toString: () => string }, targetAmount: number }) => {
            const categoryId = cat.category.toString();
            if (!categoryMap.has(categoryId)) {
                categoryMap.set(categoryId, { targetAmount: 0, spentAmount: 0 });
            }
            categoryMap.get(categoryId).targetAmount += cat.targetAmount;
        });
    });

    // Process expenses
    expenses.forEach(expense => {
        const categoryId = categoryNameToIdMap.get(expense.category);
        if (categoryId) {
            if (!categoryMap.has(categoryId)) {
                categoryMap.set(categoryId, { targetAmount: 0, spentAmount: 0 });
            }
            categoryMap.get(categoryId).spentAmount += expense.amount;
        } else {
            console.warn(`Category not found for expense: ${expense.category}`);
        }
    });

    // Calculate remaining amounts
    const results = Array.from(categoryMap.entries()).map(([categoryId, data]) => {
        const category = categories.find(cat => cat._id.toString() === categoryId);
        return {
            category: category ? category.name : 'Unknown',
            categoryId: categoryId,
            targetAmount: data.targetAmount,
            remainingAmount: Math.max(0, data.targetAmount - data.spentAmount)
        };
    });

    console.log('Calculated results:', results);

    return results;
};

export const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);

