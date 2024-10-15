import { model, Schema } from 'mongoose';

const contactSchema = new Schema(
  {
    userId: {
      type: Schema.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
    },
    photo: { type: String },
  },
  { timestamps: true },
);

export const contactModel = model('contacts', contactSchema);
