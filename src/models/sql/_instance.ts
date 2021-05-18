import {Sequelize} from 'sequelize'
import config from "../../config/config"
import LoggerUtil from "../../utils/logger.util";

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

const db = {
    sequelize,
    Sequelize,
}

export default db
