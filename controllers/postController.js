const Category = require("../models/category");
const Comment = require("../models/comment");
const Like = require("../models/like");
const Post = require("../models/post");
const Tag = require("../models/tag");
const User = require("../models/user");
const ApiFeatures = require("../utils/ApiFeatures");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/newsletterEmail");

exports.updatePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findOne({
    bestPost: { $in: [true] },
    _id: { $ne: id },
  });
  if (post && req.body.bestPost) {
    return next(new AppError("There is already a best post", 400));
  }
  const updatedDoc = await Post.findByIdAndUpdate(id, req.body, {
    // runValidators: true,
    new: true,
  });
  res.status(200).json({
    status: "success",
    data: updatedDoc,
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findByIdAndDelete(id);
  res.status(200).json({
    status: "deleted",
    data: {
      post,
    },
  });
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Post.find(), req.query)
    .pagination()
    .sort()
    .filter();
  const docs = await features.query;
  let total;
  if (!req.query.type) {
    total = await Post.find({
      $or: [
        {
          title: {
            $in: new RegExp(req.query.filter, "i"),
          },
        },
        {
          summery: {
            $in: new RegExp(req.query.filter, "i"),
          },
        },
        {
          content: {
            $in: new RegExp(req.query.filter, "i"),
          },
        },
        {
          author: {
            $in: await User.find({
              name: {
                $in: new RegExp(req.query.filter, "i"),
              },
            }),
          },
        },
        {
          tags: {
            $in: await Tag.find({
              title: {
                $in: new RegExp(req.query.filter, "i"),
              },
            }),
          },
        },
        {
          category: {
            $in: await Category.find({
              title: {
                $in: new RegExp(req.query.filter, "i"),
              },
            }),
          },
        },
      ],
    }).count();
  } else {
    total = await Post.find({
      $or: [
        {
          title: {
            $in: new RegExp(req.query.filter, "i"),
          },
        },
        {
          summery: {
            $in: new RegExp(req.query.filter, "i"),
          },
        },
        {
          content: {
            $in: new RegExp(req.query.filter, "i"),
          },
        },
        {
          author: {
            $in: await User.find({
              name: {
                $in: new RegExp(req.query.filter, "i"),
              },
            }),
          },
        },
        {
          tags: {
            $in: await Tag.find({
              title: {
                $in: new RegExp(req.query.filter, "i"),
              },
            }),
          },
        },
        {
          category: {
            $in: await Category.find({
              title: {
                $in: new RegExp(req.query.filter, "i"),
              },
            }),
          },
        },
      ],
      type: req.query.type,
    }).count();
  }

  res.status(200).json({
    status: "success",
    data: {
      docs,
      total,
    },
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const doc = await Post.findById(id);
  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({
    bestPost: { $in: [true] },
  });
  if (post && req.body.bestPost) {
    return next(new AppError("There is already a best post", 400));
  }
  const doc = await Post.create(req.body);

  const user = await User.findById(req.body.author._id);
  user.posts.push(doc);
  await User.findByIdAndUpdate(user._id, user, {
    runValidators: true,
    new: true,
  });
  await Like.create({ postId: doc._id, users: [] });
  await Comment.create({ postId: doc._id, comments: [] });

  const emails = await User.find({
    $and: [{ preferences: { $in: [req.body.category] } }, { newsletter: true }],
  }).select("email");
  const newPost = await Post.findById(doc._id);
  if (emails.length > 0) {
    await sendEmail({
      email: emails,
      subject: "New post uploaded",
      category: post.category.title,
      title: post.title,
      url: `https://theblogforeverything.com/post/${newPost._id}`,
      message: `https://theblogforeverything.com/post/${newPost._id}`,
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});

exports.getBestPost = catchAsync(async (req, res, next) => {
  const doc = await Post.findOne({
    bestPost: { $in: [true] },
  });
  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});

exports.handleLike = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  // (id, req.body.userId);
  let post = await Post.findById(id);
  const userId = req.body.userId;

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  let exist;
  if (post.likes.length > 0) {
    exist = post.likes.find((like) => {
      like;
      return like._id == userId;
    });
  }
  if (exist) {
    const index = post.likes.indexOf(exist);
    post.likes.splice(index, 1);
  } else {
    post.likes.push(userId);
  }

  const doc = await Post.findByIdAndUpdate(post._id, post, {
    // runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});

exports.totalPosts = catchAsync(async (req, res, next) => {
  const total = await Post.countDocuments();
  res.status(200).json({
    status: "success",
    data: {
      total,
    },
  });
});

exports.getTotalLikes = catchAsync(async (req, res, next) => {
  const posts = await Post.find();
  const totalLikes = posts.reduce((acc, post) => {
    return acc + post.likes.length;
  }, 0);
  res.status(200).json({
    status: "success",
    data: {
      totalLikes,
    },
  });
});

exports.getUsersByBookmark = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const users = await User.find({
    bookmarks: { $in: [id] },
  });
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

exports.getRelatedPosts = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  const relatedPosts = await Post.find({
    category: { $in: [post.category] },
  }).limit(2);
  res.status(200).json({
    status: "success",
    data: {
      relatedPosts,
    },
  });
});

exports.getAllPostsCms = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Post.find(), req.query)
    .pagination()
    .sort()
    .filter();
  const docs = await features.query;
  console.log(docs);
  if (!req.query.type && !req.query.filter) {
    total = await Post.countDocuments();
    console.log(total);
  } else if (!req.query.type && req.query.filter) {
    total = await Post.find({
      $or: [
        {
          title: {
            $in: new RegExp(req.query.filter, "i"),
          },
        },
        {
          summery: {
            $in: new RegExp(req.query.filter, "i"),
          },
        },
        {
          content: {
            $in: new RegExp(req.query.filter, "i"),
          },
        },
        {
          author: {
            $in: await User.find({
              name: {
                $in: new RegExp(req.query.filter, "i"),
              },
            }),
          },
        },
        {
          tags: {
            $in: await Tag.find({
              title: {
                $in: new RegExp(req.query.filter, "i"),
              },
            }),
          },
        },
        {
          category: {
            $in: await Category.find({
              title: {
                $in: new RegExp(req.query.filter, "i"),
              },
            }),
          },
        },
      ],
    }).count();
  } else {
    total = await Post.find({
      $or: [
        {
          title: {
            $in: new RegExp(req.query.filter, "i"),
          },
        },
        {
          summery: {
            $in: new RegExp(req.query.filter, "i"),
          },
        },
        {
          content: {
            $in: new RegExp(req.query.filter, "i"),
          },
        },
        {
          author: {
            $in: await User.find({
              name: {
                $in: new RegExp(req.query.filter, "i"),
              },
            }),
          },
        },
        {
          tags: {
            $in: await Tag.find({
              title: {
                $in: new RegExp(req.query.filter, "i"),
              },
            }),
          },
        },
        {
          category: {
            $in: await Category.find({
              title: {
                $in: new RegExp(req.query.filter, "i"),
              },
            }),
          },
        },
      ],
      type: req.query.type,
    }).count();
  }
  res.status(200).json({
    status: "success",
    data: {
      docs,
      total,
    },
  });
});
