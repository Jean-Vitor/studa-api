import express from 'express';
import { PORT } from './constants/enviroment';
import routes from './routes';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
