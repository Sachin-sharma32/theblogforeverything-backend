// const Order = require("../models/order");
// const catchAsync = require("../utils/catchAsync");

// exports.orderPerProduct = catchAsync(async (req, res) => {
//     const stats = await Order.aggregate([
//         {
//             $unwind: "$products",
//         },
//         {
//             $match: { amount: { $gt: 100 } },
//         },
//         {
//             $group: {
//                 _id: "$products.product",
//                 totalOrders: { $sum: 1 },
//             },
//         },
//         {
//             $sort: {
//                 amount: 1,
//             },
//         },
//     ]);
//     res.status(200).json({
//         message: "success",
//         data: {
//             stats,
//         },
//     });
// });

// exports.salesPerMonth = catchAsync(async (req, res) => {
//     const stats = await Order.aggregate([
//         {
//             $match: { amount: { $gt: 1100 } },
//         },
//         {
//             $group: {
//                 _id: { $month: "$createdAt" },
//                 total: { $sum: 1 },
//                 maxOrder: { $max: "$amount" },
//                 avgOrder: { $avg: "$amount" },
//                 minOrder: { $min: "$amount" },
//                 products: { $push: "$products.product" },
//             },
//         },
//     ]);
//     await Order.populate(stats, { path: "products.product" });
//     res.status(200).json({
//         status: "success",
//         data: {
//             stats,
//         },
//     });
// });
