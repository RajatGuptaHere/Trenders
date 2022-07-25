const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');



// function to make array for sizes 
function toArray(sizes){
    let sizesArray = [];
    let s = "";
    for(let i=0;i<sizes.length;i++){
        if(sizes[i]==' '){
            if(s.length >0){
                sizesArray.push(s);
                s= "";
            }
        }else{
            s += sizes[i];
        }
    }
    if(s.length >0){
        sizesArray.push(s);
        s= "";
    }
    return sizesArray;
}



// getting the productSchema 
const Product = require('../schema/productSchema');

// for getting image multer is used
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
})
  
// .single is used that we have single file of name   img 
const upload = multer({ storage: storage }).single('img');


router.post('/api/editProduct',upload,async (req,res)=>{
    try{
        let {productId,stock,price,actualPrice,description,pincodes,inTrending,specialOffer} = req.body;
        // updating values 
        if(inTrending=='false'){
            inTrending = false;
        }else{
            inTrending=true
        }
        
        if(specialOffer=='false'){
            specialOffer = false;
        }else{
            specialOffer = true;
        }
        
       
        stock = parseInt(stock);
        price = parseInt(price);
        actualPrice = parseInt(actualPrice);
        let discount = parseInt(((actualPrice-price)/actualPrice)*100);

        if(req.file){
            let img = req.file.filename;
            let imgType = req.file.mimetype;
            if(!stock || !price || !actualPrice || !description || !pincodes){
                fs.unlink(req.file.path,(err)=>{
                    console.log(err);
                    return;
                });
                res.status(204).json({"message":"fill it completely"});
            }else{
                if(imgType == "image/jpeg" || imgType == "image/jpg" || imgType == "image/png" || imgType == "image/gif"){
                    let product = await Product.findOne({productId:productId});
                    product = product.img;
                    const data = await Product.findOneAndUpdate({productId:productId},{$set:{img:img,stock:stock,price:price,actualPrice:actualPrice,
                    description:description,pincodes:pincodes,inTrending:inTrending,discount:discount,
                    specialOffer:specialOffer}});
                     fs.unlink('public//'+product,(err)=>{
                        console.log(err);
                        return;
                    });
                    res.status(200).json({success:"edited successfully"});
                }else{
                    fs.unlink(req.file.path,(err)=>{
                        console.log(err);
                        return;
                    });
                    res.status(203).json({imageError:"image sholud be jpeg png or gif"});
                }
            }
        }else{
            if(!stock || !price || !actualPrice || !description || !pincodes){
                res.status(204).json({"message":"fill it completely"});
            }else{
               const data = await Product.findOneAndUpdate({productId:productId},{$set:{stock:stock,price:price,actualPrice:actualPrice,
                description:description,discount:discount,pincodes:pincodes,inTrending:inTrending,specialOffer:specialOffer}});
                console.log(data);
                res.status(200).json({success:"edited successfully"});
            }
        }
        
    }catch(err){
        if(req.file){
            fs.unlink(req.file.path,(err)=>{
                console.log(err);
                return;
            });
        }
        res.status(500).json({error:"there is error and we are not getting req.body"});
        console.log(err)
    }

})


module.exports = router;



