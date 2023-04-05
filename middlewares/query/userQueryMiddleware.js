const expressHandlerWrapper = require("express-async-handler");
const {searchHelper, paginationHelper} = require("./queryHelpers")


const userQueryMiddleware = function (model,options){

    return expressHandlerWrapper(async function (req,res,next){
        let query = model.find();
        const total = await model.countDocuments();
        query = searchHelper("name",query,req)

        const paginationResult = await paginationHelper(total,req,query)

        query = paginationResult.query
        const pagination = paginationResult.pagination

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

module.exports = userQueryMiddleware;