import passport from 'passport'

export function admin(req , res , next){
    passport.authenticate("current", { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.redirect('/login')
        }

        req.user = user
        if (req.user.role !== "admin") {
            return res.status(403).send("ACCESS DENIED")
        }

        next()
    })(req, res, next)
}

export function user(req , res , next){
    passport.authenticate("current", { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.redirect('/login')
        }

        req.user = user
        if (req.user.role !== "user"){
            return res.status(403).send("ACCESS DENIED")
        }

        next()
    })(req, res, next)
}

export function current(req , res , next){
    passport.authenticate("current", { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.redirect('/login')
        }

        req.user = user
        next()
    })(req, res, next);
}