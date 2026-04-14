import { Schema, model } from 'mongoose';

export type TMealSuggestionUsage = {
    user: Schema.Types.ObjectId;
    dayKey: string;
    count: number;
    createdAt?: Date;
    updatedAt?: Date;
};

const mealSuggestionUsageSchema = new Schema<TMealSuggestionUsage>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        dayKey: { type: String, required: true, index: true },
        count: { type: Number, required: true, default: 0 },
    },
    { timestamps: true, versionKey: false },
);

mealSuggestionUsageSchema.index({ user: 1, dayKey: 1 }, { unique: true });

export const MealSuggestionUsage = model<TMealSuggestionUsage>(
    'MealSuggestionUsage',
    mealSuggestionUsageSchema,
);
