import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next";

export const aj = arcjet({
  key: process.env.ARCJET_KEY!, 
  rules: [
     shield({ mode: "LIVE" }),
       detectBot({
      mode: "LIVE", 
      allow: [
        "CATEGORY:SEARCH_ENGINE" ],
    }),
      tokenBucket({
      mode: "LIVE",
        refillRate: 5, // Refill 5 tokens per interval
      interval: 86400, // Refill every 10 seconds
      capacity: 5, // Bucket capacity of 10 tokens
    }),
  ],
});
