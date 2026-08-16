import "dotenv/config";
import dns from "node:dns";
import express, { type Express } from "express";
// import router from "./routes/api.ts";

// import db from "./utils/database.ts";
// import docs from "./docs/route.ts";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.ts";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const allowedOrigins = (process.env.CORS_ORIGIN || process.env.BETTER_AUTH_TRUSTED_ORIGINS)
  ? (process.env.CORS_ORIGIN || process.env.BETTER_AUTH_TRUSTED_ORIGINS)!.split(",").map((o) => o.trim())
  : ["http://localhost:3000", "http://127.0.0.1:3000"];

async function init() {
  try {
    // const result = await db();
    // console.log("databe status", result);

    const app: Express = express();
    app.use(
      cors({
        origin: allowedOrigins,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
      })
    );
    const port = Number(process.env.PORT) || 3001;
    app.all("/api/auth/*splat", toNodeHandler(auth));
    app.get("/", (req, res) => {
      res.status(200).json({
        message: "tk backend running",
      });
    });

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    // app.use("/api", router);
    // docs(app);
    app.listen(port, () => {
      console.log(`Example app listening on port di ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
