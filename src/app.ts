import express, { Express } from 'express';
import playRoutes from './routes/play';
import simRoutes from './routes/sim';
import rtpRoutes from './routes/rtp';
import walletRouter from './routes/wallet';

const app: Express = express();
app.use(express.json());

// Routes
app.use('/play', playRoutes);
app.use('/sim', simRoutes);
app.use('/rtp', rtpRoutes);
app.use('/wallet', walletRouter);

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


export default app;
