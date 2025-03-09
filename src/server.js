import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    const id = uuidv4();
    res.cookie('session_id', id, {
        httpOnly: true,
        maxAge: 3600000,
        secure: true,
        sameSite: 'strict',
    });
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/add-to-cart', (req, res) => {
    const { product } = req.body;
    let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
    
    cart.push(product);

    res.cookie('cart', JSON.stringify(cart), {
        httpOnly: true,
        maxAge: 3600000, 
        secure: true, 
        sameSite: 'strict'
    });

    res.json({ message: 'Produto adicionado ao carrinho!', cart });
});

app.get('/cart', (req, res) => {
    const cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
    res.json(cart);
});

app.post('/clear-cart', (req, res) => {
    res.clearCookie('cart');
    res.json({ message: 'Carrinho limpo!' });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});