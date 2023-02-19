const mongoose = require("mongoose");

class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    pagination() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 1000000;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort("-updatedAt");
        }
        return this;
    }
    filter() {
        if (this.queryString.filter) {
            this.query = this.query.find({
                $or: [
                    {
                        title: {
                            $in: new RegExp(this.queryString.filter, "i"),
                        },
                    },
                    {
                        summery: {
                            $in: new RegExp(this.queryString.filter, "i"),
                        },
                    },
                    {
                        content: {
                            $in: new RegExp(this.queryString.filter, "i"),
                        },
                    },
                ],
            });
            return this;
        }
        return this;
    }
    type() {
        if (this.queryString.type !== "") {
            this.query = this.query.find({
                type: { $regex: new RegExp(this.queryString.type, "i") },
            });
        }
        return this;
    }
}
module.exports = ApiFeatures;
