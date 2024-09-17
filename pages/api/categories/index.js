import dbConnect from "../../../lib/dbConnect";
import Category from "../../../models/Category";
import auth from "../../../middleware/auth";

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    switch(method) {
        case 'GET':
            try {
                await auth(req, res);
                const categories = await Category.find({ user: req.user.id }).lean();
                const categoriesWithSubcategories = categories.map(category => ({
                    ...category,
                    subcategories: category.subcategories || []
                }));
                res.status(200).json(categoriesWithSubcategories);
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
            break;
        
        case 'POST':
            try {
                await auth(req, res);
                const newCategory = new Category({
                    name: req.body.name,
                    subcategories: [],
                    user: req.user.id
                });
                const category = await newCategory.save();
                res.status(201).json(category)
            } catch (error) {
                res.status(500).json({ message: "Server error" });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} not allowed`)
    }
}