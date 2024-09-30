import express from 'express';
import helmet from 'helmet';
import roleApi from './routes/roles.js';
import authApi from './routes/auth.js';

const app = express();
app.use(helmet());

app.use('/api/auth',authApi);
app.use('/api/roles',roleApi);

app.listen(3000,()=>console.log("It's running on port:3000"));
