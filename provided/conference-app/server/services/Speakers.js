const { default: axios } = require("axios");

class SpeakersService {
    constructor({ serviceRegistryUrl, serviceVersionIdentifier }) {
        this.serviceRegistryUrl = serviceRegistryUrl;
        this.serviceVersionIdentifier = serviceVersionIdentifier;
    }

    async getImage(path) {
        const { ip, port } = await this.getService("speakers-service");
        return this.callService({
            method: "get",
            responseType: "stream",
            url: `http://${ip}:${port}/images/${path}`
        });
    }

    async getNames() {
        const { ip, port } = await this.getService("speakers-service");
        return this.callService({
            method: "get",
            url: `http://${ip}:${port}/names`
        });
    }

    async getListShort() {
        const { ip, port } = await this.getService("speakers-service");
        return this.callService({
            method: "get",
            url: `http://${ip}:${port}/list-short`
        });
    }

    async getList() {
        const { ip, port } = await this.getService("speakers-service");
        return this.callService({
            method: "get",
            url: `http://${ip}:${port}/list`
        });
    }

    async getAllArtwork() {
        const { ip, port } = await this.getService("speakers-service");
        return this.callService({
            method: "get",
            url: `http://${ip}:${port}/artwork`
        });
    }

    async getSpeaker(shortname) {
        const { ip, port } = await this.getService("speakers-service");
        return this.callService({
            method: "get",
            url: `http://${ip}:${port}/speaker/${shortname}`
        });
    }

    async getArtworkForSpeaker(shortname) {
        const { ip, port } = await this.getService("speakers-service");
        return this.callService({
            method: "get",
            url: `http://${ip}:${port}/artwork/${shortname}`
        });
    }

    async getData() {
        const data = await readFile(this.datafile, "utf8");
        if (!data) return [];
        return JSON.parse(data).speakers;
    }

    async callService(requestOptions) {
        const response = await axios(requestOptions);

        return response.data;
    }

    async getService(servicename) {
        console.log(this.serviceRegistryUrl);
        const response = await axios.get(
            `http://localhost:3000/find/${servicename}/1`
        );

        return response.data;
    }
}

module.exports = SpeakersService;
