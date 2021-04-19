import { Document } from 'mongoose';

export interface IUser extends Document {
  method: string;
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
