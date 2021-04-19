import { Schema } from 'mongoose';

export const UserSchema: Schema = new Schema({
  method: {
    type: String,
    enum: ['facebook', 'google'],
    required: true,
  },
  facebook: {
    id: String,
    email: String,
    displayName: String,
    token: String,
  },
  google: {
    id: String,
    email: String,
    displayName: String,
    token: String,
  },
});
