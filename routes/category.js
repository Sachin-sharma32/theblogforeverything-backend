const express = require("express");
const { verifyAdmin, verifyToken } = require("../controllers/authController");
const {
    deleteCategory,
    createCategory,
    getAllCategories,
    updateCategory,
    getCategory,
    getPostsByCategory,
    getTotalCategories
} = require("../controllers/categoryController");

const router = express.Router();

router.route('/total').get(verifyToken, getTotalCategories)
router
    .route("/:id")
    .delete(verifyAdmin, deleteCategory)
    .patch(verifyAdmin, updateCategory)
    .get(verifyToken, getCategory);
router.route("/posts/:id").get(verifyToken, getPostsByCategory);
router
    .route("/")
    .post(verifyAdmin, createCategory)
    .get(verifyToken, getAllCategories);

module.exports = router;
