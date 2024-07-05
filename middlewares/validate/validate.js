const validateRequest = (schema) =>(req, res, next) => {
    console.log(req.body)
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }
    next();
};

module.exports = validateRequest;