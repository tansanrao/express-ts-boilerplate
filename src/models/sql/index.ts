import LoggerUtil from "../../utils/logger.util";
import {Sequelize} from "sequelize";
import config from "../../config/config";

const logger = new LoggerUtil().logger

const logFunction = (message: string) => {
    logger.info("sequelize: " + message)
}
const sequelize = new Sequelize(
    config.sql_name,
    config.sql_user,
    config.sql_pass,
    {
        host: config.sql_host,
        port: config.sql_port,
        dialect: "mysql",
        logging: logFunction
    }
)
let ModelArray = [
]

const sqlModels = {
}

sequelize.sync({force: false}).then(() => {
    logger.info("sequelize:Database Sync Success")
}).catch(err => {
    logger.error("sequelize:Database Sync Failed");
    logger.error(err);
})

export {
    sequelize as sqlDatabase,
    sqlModels
}
