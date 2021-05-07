class CircuitBreaker {
    constructor() {
        this.states = {};
        this.failureThreshold = 5;
        this.cooldownPeriod = 10;
        this.requestTimeout = 1;
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
        const state = this.state[endPoint];

        if (state.circuit === "CLOSED") return true;

        const now = new Date() / 1000;

        if (state.nextTry <= now) {
            state.circuit = "HALF";
        }
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
