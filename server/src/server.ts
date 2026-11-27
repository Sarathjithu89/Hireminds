import express, { type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/api/v1/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    service: "hireminds-server",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

const server = app.listen(port, () => {
  console.log(`Server running on port:${port}`);
});

//shutdown (for Docker)
const shutdown = (signal: string) => {
  console.log(`${signal} received, Closing HTTP server...`);
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
