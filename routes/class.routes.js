const express = require('express');
const ObjectId = require('mongodb').ObjectId;
const { body } = require('express-validator');

const ClassControllers = require('../controller/class.controller');

const Class = require('../schemas/class.schema');

const router = express.Router();

// get all classes
router.get('/classes', ClassControllers.getGetClasses);

// get class by id
router.get('/class/:classId', ClassControllers.getGetSingleClass);

// create class
router.post(
	'/classes',
	[ 
		body('name', 'Class name must be consisting of one capital character and one number for better experience')
			.trim()
			.isUppercase()
			.isLength({ min: 2, max: 10 })
			.custom(async (value, { req }) => {
				try {
					const foundClass = await Class.getClassWithCondition({ name: value });
					if (foundClass) {
						return Promise.reject('This name is taken by some class, insert an alternative.');
					}
					return true;
				} catch (error) {
					error.statusCode = 500;
					throw error;
				}
			})
			.not()
			.isNumeric(),
            body('code', 'Code must contain chars only').trim().isString(),
            body('description', 'Description must contain chars only').trim().isString()
          
	],
	ClassControllers.postAddClass
);

// edit class
router.patch(
	'/class/edit',
	[
		body('name', 'Class name must be consisting of capital character and one number for better experience')
			.trim()
			.isUppercase()
			.isLength({ min: 2, max: 10 })
			.not()
			.isNumeric(),
			body('code', 'Code must contain chars only').trim().isString(),
            body('description', 'Description must contain chars only').trim().isString()

	],
	ClassControllers.patchEditClass
);

// addStudent to a class
router.patch('/class/addStudent', ClassControllers.patchAddStudentToClass);

// removeStudent from a class
router.patch('/class/removeStudent', ClassControllers.patchremoveStudentFromClass); 

// delete class
router.delete('/class/delete/:classId', ClassControllers.deleteRemoveClass);

module.exports = router;
