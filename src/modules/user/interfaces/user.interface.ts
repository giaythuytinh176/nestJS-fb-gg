import { Document } from 'mongoose';

export class IUser extends Document {
  // _id: object;
  // __v: number;
  method: string;
  local: {
    email: string;
    salt: string;
    hashedPassword: string;
  };
  facebook: {
    id: string;
    email: string;
    displayName: string;
    token: string;
  };
  google: {
    id: string;
    email: string;
    displayName: string;
    token: string;
  };
}
