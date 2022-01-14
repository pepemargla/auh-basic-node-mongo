exports.createPostValidator = (req,res,next) => {
    //Title
    req.check("title", "Write a title").notEmpty();
    req.check("title", "Title must be beetween 5 to150 characters").isLength({
        min: 5,
        max: 150
    });
    //Body
    req.check("body", "write a body").notEmpty();
    req.check("body", "Body must contain beetween 150 to 3000 characters").isLength({
        min: 150,
        max: 3000
    });
    //Chack for errors
    const errors = req.validationErrors();
    //If errors show the first one as they happen
    if (errors) {
        const firstError = errors.map(err => err.msg)[0];
        return res.status(400).json({
            error: firstError
        });
    }
    //Procced to next middleware
    next();
}

exports.userSignupValidator = (req,res, next)=> {
    //name is not null and beetween 4-10 characters
    req.check("name", "Name is required").notEmpty();
    req.check("name", "Name most be between 5 to 150 characters").isLength(
        {
            min: 4,
            max: 10
        }
    );
    //email is not null, valid and normalize
    req.check("email", "Email must to be between  3  to 32 characteres")
    .matches(/.+\@.+\../)
    .withMessage("Email must contain @")
    .isLength({
        min: 3,
        max: 32
    })
    //check for password
    req.check("password", "Password is required").notEmpty();
    req.check('password')
    .isLength({min:6})
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number")

    //check for errors
    const errors = req.validationErrors();
    //If errors show the first one as they happen
    if (errors) {
        const firstError = errors.map(err => err.msg)[0];
        return res.status(400).json({
            error: firstError
        });
    }
    //Procced to next middleware
    next();
}