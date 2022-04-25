//error handler  function
const errorHandler = (err, req, res, next)=>{
  
    //terney operation
    const statusCode = res.statusCode ? (res.statusCode): (500);
    res.status(statusCode);

    //response in json formate
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? (null) : (err.stack)

    });
}


module.exports = {
    errorHandler
}