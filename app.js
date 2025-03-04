import express from 'express';
import helmet  from 'helmet';
import roleApi from './routes/roles.js';
import authApi from './routes/auth.js';
import userApi from './routes/users.js'; 
import catApi from './routes/categoeries.js';
import packageApi from './routes/packageHeader.js';
import teachApi from './routes/teaching.js';
import workSheetApi from './routes/worksheet.js';
import studentsApi from './routes/students.js';
import homeApi from './routes/home.js';
import discountApi from './routes/discount.js';
import orderApi from './routes/orders.js';
import counselingAPI from './routes/counseling.js';
import messageAPI from './routes/messages.js';
import eventAPI from './routes/events.js';
import ticketAPI from './routes/tickets.js';
import ticketDetails from './routes/ticketDetails.js';
import paymentsApi from './routes/payment.js';

import cors from 'cors';
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/neuronplus/api/auth',authApi);
app.use('/neuronplus/api/roles',roleApi);
app.use('/neuronplus/api/users',userApi);
app.use('/neuronplus/api/categories',catApi);
app.use('/neuronplus/api/packageHeader',packageApi);
app.use('/neuronplus/api/teaching',teachApi);
app.use('/neuronplus/api/workSheet',workSheetApi);
app.use('/neuronplus/api/students',studentsApi);
app.use('/neuronplus/api/home',homeApi);
app.use('/neuronplus/api/discounts',discountApi);
app.use('/neuronplus/api/orders',orderApi);
app.use('/neuronplus/api/counseling',counselingAPI);
app.use('/neuronplus/api/messages',messageAPI);
app.use('/neuronplus/api/events',eventAPI);
app.use('/neuronplus/api/tickets',ticketAPI);
app.use('/neuronplus/api/ticketDetails',ticketDetails);
app.use('/neuronplus/api/payment',paymentsApi);

app.listen(8000,()=>console.log("It's running on port:8000"));
   