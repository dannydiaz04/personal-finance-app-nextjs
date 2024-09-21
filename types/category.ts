import { Types } from 'mongoose';

export interface SubCategory {
    _id: Types.ObjectId;
    name: string;
}

export interface Category {
    _id: Types.ObjectId;
    name: string;
    userId: Types.ObjectId;
    subCategories: SubCategory[];
    target: number;
}