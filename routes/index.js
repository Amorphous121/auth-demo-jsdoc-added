const router = require('express').Router();
const swaggerUI = require('swagger-ui-express');
require('../middlewares/passport');
const swaggerDoc = require('../swaggerDoc.json');
router.use("/api-docs/", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
router.use('/api/users/', require('./users-routes'));
router.use('/api/posts/', require('./posts-routes'));
router.use('/api/comments', require('./commets-routes'));

module.exports = router;