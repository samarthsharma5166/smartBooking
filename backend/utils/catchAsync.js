export default fn => {
  return (req, res, next) => {
    try{
      fn(req, res, next)
    }
    catch(error){
      return next(new AppError(error.message, 500));
    }
  }
};
