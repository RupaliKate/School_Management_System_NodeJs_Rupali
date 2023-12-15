// Import required Node.js modules
const express = require('express');
const ObjectId = require('mongodb').ObjectId;
const { body } = require('express-validator');

// Import student controllers and schemas
const StudentControllers = require('../controller/student.controller');
const Student = require('../schemas/student.schema');
const router = express.Router();

// add student
router.post(
	'/students',
	[
		body('firstName', 'FirstName must contain chars only').trim().isString(),
		body('lastName', 'LastName must contain chars only').trim().isString(),
		body('gender', 'Gender must be contain chars only'),
		body('age', 'Insert age!').trim().notEmpty(),
		body('email', 'Email must be a valid email').trim().isEmail().custom(async (value, { req }) => {
			try {
				const student = await Student.getStudentWithCondition({ email: value });
				if (student) {
					return Promise.reject('This email is taken by some student');
				}
				return true;
			} catch (error) {
				error.statusCode = 500;
				throw error;
			}
		})
	],
	StudentControllers.addStudent
);

// get all students
router.get('/students', StudentControllers.getAllStudents);

// get student by id
router.get('/student/:id', StudentControllers.getStudent);

// edit student
router.patch(
	'/student/edit',
	[
		body('firstName', 'FirstName must contain chars only').trim().isString(),
		body('lastName', 'LastName must contain chars only').trim().isString(),
		body('gender', 'Gender must be contain chars only'),
		body('email', 'Email must be a valid email').trim().isEmail()
	],
	StudentControllers.patchEditStudent
);

// delete student
router.delete('/student/delete/:id', StudentControllers.deleteDeleteStudent);

module.exports = router;