const checkUsername = (username) => {
    /**
     * Regex Explanation
     * ^ --> start of the string
     * /D --> anything not a digit [^0-9]
     * /w anything that is a alphanumeric character [a-zA-Z0-9]
     * {2,} --> 2 or more characters w/ NO UPPER LIMIT
     */
    let usernameChecker = /^\D\w{2,}$/
    return usernameChecker.test(username);
}

const checkPassword = (password) => {}

const checkEmail = (email) = {}

const registerValidator = (req, res, next) => {
    let username = req.body.username;
    if(!checkUsername(username)){
        req.flash('error',"invalid username!!!");
        req.session.save(err => {
            res.redirect("/registration");
        })
    }else{
        next();
    }

}

const loginValidator = (req, res, next) => {

}

module.exports = {registerValidator, loginValidator}