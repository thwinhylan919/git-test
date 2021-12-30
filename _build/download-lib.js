const https = require("https");
const fs = require("fs-extra");
const HttpsAgent = require("https-proxy-agent");
const execSync = require("child_process").execSync;


const files = [
    "3rdparty/require/text", "default/js/ojL10n",
    "3rdparty/require-css/css", "3rdparty/require-css/css-builder",
    "3rdparty/require-css/normalize", "3rdparty/require/require"
]

const getCDNPath = resource => `https://static.oracle.com/cdn/jet/v7.3.0/${resource}.js`;

const getOutFile = file => `./tmp/${file.split("/").pop().split(".").shift()}.js`;

const knockoutUrl = "https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.2/knockout-min.js";

const downloadResource = (url, options, destination) => new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    https.get(url, options, response => {
        response.pipe(file);
        file.on("finish", () => {
            file.close(() => {
                resolve();
            });
        });
    }).on("error", reject);
});

(async() => {
    let proxy;
    await fs.emptyDir("./tmp/");
    try {
        proxy = execSync("npm config get proxy", {
            timeout: 2000
        });
    } catch (err) {
        console.error("Couldn't fetch proxy via npm, falling back to https_proxy/http_proxy");
    }

    proxy = (proxy && proxy.toString() && proxy.toString().trim() !== "null" && proxy.toString().trim()) || process.env.https_proxy || process.env.http_proxy || process.env.HTTP_PROXY || process.env.HTTPS_PROXY;

    console.log("Using proxy", proxy);

    const options = proxy ? {
        agent: new HttpsAgent(proxy)
    } : {};

    try {
        await Promise.all(files.map(file => downloadResource(getCDNPath(file), options, getOutFile(file))).concat(downloadResource(knockoutUrl, options, getOutFile(knockoutUrl))));
    } catch (error) {
        console.error("Could not download the required libraries", error.toString());
        process.exit(1);
    }

    console.log("Downloaded libraries successfully!")
})();