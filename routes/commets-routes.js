const router        = require('express').Router();
const { validate }  = require('express-validation');
const { hasAuth } = require('../middlewares/auth-middlware')
const CommentController = require('../controllers/comment-controller');
const { isExists, remove, update, create, findOne } = require('../validations/comment-validation');



router.get('/:id', hasAuth(['admin', 'user']), validate(findOne), isExists, CommentController.findOne);

router.get('/', hasAuth(['admin', 'user']), CommentController.findAll);

router.post('/', hasAuth(['admin', 'user']), validate(create), CommentController.create);

router.put('/:id', hasAuth(['admin', 'user']), validate(update), isExists, CommentController.update);

router.delete('/:id', hasAuth(['admin', 'user']), validate(remove), isExists, CommentController.delete);

module.exports = router;

