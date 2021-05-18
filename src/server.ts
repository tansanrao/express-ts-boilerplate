import * as express from "express";
import config from "./config/config";
import { IndexRoutes } from "./routes/index.routes";
import LoggerUtil from "./utils/logger.util"
import * as expressWinston from "express-winston";

class App {
  public app: express.Application;
  private indexRoutes = new IndexRoutes()
  private logger = new LoggerUtil().logger

  constructor() {
    this.app = express();
    this.config();
    this.indexRoutes.route(this.app);
  }
  private config(): void {
    // support application/json type post data
    this.app.use(express.json());
    //support application/x-www-form-urlencoded post data
    this.app.use(express.urlencoded({ extended: false }));
    // import logger
    this.app.use(expressWinston.logger({
      winstonInstance: this.logger,
      ignoreRoute: function (req, res) {
        return req.url === '/healthz';
      }
    }))
  }
}

const app = new App().app;
const logger = new LoggerUtil().logger

app.listen(config.port, () => {
  logger.info("Express server listening on port " + config.port);
});

export default app;
