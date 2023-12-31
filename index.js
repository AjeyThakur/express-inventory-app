import express from 'express';
import path from 'path';
import ejsLayout from 'express-ejs-layouts';
import validatingData from './src/middleware/validation.middleware.js';
import { uploadFile } from './src/middleware/file-upload.middleware.js';
import productController from './src/controllers/products.controller.js';
import usersController from './src/controllers/users.controller.js';
import session from 'express-session';
import { auth } from './src/middleware/auth.middleware.js';

const server = express();

server.use(ejsLayout); // using ejs as global middleware

server.use(express.urlencoded({extended: true})); // added middleware to parse from data in post req by submit new product

// creating instance for controllers class to use their non-static methods
const productControllers = new productController();
const usersControllers =  new usersController();

server.use(express.static('public')) // exposing public folder staticly so js files can be directly accessable for views
server.use(session(
    {
        secret:'SecretKey',
        resave:false,
        saveUninitialized: true,
        cookie: {secure: false}

    }
));

server.set("view engine", "ejs");     // sets view engine ejs in header
server.set("views", path.join(path.resolve(),'src','views'))

//routes
server.get('/register', usersControllers.getRegister);
server.get('/login', usersControllers.getLogin);
server.get('/logout', usersControllers.getLogout);
server.get('/', auth, productControllers.getProducts); // getting products at /
server.get('/new', auth, productControllers.getAddForm);
server.get('/update-product/:id', productControllers.getUpdateProductView);
server.post('/', uploadFile.single('imgurl'), validatingData,  productControllers.addNewProduct);
server.post('/update-product', productControllers.postUpdateProduct);
server.post('/delete-product/:id', productControllers.postDeleteProduct);
server.post('/register', usersControllers.postRegister);
server.post('/login', usersControllers.postLogin);

server.use(express.static('src/views')); 

server.listen(3200, ()=>(console.log("server started at 3200")));