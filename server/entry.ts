import 'dotenv/config';
import express from 'express';
import routes from './routes';
import { initializeDatabase } from './db';

async function main() {
  await initializeDatabase(); // <-- critical: run before using db
  const app = express();
  app.use(express.json());

  app.use(routes);

  // Basic error handler
  app.use((err: any, _req: express.Request, res: express.Response, _next: any) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: err?.message ?? 'Internal Server Error' });
  });

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => console.log(`API listening on :${port}`));
}

main().catch((e) => {
  console.error('Fatal startup error:', e);
  process.exit(1);
});
