var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/assessment');
var students = db.get('students');

router.get('/', function(req, res, next){
	students.find({}, function(err, data){
	res.render('students/index', {allStudents: data})
		})
})

router.get('/new', function(req, res, next){
	res.render('students/new')
})

router.post('/new', function(req, res, next){
	var errors = [];
	if(!req.body.name.trim()){
		errors.push('Name is required.')
	}
	if(!req.body.number.trim()){
		errors.push('Phone number is required.')
	}
	if(errors.length === 0){
		students.insert({name: req.body.name, number: req.body.number},
			function(err, data){
				if(err) {
					console.log("err on insert")
				}
			})
			res.redirect('/students')
	}
	res.render('students/new', {errors: errors})
})

router.get('/:id', function(req, res, next){
	students.findOne({_id: req.params.id}, function(err, data){
		res.render('students/show', {student: data})
	})
})

router.get('/:id/edit', function(req, res, next){
	students.findOne({_id: req.params.id}, function(err, data){
		res.render('students/edit', {student: data})
	})
})

router.post('/:id/edit', function(req, res, next){
	students.updateById(req.params.id, {name: req.body.name,
		number: req.body.number}, function(err, data){
			res.redirect('/students')
	})
})
	


module.exports = router;