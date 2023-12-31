import path from 'path';
import productModel from '../models/products.model.js'
export default class productController{
    
    getProducts(req, res){
        let products = productModel.get(); 

        res.render("products", {products:products, userEmail: req.session.userEmail}) // rendering products.ejs to index.js
    }

    getAddForm(req, res){
        let errors =[];
        return res.render('new-product', {errorMessage:errors[0], userEmail: req.session.userEmail})
    }

    addNewProduct(req,res){
        const {name, desc, price} = req.body
        console.log(req.file);
        const imgurl = "images/"+req.file.filename
        productModel.add(name,desc,price,imgurl); //adding new product to products
        let products = productModel.get();
        res.render('products', {products: products, userEmail: req.session.userEmail})
    }

    getUpdateProductView(req,res,next){
        // if product exist then return view to update
        const id = req.params.id;
        const productFound = productModel.getById(id);
        if (productFound){
            res.render('update-product', {product:productFound, errorMessage:null, userEmail: req.session.userEmail})
        } 
        // else return with product not found
        else {
            res.status(401).send('product not found');
        }

    }

    postUpdateProduct (req,res,next){
        productModel.update(req.body); //adding updated details to specific product to updated
        let products = productModel.get();
        res.render('products', {products: products, userEmail: req.session.userEmail})
    }

    postDeleteProduct(req,res,next){
        const id = req.params.id;
        const productFound = productModel.getById(id);
        if(!productFound){
            return res.status(401).send("Product Not Found")
        }
        productModel.delete(id); //deleting product from products 
        let products = productModel.get();
        res.render('products', {products: products, userEmail: req.session.userEmail})
    }


}
