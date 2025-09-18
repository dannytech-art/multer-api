const productModel = require('../models/productmodel')
const fs = require('fs')

exports.createProduct = async (req,res)=>{
    try {
        const { productName, price, quantity, description} = req.body
        const productExist = await productModel.findOne({productName})
        if (productExist) {
            res.status(400).json({
                message: `product already exist try updating`
            })
        }
            const files = req.files

            const filePaths = files.map((element)=>{
               return element.path
              
            })
          const product = new productModel({
            productName,
            price,
            quantity,
            description,
            images: filePaths
          })
          await product.save()
          res.status(201).json({
            message: `successfully created a user`,
            data: product
          })
        
    } catch (error) {
        res.status(500).json({
            Error:error.message
        })
    }
}
exports.getAll = async (req,res)=>{
  try {
    const products = await productModel.find();

    res.status(200).json({
      message: `All products available and the total is: ${products.length}`,
      data: products,
    });
    
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getOne = async (req,res)=>{
  try {
    const {id} = req.params
    const product = await productModel.findById(id)
    if (!product) {
      return res.status(404).json({
        message:"product not found"
      })
    }
    res.status(200).json({
      message:'product found',
      data:product
    })
  } catch (error) {
    res.status(500).json({
      message:error.message
    })
  }
}

exports.updateProduct = async (req,res)=>{

  try {
    const{id}= req.params
    const {productName,description,quantity,price}=req.body
    const  product = await productModel.findById(id)
    if (!product) {
      return res.status(400).json({
        message:'product not found'
      })
    }
    const data = {
      productName: productName || product.productName,
      description: description || product.description,
      quantity:quantity        || product.quantity,
      price:price              || product.price,
      images: product.images
    };
    const oldFilePaths = product.images;

    const imagePaths = req.files.map
    ((element)=> element.path);

    if (req.files && req.files[0]) {
      oldFilePaths. forEach((element)=>{
        const fileCheck = fs.existsSync(element)
        if (fileCheck) {
          fs.unlinkSync(element)
        }
      })
      data.images = imagePaths
    }
    const updatedProduct = await productModel.findByIdAndUpdate(id,data,{new:true});
     res.status(200).json({
      message:'product updated',
      data:updatedProduct
    })
    
  } catch (error) {
     res.status(500).json({
      message:error.message
    })
  }
}
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    const deletedProduct = await productModel.findByIdAndDelete(id);

    
    const oldFilePaths = product.images;
    if (oldFilePaths && oldFilePaths.length > 0) {
      oldFilePaths.forEach((filePath) => {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    res.status(200).json({
      message: "Product deleted",
      data: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.updateProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, description, quantity, price } = req.body;

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const data = {
      productName: productName || product.productName,
      description: description || product.description,
      quantity: quantity || product.quantity,
      price: price || product.price,
      images: product.images,
    };

    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map((file) => file.path);
      data.images = [...product.images, ...imagePaths];
    }

    // Update the product
    const updatedProduct = await productModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(200).json({
      message: "Product updated",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.updateSpecificFile = async (req,res) =>{
  try {
    const { id, index } = req.params
    const product = await productModel.findById(id)
    if (!product) {
      res.status(404).json({
        message: `product does not exist`
      })

    }
    const data = {
      productName: productName || product.productName,
      quantity: quantity || product.quantity,
      description: description || product.description,
      price: price || product.price,
      images: images || product.images
    }
      const fileindex = parseInt(index,10)
      if (fileindex < 0 || fileindex >= product.images.length) {
        res.status(400).json({
          message: `put the index currectly`
        })
        const oldImagePath = product.images[fileindex]
        if (fs.existsSync(oldImagePath)) {
           fs.unlinkSync(oldImagePath);
        }
        product.images[fileindex] = req.files[0].path;

      }
      const updatedProduct = await productModel.findByIdAndUpdate(id,data,{new: true})
      res.status(200).json({
      message: `updated successfully`,
      data: updatedProduct
      })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}