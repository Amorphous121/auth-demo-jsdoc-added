const { validate }      = require('express-validation');

const PostController    = require('../controllers/post-controller');
const router            = require('express').Router();

const { hasAuth } = require('../middlewares/auth-middlware');
const {isExists, create, update, remove, findOne} = require('../validations/post-validation');


router.get('/', hasAuth(['admin', 'user']), PostController.findAll);

router.get('/public', PostController.findAllPublic);

router.get('/public/:id', validate(findOne), isExists, PostController.findOnePublic);

router.get('/getcomments/:id', hasAuth(['admin', 'user']), validate(findOne), isExists, PostController.getComments);

router.get('/:id', hasAuth(['admin', 'user']), validate(findOne), isExists, PostController.findOne);

router.post('/', hasAuth(['admin', 'user']), validate(create), PostController.create);

router.put('/:id', hasAuth(['admin', 'user']), validate(update), isExists, PostController.update);

router.delete('/:id', hasAuth(['admin', 'user']), validate(remove), isExists, PostController.delete);

// Route for admin to delete the post 
router.delete('/admin/:id', hasAuth(['admin']), validate(remove), isExists, PostController.delete);


module.exports = router;

