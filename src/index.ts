import { Hono } from "hono";
import { HttpsProxyAgent } from "https-proxy-agent";
import { cors } from "hono/cors";
import * as https from "node:https";
import dotenv from "dotenv";

dotenv.config();

const {
  PROXY_CUSTOMER,
  PROXY_SESSION_ID,
  PROXY_PASSWORD,
  PROXY_HOST,
  PROXY_PORT,
} = process.env;

if (
  !PROXY_CUSTOMER ||
  !PROXY_SESSION_ID ||
  !PROXY_PASSWORD ||
  !PROXY_HOST ||
  !PROXY_PORT
) {
  throw new Error(
    "Missing required environment variables for proxy configuration"
  );
}

const app = new Hono();

app.use(cors());

const generateRandomValue = () => {
  return Math.floor(Math.random() * 90000) + 10000;
};

const generateProxyUrl = (useRandomValue = true) => {
  const sessionId = useRandomValue
    ? `${PROXY_SESSION_ID}_${generateRandomValue()}`
    : `${PROXY_SESSION_ID}_10000`;

  return `https://${PROXY_CUSTOMER}-sessid-${sessionId}:${PROXY_PASSWORD}@${PROXY_HOST}:${PROXY_PORT}`;
};

const proxyUrl = generateProxyUrl(true);

const proxyAgent = new HttpsProxyAgent(proxyUrl, {
  rejectUnauthorized: false,
});

const handleProxyRequest = async (c) => {
  const fullUrl = c.req.url;
  const apiUrlIndex = fullUrl.indexOf("apiUrl=");

  if (apiUrlIndex === -1) {
    return c.json({ error: "API URL is required" }, 400);
  }

  const apiUrl = decodeURIComponent(fullUrl.slice(apiUrlIndex + 7));

  try {
    console.log(`Fetching: ${apiUrl}`);

    return new Promise((resolve, reject) => {
      const request = https.get(apiUrl, { agent: proxyAgent }, async (res) => {
        let response = "";

        res.on("data", (chunk) => {
          response += chunk;
        });

        res.on("end", () => {
          try {
            const parsedData = JSON.parse(response);
            resolve(c.json(parsedData));
          } catch (e) {
            console.error("JSON parsing error:", e.message);
            reject(c.json({ error: "Invalid JSON response" }, 500));
          }
        });
      });

      request.on("error", (error) => {
        console.error("Request error:", error);
        reject(c.json({ error: "Request failed" }, 500));
      });

      request.end();
    }).catch((error) => {
      return error;
    });
  } catch (error) {
    console.error("Proxy fetch failed:", error);
    return c.json({ error: "Proxy request failed" }, 500);
  }
};

app.all("/", (c) => c.json({ message: "Hello, World!" }));
app.all("/proxy", handleProxyRequest);

export default app;
