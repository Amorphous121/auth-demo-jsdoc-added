const router = require('express').Router();
const { validate } = require('express-validation');
const passport = require('passport')
const { hasAuth } = require('../middlewares/auth-middlware');
const UserController = require('../controllers/user-controller');

const {register, findOne, login, update, remove, isExists} = require('../validations/user-validation');


router.post('/', validate(register), UserController.register);

router.get('/:id', hasAuth(['admin', 'user']), validate(findOne), isExists, UserController.findOne);

router.get('/', hasAuth(['admin', 'user']), UserController.findAll);

router.post('/login', validate(login), UserController.login);

router.put('/:id', hasAuth(['admin', 'user']), validate(update), isExists, UserController.update);

router.delete('/:id', hasAuth(['admin', 'user']), validate(remove), isExists, UserController.delete);

module.exports = router;

