import * as dotenv from "dotenv";
import * as fs from "fs";
import * as keycloakConfig from "./keycloak.json";
import {KeycloakConfig} from "keycloak-connect";

interface ServerConfig {
  port: number;
  sql_name: string;
  sql_user: string;
  sql_pass: string;
  sql_host: string;
  sql_port: number;
  nosql_name: string;
  nosql_user: string;
  nosql_pass: string;
  nosql_host: string;
  nosql_port: number;
  //  Keycloak
  sessionSecret: string;
  keycloakConfig: KeycloakConfig
}

// use different env file when running with vault sidecar
if (fs.existsSync('/vault/secrets/envvars')) {
  const envLoad = dotenv.config({path: '/vault/secrets/envvars'})
  if (envLoad.error) {
    throw envLoad.error
  }
} else {
  const envLoad = dotenv.config()
  if (envLoad.error) {
    throw envLoad.error
  }
}


const config: ServerConfig = {
  port: normalizePort(process.env.port || 3000),
  sql_user: process.env.SQL_USER || "devuser",
  sql_pass: process.env.SQL_PASS || "devpassword",
  sql_name: process.env.SQL_NAME || "pmplerp_items",
  sql_host: process.env.SQL_HOST || "mysql",
  sql_port: normalizePort(process.env.SQL_PORT || 3306),
  nosql_user: process.env.NOSQL_USER || "devuser",
  nosql_pass: process.env.NOSQL_PASS || "devpassword",
  nosql_name: process.env.NOSQL_NAME || "pmplerp_items",
  nosql_host: process.env.NOSQL_HOST || "mysql",
  nosql_port: normalizePort(process.env.NOSQL_PORT || 27017),
  // keycloak
  sessionSecret: process.env.SESSION_SECRET || "some secret",
  keycloakConfig: keycloakConfig
};

function normalizePort(val: string | number) {
  const port = parseInt(<string>val, 10);

  if (port >= 0) {
    // port number
    return port;
  }

  throw new Error("Port number Invalid")
}
export default config;
