const expressHandlerWrapper = require("express-async-handler");
const {searchHelper,populateHelper,questionSortHelper, paginationHelper} = require("./queryHelpers")
const Question = require("../../models/Question")
const questionQueryMiddleware = function (model,options){

    return expressHandlerWrapper(async function (req,res,next){
        let query = model.find();
        const total = await model.countDocuments();
        query = searchHelper("title",query,req);

        if(options & options.population){
            query = populateHelper(query,options.population)
        }
        query = questionSortHelper(query,req)

        const paginationResult = await paginationHelper(total,req,query)

        const pagination = paginationResult.pagination;
        query = paginationResult.query;

        const queryResult = await query;

        res.queryResult = {
            success: true ,
            data : queryResult,
            count : queryResult.length ,
            pagination  : pagination

        }

        next();
    });
}

module.exports = questionQueryMiddleware;