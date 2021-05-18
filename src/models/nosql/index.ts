import CONFIG from "../../config/config"
import LoggerUtil from "../../utils/logger.util";
import {connect, Connection, connection, set} from "mongoose";

declare interface IModels {
}

const logger = new LoggerUtil().logger

export class NoSqlORM {
    private static instance: NoSqlORM;
    private _db: Connection;
    private _models: IModels;

    private constructor() {
        set('debug', function (collectionName: string, methodName: string, ...methodArgs: any[]) {
            logger.info(`mongoose: ${collectionName}.${methodName}(${methodArgs[0]}`)
        })
        let mongo_location: string;
        if (CONFIG.nosql_user && CONFIG.nosql_pass) {
            mongo_location =
                "mongodb://" +
                CONFIG.nosql_user +
                ":" +
                CONFIG.nosql_pass +
                "@" +
                CONFIG.nosql_host +
                ":" +
                CONFIG.nosql_port +
                "/" +
                CONFIG.nosql_name +
                "?authSource=admin";
        } else {
            mongo_location =
                "mongodb://" +
                CONFIG.nosql_host +
                ":" +
                CONFIG.nosql_port +
                "/" +
                CONFIG.nosql_name;
        }
        connect(mongo_location, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }).catch((err) => {
            console.log("*** Can Not Connect to Mongo Server" + err);
        });

        this._db = connection;
        this._db.on('open', this.connected);
        this._db.on('error', this.error);

        this._models = {
            // this is where we initialise all models
        }
    }

    public static get Models() {
        if (!NoSqlORM.instance) {
            NoSqlORM.instance = new NoSqlORM();
        }
        return NoSqlORM.instance._models;
    }

    public static get Db() {
        if (!NoSqlORM.instance) {
            NoSqlORM.instance = new NoSqlORM();
        }
        return NoSqlORM.instance._db;
    }

    private connected() {
        console.log('Connected to MongoDB');
    }

    private error(error: Error) {
        console.log('Cannot connect to MongoDB', error);
    }
}
