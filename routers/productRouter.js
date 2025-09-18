const { createProduct, getAll, deleteProduct, getOne, updateProduct, updateProductImage, updateSpecificFile, updateMultipleFiles } = require('../controllers/productControllers')
const uploads = require('../middleware/multer')
const router = require('express').Router()

router.post('/product',uploads.array('images',4),createProduct)

router.get('/product/:id',getOne)

router.get('/products', getAll)

router.patch('/product/:id',uploads.array('images',4) ,updateProduct)

router.patch('/productimage/:id',uploads.array('images',4) ,updateProductImage)

router.patch('/productimage/:id/:index',uploads.array('images',4) ,updateSpecificFile)

router.patch('/productimage/:id/:indexes',uploads.array('images',4) ,updateMultipleFiles)

router.delete('/product/:id', deleteProduct)

module.exports = router