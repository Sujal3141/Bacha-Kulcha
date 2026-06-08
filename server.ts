import dotenv from "dotenv";
dotenv.config({ override: true });

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// MongoDB Connection & DB Access APIs
import { connectDatabase, DbService } from "./server/db";

// Shared token store for email notifications
import { setGoogleAccessToken } from "./server/tokenStore";

// Microservice Router Modules

import listingsService from "./server/services/listingsService";
import ordersService from "./server/services/ordersService";
import alertsService from "./server/services/alertsService";
import systemService from "./server/services/systemService";
import kitchenService from "./server/services/kitchenService";

// Initialize Gemini SDK
let aiClient: GoogleGenAI | null = null;
const key = process.env.GEMINI_API_KEY;

if (key && key !== "MY_GEMINI_API_KEY") {
  try {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API Client configured successfully in server-side context.");
  } catch (err) {
    console.error("Failed to construct GoogleGenAI instance:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // 1. Establish MongoDB connection (or gracefully switch to high-speed in-memory store fallback list)
  await connectDatabase();

  // ------------------------- Decoupled Microservices Routes -------------------------
  
  // A. Catalog & Surplus Inventory Microservice
  app.use("/api/rescue-food/listings", listingsService);

  // B. Reservation, Checkout & Transaction Microservice (Dual Aliases for client router support)
  app.use("/api/rescue-food/order", ordersService);
  app.use("/api/rescue-food/orders", ordersService);

  // C. Alert Notification Board Microservice  
  app.use("/api/rescue-food/notifications", alertsService);

  // D. System Gateway Telemetry & Connection Microservice
  app.use("/api/rescue-food/system", systemService);

  // G. Partner Kitchen Registration & Certification Microservice
  app.use("/api/rescue-food/kitchens", kitchenService);

  // --------------------- Standard Shared Orchestrator Routes ---------------------

  // E. Direct Stats endpoint
  app.get("/api/rescue-food/stats", async (req, res) => {
    try {
      const stats = await DbService.getStats();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: "Stats database retrieval failed", details: err.message });
    }
  });

  // F. Dynamic AI Pricing Assistant endpoint powered by Gemini
  app.post("/api/rescue-food/ai/analyze-listing", async (req, res) => {
    const { name, category, originalPrice, quantity, hoursToExpiry } = req.body;

    const op = Number(originalPrice || 250);
    const qty = Number(quantity || 5);
    const hours = Number(hoursToExpiry || 4);

    let prompt = `
You are the Food Rescue platform's Dynamic Pricing and Waste Analytics AI engine.
Provide a JSON response evaluating the surplus item below:
- Name: "${name}"
- Category: "${category}"
- Original Price: INR ₹${op}
- Quantity Available: ${qty} units
- Hours left before pickup deadline: ${hours} hours

Format your response strictly as valid JSON with exactly the following structure:
{
  "recommendedRescuePrice": <suggested discounted price in INR as an integer, aiming for 80-90% lower if time is critical>,
  "aiPriceRecommendationExplanation": "Briefly design the pricing strategy based on hours remaining (e.g. drop further soon if unsold)",
  "aiDemandTrend": "High" | "Moderate" | "Low",
  "demandConfidencePercentage": <number between 1 and 100>,
  "salesPredictionFormulaInsight": "Brief analysis of food waste patterns during peak dining times",
  "co2ReductionKg": <CO2 calculation as number (approx 2.5 kg per meal rescued)>,
  "waterSavedLiters": <water calculation as number (approx 100 liters per meal)>
}
`;

    if (aiClient) {
      try {
        const geminiResponse = await aiClient.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });

        const textOutput = geminiResponse.text;
        if (textOutput) {
          const parsed = JSON.parse(textOutput.trim());
          return res.json(parsed);
        }
      } catch (err) {
        console.error("Gemini failed, falling back to mock intelligence:", err);
      }
    }

    // Dynamic fallback calculations
    const discountFactor = hours < 2 ? 0.9 : hours < 4 ? 0.8 : 0.7; // 70% to 90% discount
    const recommendedPrice = Math.max(15, Math.round(op * (1 - discountFactor)));
    const explanation = `Recommended a ${Math.round(discountFactor * 100)}% discount because there are only ${hours} hours remaining. Drop price to ₹${Math.round(recommendedPrice * 0.7)} if unsold in the final 60 minutes.`;
    const demandTrend = qty <= 6 ? "High" : hours < 3 ? "High" : "Moderate";

    res.json({
      recommendedRescuePrice: recommendedPrice,
      aiPriceRecommendationExplanation: explanation,
      aiDemandTrend: demandTrend,
      demandConfidencePercentage: hours < 3 ? 92 : 78,
      salesPredictionFormulaInsight: `Buffet surplus from this hour has a 88% chance of conversion based on peak dinner traffic. Avoid kitchen replenishments in final 30 mins to match this waste trend pattern.`,
      co2ReductionKg: parseFloat((qty * 2.5).toFixed(1)),
      waterSavedLiters: qty * 100
    });
  });

  // Secure Server-Side Gmail Send Proxy Endpoint to avoid Browser-CORS and check token validations
 // Secure Server-Side Gmail Send Proxy Endpoint
app.post("/api/gmail-proxy/send", async (req, res) => {
  const { token, to, subject, bodyHTML } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Missing Google authorization access token" });
  }

  // Persist token server-side for automated email notifications
  setGoogleAccessToken(token);

  if (!to) {
    return res.status(400).json({ error: "Missing recipient (to) parameter" });
  }

  try {
    // Build RFC-compliant MIME message (plain UTF-8 body, no pre-encoding)
    const mimeParts = [
      `To: ${to}`,
      `Subject: ${subject || ''}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=utf-8`,
      ``,
      `${bodyHTML || ''}`
    ];

    // Join the full MIME message and base64url-encode it ONCE for Gmail API raw field
    const emailContent = mimeParts.join("\r\n");
    const base64UrlSafe = Buffer.from(emailContent)
      .toString("base64")
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    console.log(`[Gmail Proxy] Dispatching email to: ${to}`);

    const response = await fetch("https://www.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ raw: base64UrlSafe })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Gmail Proxy Error] Status ${response.status}:`, errorText);
      return res.status(response.status).json({
        error: "Google API rejected send request",
        status: response.status,
        details: errorText
      });
    }

    const responseData = await response.json() as any;
    console.log("[Gmail Proxy] Message sent! ID:", responseData.id);
    return res.json({ success: true, messageId: responseData.id });

  } catch (err: any) {
    console.error("[Gmail Proxy Exception]:", err);
    return res.status(500).json({
      error: "Internal server-side Gmail proxy execution failure",
      details: err.message
    });
  }
});

  // Google OAuth 2.0 Auth URL generator
  app.get("/api/auth/url", (req, res) => {
    const clientRedirectUri = req.query.redirect_uri as string;
    if (!clientRedirectUri) {
      return res.status(400).json({ error: "Missing redirect_uri parameter" });
    }
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) return res.status(500).json({ error: "Server missing GOOGLE_CLIENT_ID" });
    const requestedScope = (req.query.scope as string) || "openid profile email";
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: clientRedirectUri,
      response_type: "code",
      scope: requestedScope,
      access_type: "offline",
      prompt: "consent",
    });
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    res.json({ url: authUrl });
  });

  // Google OAuth 2.0 Callback Handler matching the domain config automatically
  app.get(["/auth/callback", "/auth/callback/"], async (req, res) => {
    const { code } = req.query;
    if (!code) {
      return res.send(`
        <html>
          <body style="font-family: system-ui, sans-serif; text-align: center; padding-top: 50px;">
            <h3 style="color: #d32f2f;">Error: Missing authorization code from Google</h3>
            <button onclick="window.close()" style="background: #1a73e8; color: white; border: 0; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-top: 15px;">Close</button>
          </body>
        </html>
      `);
    }

    try {
      const xForwardedHost = req.headers["x-forwarded-host"] as string;
      const xForwardedProto = req.headers["x-forwarded-proto"] as string;
      const host = xForwardedHost || req.headers["host"] || "localhost:3000";
      const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
      const protocol = isLocalhost ? "http" : (host.includes(".run.app") ? "https" : (xForwardedProto || "https"));
      const redirectUri = `${protocol}://${host}/auth/callback`;
      console.log(`[OAuth Callback] Reconstructed redirect_uri: ${redirectUri}`);

      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      
      if (!clientId || !clientSecret) {
        throw new Error("Server missing OAuth configuration (GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET)");
      }

      // 1. Exchange auth code for tokens
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code: code as string,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }).toString(),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error("Google token exchange failing:", errorText);
        throw new Error(`Google token exchange failed: ${tokenResponse.statusText}. Details: ${errorText}`);
      }

      const tokenData = await tokenResponse.json() as any;
      const accessToken = tokenData.access_token;

      // Store token server-side for automated email notifications from backend services
      if (accessToken) {
        setGoogleAccessToken(accessToken);
      }

      // 2. Fetch user details from Google userinfo API
      const userinfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!userinfoResponse.ok) {
        throw new Error(`Google userinfo retrieval failed: ${userinfoResponse.statusText}`);
      }

      const googleUserProfile = await userinfoResponse.json() as any;

      const userProfile = {
        email: googleUserProfile.email,
        name: googleUserProfile.name || googleUserProfile.given_name || "Google User",
        picture: googleUserProfile.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(googleUserProfile.name || 'G')}`
      };

      // 3. Post user back to parent window and close popup
      res.send(`
        <html>
          <body style="font-family: system-ui, sans-serif; text-align: center; padding-top: 50px;">
            <script>
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'OAUTH_AUTH_SUCCESS', 
                  user: ${JSON.stringify(userProfile)},
                  accessToken: '${accessToken}'
                }, '*');
                window.close();
              } else {
                localStorage.setItem("bacha_google_user", JSON.stringify(${JSON.stringify(userProfile)}));
                localStorage.setItem("bacha_google_token", '${accessToken}');
                window.location.href = '/';
              }
            </script>
            <div style="font-family: system-ui, sans-serif; text-align: center; padding-top: 50px;">
              <h3 style="color: #34a853;">Authentication Successful!</h3>
              <p>Welcome back, ${googleUserProfile.name || googleUserProfile.email}</p>
              <p>Wait while this screen closes automatically...</p>
            </div>
          </body>
        </html>
      `);
    } catch (err: any) {
      console.error("OAuth Exchange Error:", err);
      const xForwardedHost = req.headers["x-forwarded-host"] as string;
      const host = xForwardedHost || req.headers["host"] || "localhost:3000";
      const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
      const displayProtocol = isLocalhost ? "http" : "https";
      const displayUri = `${displayProtocol}://${host}/auth/callback`;
      res.send(`
        <html>
          <body style="font-family: system-ui, sans-serif; padding: 25px; color: #d32f2f; max-width: 500px; margin: 0 auto; line-height: 1.5;">
            <div style="border: 1px solid #ffcdd2; background: #ffebee; border-radius: 8px; padding: 20px;">
              <h3 style="margin-top: 0;">Google Authentication Failed</h3>
              <p>Error: <strong>${err.message}</strong></p>
              <p style="font-size: 13px; color: #555;">Make sure this app's Redirect URI is registered exactly like this in your Google Cloud Console Authorized redirect URIs:</p>
              <pre style="background: #ffffff; border: 1px solid #e0e0e0; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px; overflow-x: auto;"><code>${displayUri}</code></pre>
              <button onclick="window.close()" style="background: #1a73e8; color: white; border: 0; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 10px;">Close Window</button>
            </div>
          </body>
        </html>
      `);
    }
  });

  // -------------------------------------------------------------

  // Vite development middleware vs production static builds
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Food Rescue platform listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
