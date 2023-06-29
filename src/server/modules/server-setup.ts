import express from 'express';
import cors from 'cors';

export const app = express();
const PORT = 3501;
app.use(cors());
app.use(express.json());

app.listen(PORT, function(){
    console.log( `starting at localhost http://localhost:${PORT}`);
});
