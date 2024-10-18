import express from 'express';
import helmet  from 'helmet';
import roleApi from './routes/roles.js';
import authApi from './routes/auth.js';
import userApi from './routes/users.js'; 
import cors from 'cors';
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/neuronplus/api/auth',authApi);
app.use('/neuronplus/api/roles',roleApi);
app.use('/neuronplus/api/users',userApi);

app.listen(8000,()=>console.log("It's running on port:8000"));
   