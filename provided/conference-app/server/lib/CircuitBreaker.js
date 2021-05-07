const axios = require("axios");

class CircuitBreaker {
    constructor() {
        this.states = {};
        this.failureThreshold = 5;
        this.cooldownPeriod = 10;
        this.requestTimeout = 1;
    }

    async callService(requestOptions) {
        const endPoint = `${requestOptions.method}:${requestOptions.url}`;

        if (!this.canRequest(endPoint)) return false;

        requestOptions.timeout = this.requestTimeout * 1000;

        try {
            const response = await axios(requestOptions);

            this.onSuccess(endPoint);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    onSuccess(endPoint) {
        this.initState(endPoint);
    }

    onFailure(endPoint) {
        const state = this.states[endPoint];
        state.failures += 1;
        if (state.failures > this.failureThreshold) {
            state.circuit = "OPEN";
            state.nextTry = new Date() / 1000 + this.cooldownPeriod;
            console.log(`ALERT! Circuit for ${endPoint} is in state OPEN`);
        }
    }

    canRequest(endPoint) {
        if (!this.states[endPoint]) this.initState(endPoint);
        const state = this.state[endPoint];

        if (state.circuit === "CLOSED") return true;

        const now = new Date() / 1000;

        if (state.nextTry <= now) {
            state.circuit = "HALF";
            return true;
        }
        return false;
    }

    initState(endPoint) {
        this.states[endPoint] = {
            failures: 0,
            cooldownPeriod: this.cooldownPeriod,
            circuit: "CLOSED",
            nextTry: 0
        };
    }
}

module.exports = CircuitBreaker;
