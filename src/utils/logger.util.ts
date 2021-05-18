import * as winston from "winston";

export default class LoggerUtil {
    public logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
            new winston.transports.Console()
        ]
    })
    constructor() {
    }
}
