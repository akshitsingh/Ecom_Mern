const express = require("express");

const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
} = require("../controllers/productController");
const {isAutheticatedUser , authorizeRoles} = require("../middleware/auth");


const router = express.Router();

router.route("/products/new").post(isAutheticatedUser,authorizeRoles("admin"), createProduct);
router.route("/products").get(getAllProducts);
router
  .route("/products/:id")
  .put(isAutheticatedUser,authorizeRoles("admin"), updateProduct)
  .delete(isAutheticatedUser,authorizeRoles("admin"), deleteProduct)

 router.route('/product/:id').get(authorizeRoles("admin"),getProductDetails);

 router.route('/review').put(isAutheticatedUser,authorizeRoles("admin"), createProductReview)

 router.route('/reviews').get(getProductReviews).delete(isAutheticatedUser,deleteReview)


module.exports = router;
