import { expect, test, describe } from "bun:test";
import app from "./src/index.ts";

describe("test server", () => {
  test("test ip", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
  });

  test("test proxy 1", async () => {
    const apiUrl = "https://api.dexscreener.com/latest/dex/search?q=sol";
    const res = await app.request(`/proxy?apiUrl=${apiUrl}`);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toBeDefined();
  });

  test("test proxy 2", async () => {
    const apiUrl =
      "https://www.binance.com/bapi/apex/v1/public/apex/cms/article/list/query?type=1&pageSize=20&pageNo=1&catalogId=48";
    const res = await app.request(`/proxy?apiUrl=${apiUrl}`);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toBeDefined();
  });

  test("test proxy 3", async () => {
    const apiUrl =
      "https://gmgn.ai/defi/quotation/v1/rank/tron/swaps/6h?orderby=swaps&direction=desc&filters[]=not_honeypot&filters[]=verified&filters[]=renounced";
    const res = await app.request(`/proxy?apiUrl=${apiUrl}`);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toBeDefined();
  });
});
