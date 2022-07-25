
const express = require('express');
const router = express.Router();

// function to make array of searched input 


const stringToArray = (str,arrayReg,arrayStr)=>{
    let curr="";
    let ascii;
    for(let i=0;i<str.length;i++){
        ascii = str.charCodeAt(i);
        if(str[i]==' '){
            if(curr.length>0){
                arrayStr.push(curr);
                curr = new RegExp(curr);
                arrayReg.push(curr);
                curr="";
            }
        }else if(ascii>=97 && ascii<=122){
            curr+=str[i];
        }
    }
    if(curr.length>0){
        arrayStr.push(curr);
        curr = new RegExp(curr);
        arrayReg.push(curr);
    }
    if(arrayStr.length==0){
        arrayStr.push("");
    }
}





// getting the productSchema 
const Product = require('../schema/productSchema');


router.post("/api/getSearchedProducts", async (req,res)=>{
    let arrayReg=[];
    let arrayStr= [];
    try{
        let {search,filterData} = req.body;
        search = search.toLowerCase();

       
        stringToArray(search,arrayReg,arrayStr);
        let products = await Product.find({tags:{$all:arrayStr}});
        if(products.length ==0){
            products = await Product.find({tags:{$all:arrayReg}});
        }
        if(products.length==0){
            products = await Product.find({tags:{$in:arrayStr}});
        }
        if(products.length==0){
            products = await Product.find({tags:{$in:arrayReg}});
        }


        if(filterData){
            let filterProducts = await Product.find(filterData);
            products = products.filter(item1 => filterProducts.some(item2 => item1.id === item2.id));
        }

        
        products.reverse();
        res.status(200).json({productsArray:products});
    }catch(err){
        res.status(500).json({error:"there is error and we are not getting req.body"});
        console.log(err)
    }
})

module.exports = router
