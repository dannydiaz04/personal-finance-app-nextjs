import dbConnect from '../../../../lib/dbConnect';
import Category from '../../../../models/Category';
import auth from '../../../../middleware/auth';

export default async function handler(req, res) {
    const { categoryId } = req.query;
    const { method } = req;

    await dbConnect();
    
    switch (method) {
        case 'POST':
            try {
                await auth(req, res);
                const category = await Category.findOne({ _id: categoryId, user: req.user.id });
                if (!category) return res.status(404).json({ message: "Category not found" });

                if (!category.subcategories) {
                    category.subcategories = [];
                }
                const newSubCategory = {
                    name: req.body.name
                };
                category.subcategories.push(newSubCategory);
                await category.save();
                res.status(201).json(newSubCategory);
            } catch (error) {
                res.status(500).json({ message: "Server error" });
            }
            break;

        case 'DELETE':
            try {
                await auth(req, res);
                const { subcategoryId } = req.query;
                const category = await Category.findOne({ _id: categoryId, user: req.user.id });
                if (!category) return res.status(404).json({ message: "Category not found" });

                const subcategoryIndex = category.subcategories.findIndex(
                    subcategory => subcategory._id.toString() === subcategoryId
                );
                if (subcategoryIndex === -1) return res.status(404).json({ message: "Subcategory not found" });

                category.subcategories.splice(subcategoryIndex, 1);
                await category.save();
                res.status(200).json({ message: "Subcategry deleted successfully" });

            } catch (error) {
                res.status(500).json({ message: "Server error" });
            }
            break;

        default:
            res.setHeader('Allow', ['POST', 'DELETE']);
            res.status(405).end(`Method ${method} not allowed`);
    }
}
