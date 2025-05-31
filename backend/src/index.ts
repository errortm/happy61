import 'dotenv/config';
import express from 'express';
// @ts-ignore
import cors from 'cors';
import uploadRouter from './routes/upload';
import path from 'path';

const app = express();
const port = Number(process.env.PORT) || 80;

app.use(cors());
app.use(express.json());
app.use('/api/upload', uploadRouter);
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

app.get('/', (req, res) => {
  res.send('童年照+梦想+AI称号+勋章后端已启动');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend running at http://0.0.0.0:${port}`);
}); 