

export const GetSearchedProducts = async (search,filterData)=>{
    try{
        const res = await fetch('/api/getSearchedProducts',{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({search,filterData})
        })
        if(!res){
            console.log("some error");
            return false;
        }else{
            let products = await res.json();
            products = products.productsArray;
            return products;
        }
    }catch(err){
        console.log(err);
    }
    
}