const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const cors = require("cors");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const sanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const hpp = require("hpp");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
// const statRouter = require("./routes/stat");
const categoryRouter = require("./routes/category");
const commentRouter = require("./routes/comment");
const testimonialRouter = require("./routes/testimonial");
const uploadRouter = require("./routes/upload");
const AppError = require("./utils/AppError");
const tagRouter = require("./routes/tag");
const { getMe } = require("./controllers/userController");
const { Configuration, OpenAIApi } = require("openai");
const catchAsync = require("./utils/catchAsync");

const app = express();

//? 2
//* parse (read) incoming cookie
app.use(cookieParser());

app.use(compression());

// const limiter = rateLimit({
//     max: 1000,
//     windowMs: 60 * 60 * 1000 * 1000,
//     message: "Can only make 100 requests to server in 1 hour",
// });

// app.use("/api", limiter);
app.use(helmet.crossOriginOpenerPolicy());
app.use(sanitize());
app.use(hpp());
app.use(morgan("dev"));

app.use(
    express.json({
        limit: "1mb",
    })
);

//? 7
// const whitelist = [
//     "https://theblogforeverything.com",
//     "http://localhost:3001",
//     "http://localhost:3002",
//     "*",
// ];
// const corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true);
//         } else {
//             callback(next(new AppError("Not allowed by CORS")));
//         }
//     },
// };
// app.use(cors(corsOptions));

app.use(
    cors({
        origin: "*",
        credentials: true,
        optionsSuccessStatus: 200,
    })
);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/tags", tagRouter);
app.get("/getMe", getMe);

app.post(
    "/assistence",
    catchAsync(async (req, res, next) => {
        req.body;
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${req.body.prompt}`,
            //* risk - temprature
            temperature: 0,
            //* response size (characters)
            max_tokens: 3000,
            top_p: 1,
            //* likelyhood of repeating the same response
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        response.data.choices[0].text;
        res.status(200).send({
            bot: response.data.choices[0].text,
        });
    })
);

// app.use("/api/v1/stats", statRouter);
app.use("/api/v1/testimonials", testimonialRouter);

//? (f)
app.use(express.static("uploads"));
app.use("/api/v1/uploads", uploadRouter);

app.all("*", (req, res) => {
    res.status(404).json({
        status: "failure",
        message: `cannot find ${req.originalUrl} on the server`,
    });
});

const handleCastError = (error) => {
    return new AppError(`Invalid ${error.path}: ${error.value}`, 400);
};

const handleDuplicateFieldError = (err, res) => {
    const message = `${err.keyValue.email} already exist`;
    return new AppError(message, 400);
};

const handleValidationError = (err, res) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new AppError(message, 400);
};


const handleJWTError = (err) => {
    const message = "Invalid jwt";
    return new AppError(message, 401);
};

const handleExpirationalError = (err) =>
    new AppError("your jwt token has expired", 404);

app.use((err, req, res, next) => {
    let { ...error } = err;
    if (err.name === "CastError") error = handleCastError(error);
    if (err.code === 11000) error = handleDuplicateFieldError(error);
    if (err.name === "ValidationError") error = handleValidationError(error);
    if (err.name === "JsonWebTokenError") error = handleJWTError(error);
    if (err.name === "TokenExpiredError")
        error = handleExpirationalError(error);
    // res.status(error.statusCode).json({
    //     status: error.status,
    //     message: error.msg,
    // });
    res.status(500).json({
        message: err.message,
    });
});

mongoose
    .connect(
        "mongodb+srv://sachin:sachin1234@cluster0.qryslrm.mongodb.net/?retryWrites=true&w=majority"
    )
    .then((connection) => {
        ("connected to db");
    });

app.listen(process.env.PORT, () => {
});
