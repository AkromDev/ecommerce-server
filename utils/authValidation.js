const User = require('../models/user')
const httpCodes = require("../constants/httpCodes");
const throwError = require("./throwError");
const userRoles = require('../constants/userRoles');

function checkAuth(req){
    if(!req.isAuth || !req.userId){
      return throwError({
        message: 'Not authenticated',
        code: httpCodes.UNAUTHORIZED,
      })
    }
  }
const checkIfAdmin = async req => {
  checkAuth(req)
  const user = await User.findById(req.userId)
  if(!user || !Array.isArray(user.roles)){
    return throwError({
      message:'Invalid user data',
      code: httpCodes.INTERNAL_SERVER_ERROR
    })
  }
  if(!user.roles.includes(userRoles.ADMIN)){
    return throwError({
      message: 'You have no sufficient privileges',
      code: httpCodes.FORBIDDEN,
    });
  }
  
}

const authValidation = {
  checkAuth,
  checkIfAdmin
}

module.exports = authValidation