const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Product = require("../models/ProductModel");
const ApiFeatures = require("../util/apiFeatures");
const ErrorHandler = require("../util/errorhandler");

//Create product --Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {

  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    product,
  });
});

//Get all products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 5;
  const productCount = await Product.countDocuments();
  const apiFeature = new ApiFeatures(Product.find(), req.query)
  .search()
  .filter()
  .pagination(resultPerPage)
  ;
  const products = await apiFeature.query
  res.status(200).json({
    success: true,
    products,
  });
});

//Update product --Admin

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = Product.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Proudct not found",
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: true,
      message: "Product not found",
    });
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product Delete successfully",
  });
});


//Get product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});


//Update Product Review - user
exports.createProductReview = catchAsyncErrors(

  async(req,res,next)=>{
  const { rating, comment, productID } = req.body;
 
      const review = {
      user : req.user._id,
      name : req.user.name,
      rating,
      comment
      }

      const product = await Product.findById(productID);

     const isReviewed = product.reviews.find(rev=>rev.user.toString()===req.user._id)

      if(isReviewed){
         product.reviews.forEach(rev=>{
           if(rev.user.toString()===req.user._id){
            rev.rating = rating,
            rev.comment = comment
           }
         })
      }
      else{
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length;
      }

     let avg = 0;
       product.reviews.forEach(rev=>{
        avg+= rev.rating
      })

     product.ratings = avg / product.reviews.length;

      await product.save({validateBeforesave: false})

      res.status(200).json({
        success : true 
      })
    }
)

//Get all review of product
exports.getProductReviews = catchAsyncErrors(

  async(req,res,next)=>{
  
      const product = await Product.findById(req.query.id);

     if(!product){
       return next(new ErrorHandler('Product not found',404))
     }
      res.status(200).json({
        success : true ,
        reviews : product.reviews
      })
    }
)

//Delete reviews
exports.deleteReview = catchAsyncErrors(

  async(req,res,next)=>{
  
      const product = await Product.findById(req.query.productId);

     if(!product){
       return next(new ErrorHandler('Product not found',404))
     }

     const reviews = product.reviews.filter(rev=> rev._id.toString()!==req.query.id)

     let avg = 0; 
     reviews.forEach(rev=>{
       avg+= rev.rating
     })

    const ratings = avg /  reviews.length;

    const numOfReviews = reviews.length;
    
    product.findByIdAndUpdate(req.query.productId,{
      reviews,
      ratings,
      numOfReviews
    },{
      new : true,
      numValidators : true,
      useFindAndModify : true
    }
    )

      res.status(200).json({
        success : true ,
        reviews : product.reviews
      })
    }
)

