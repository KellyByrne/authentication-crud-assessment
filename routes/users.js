var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/assessment')
var users = db.get('users')
/* GET users listing. */
router.get('/signup', function(req, res, next) {
  res.render('users/signup');
});

router.post('/signup', function(req, res, next){
	var errors = [];
	if(!req.body.email.trim()){
		errors.push("Email is required!")
	}
	if(!req.body.password.trim()){
		errors.push("Password is required!")
	}
	if(req.body.password.length < 8){
		errors.push("Password must be greater than 8 characters.")
	}
	users.findOne({email: req.body.email}, function(err, data){
		if(data){
			errors.push("This email is already in use.")
		}
		if(errors.length === 0){
			var password = bcrypt.hashSync(req.body.password, 11);
			var email = req.body.email.toLowerCase();
			users.insert({email: email, password: password}, function(err, data){
				if(err) {
					console.log("err on insert");
				}
			})
			req.session.user = email;
			res.redirect('/')
		}
		res.render('users/signup', {errors:errors});
	})

})


router.get('/signin', function(req, res, next) {
  res.render('users/signin');
});

router.post('/signin', function(req, res, next){
	var errors = [];
	if(!req.body.email.trim()){
		errors.push("Email is required!")
	}
	if(!req.body.password.trim()){
		errors.push("Password is required!")
	}
	users.findOne({email: req.body.email}, function(err, data){
		var pw = req.body.password;
		if(!data) {
			errors.push("This email is not signed up.")
		} else if (!bcrypt.compareSync(pw, data.password)){
			errors.push("Invalid Password.")
		}
		if(errors.length == 0){
			req.session.user = data.email;
			res.redirect('/');
		}
		res.render('users/signin', {errors: errors});
	})
})

router.get('/signout', function(req, res, next){
	req.session = null;
	res.redirect('/')
})

module.exports = router;
