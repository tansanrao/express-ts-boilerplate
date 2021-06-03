import KeycloakConnect = require("keycloak-connect");
import {Keycloak} from "keycloak-connect";
import {MemoryStore} from "express-session";
import LoggerUtil from "../utils/logger.util";
import config from "../config/config";

const logger = new LoggerUtil().logger

export class KeycloakService {
    private static instance: KeycloakService
    private keycloak: Keycloak;
    private readonly memoryStore: MemoryStore;

    constructor() {
        logger.info('Initializing Keycloak...');
        this.memoryStore = new MemoryStore();
        this.keycloak = new KeycloakConnect(
            {store: this.memoryStore},
            config.keycloakConfig
        );
    }

    public static get Keycloak(): Keycloak {
        if (!KeycloakService.instance) {
            KeycloakService.instance = new KeycloakService()
        }
        return KeycloakService.instance.keycloak
    }

    public static get MemoryStore(): MemoryStore {
        if (!KeycloakService.instance) {
            KeycloakService.instance = new KeycloakService()
        }
        return KeycloakService.instance.memoryStore
    }
}
