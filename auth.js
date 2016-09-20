var passport   = require("passport");
var Strategy   = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;


module.exports = app => {
	const Users = app.db.models.Users;
	const cfg = app.libs.config;
	const configuracao = {};
	configuracao.secretOrKey = cfg.jwtSecret;
	configuracao.jwtFromRequest = ExtractJwt.fromAuthHeader();

	const strategy = new Strategy(configuracao,
		(payload, done) => {
			Users.findById(payload.id)
			.then(user => {
				if(user) {
					return done(null, {
						id: user.id,
						email: user.email
					});
				}
				return done(null, false);
			})
			.catch(error => done(error, null));
		});
	passport.use(strategy);
	return {
		initialize: () => {
			return passport.initialize();
		},
		authenticate: () => {
			return passport.authenticate("jwt", cfg.jwtSession);
		}
	};
};
