const crypto = require("crypto-js");
const axios = require('axios');

const signRequest = (request, apiSecret) => {
  const { id, method, params, nonce } = request;

  const paramsString =
    params == null
      ? ""
      : Object.keys(params)
          .sort()
          .reduce((a, b) => {
            return a + b + params[b];
          }, "");

  const sigPayload = method + id + request.api_key + paramsString + nonce;
  console.log(sigPayload)

  request.sig = crypto
    .HmacSHA256(sigPayload, apiSecret)
    .toString(crypto.enc.Hex);

  return request;
};

const apiKey = process.env.API_KEY; /* User API Key */
const apiSecret = process.env.API_SECRET; /* User API Secret */

let request = {
  id: 11,
  method: "private/get-deposit-address",
  api_key: apiKey,
  params: {
    currency: "BTC"
  },
  nonce: new Date().getTime(),
};

const client = axios.create({
  baseURL: "https://uat-api.3ona.co/v2/",
  headers: {
    "Content-Type": "application/json",
  }
});
async function main() {
  const requestBody = signRequest(request, apiKey, apiSecret);
  console.log(request, requestBody)
  const response = await client.post(request.method, requestBody)
  console.log(response);
}

main().catch((err) => console.error(err.response.data, err.response.config));
