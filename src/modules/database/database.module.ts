import { Module } from '@nestjs/common';
import { MongoClient, Db, Logger } from 'mongodb';
import { DATABASE_CONNECTION } from '../../server.constants';

@Module({
    providers: [
        {
            provide: DATABASE_CONNECTION,
            useFactory: async (): Promise<Db> => {
                try {
                    Logger.setLevel('debug');

                    const client = await MongoClient.connect('mongodb+srv://dbTamLe:OvWBDHb1L59JmQAa@cluster0-tamle.lzjkq.mongodb.net/user?authSource=admin&replicaSet=atlas-14kagn-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true', {
                        useUnifiedTopology: true,
                    });

                    const db = client.db('user');

                    await db.collection('users_mongodb').createIndex({ "local.email": 1 }, { unique: true, sparse: true });
                    await db.collection('users_mongodb').createIndex({ "facebook.email": 1 }, { unique: true, sparse: true });
                    await db.collection('users_mongodb').createIndex({ "google.email": 1 }, { unique: true, sparse: true });

                    return db;
                } catch (e) {
                    throw e;
                }
            }
        },
    ],
    exports: [DATABASE_CONNECTION],
})
export class DatabaseModule { }
