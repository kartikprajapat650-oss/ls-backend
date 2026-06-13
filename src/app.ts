import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import permissionRoutes from './routes/permissions';
import contentRoutes from './routes/content';
import logRoutes from './routes/logs';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 80,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/logs', logRoutes);
app.use(errorHandler);

export default app;
