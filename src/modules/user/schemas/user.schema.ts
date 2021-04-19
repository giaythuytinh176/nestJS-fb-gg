import { Schema } from 'mongoose';

export const UserSchema: Schema = new Schema({
  method: {
    type: String,
    enum: ['local', 'facebook', 'google'],
    required: true,
  },
  local: {
    email: { type: String, lowercase: true, unique: true, sparse: true },
    salt: String,
    hashedPassword: String,
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
