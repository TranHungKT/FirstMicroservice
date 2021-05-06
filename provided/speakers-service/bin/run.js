#!/usr/bin/env node

const http = require("http");
const axios = require("axios");

const config = require("../config")[process.env.NODE_ENV || "development"];

const log = config.log();
const service = require("../server/service")(config);

const server = http.createServer(service);

// Important - a service should not have a fixed port but should randomly choose one
server.listen(0);

server.on("listening", () => {
    const registerService = () =>
        axios.put(
            `http://localhost:3000/register/${config.name}/${config.version}/${
                server.address().port
            }`
        );

    const unRegisterService = () =>
        axios.delete(
            `http://localhost:3000/register/${config.name}/${config.version}/${
                server.address().port
            }`
        );

    const interval = setInterval(() => registerService(), 20000);

    cleanUp = async () => {
        clearInterval(interval);
        await unRegisterService();
    };

    log.info(
        `Hi there! I'm listening on port ${
            server.address().port
        } in ${service.get("env")} mode.`
    );

    process.on("uncaughtException", async () => {
        await cleanUp();
        process.exit(0);
    });

    process.on("SIGINT", async () => {
        await cleanUp();
        process.exit(0);
    });
    process.on("SIGTERM", async () => {
        await cleanUp();
        process.exit(0);
    });
});
