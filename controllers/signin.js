const handleSignIn = (req, res, db, bcrypt) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json('No email or password entered')
    }

    const valid_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!valid_email.test(String(email).toLowerCase())) {
        return res.status(400).json('Invalid Email Entered')
    };

    const valid_password = /^\w+$/;
    // /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/

    //     RegEx	Description
    // ^	The password string will start this way
    // (?=.*[a-z])	The string must contain at least 1 lowercase alphabetical character
    // (?=.*[A-Z])	The string must contain at least 1 uppercase alphabetical character
    // (?=.*[0-9])	The string must contain at least 1 numeric character
    // (?=.[!@#\$%\^&])	The string must contain at least one special character, but we are escaping reserved RegEx characters to avoid conflict
    // (?=.{8,})	The string must be eight characters or longer

    // strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    // mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

    if (!valid_password.test(String(password))) {
        
        return res.status(400).json('Wrong Password Format Entered')
    };

    const hash = bcrypt.hashSync(password);

    db.select('*').from('login').where('email', '=', email)
        .then(user => {
            if (bcrypt.compareSync(password, user[0].hash)) {
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(data => {
                        res.json(data[0]);
                    })
                    .catch(err => res.status(400).json('User Not Found'))
            } else {
                res.status(400).json('Invalid Password')
            }
        })
        .catch(err => res.status(400).json('User Not Found'))
};

module.exports = {
    handleSignIn: handleSignIn
};
