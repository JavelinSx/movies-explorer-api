const router = require('express').Router();
const { celebrate } = require('celebrate');
const { userAuthValidation } = require('../utils/userSchemaValidation');
const {
  getUserInfo,
  updateUserInfo,
} = require('../controllers/users');

router.get('/me', celebrate(userAuthValidation), getUserInfo);
router.patch('/me', celebrate(userAuthValidation), updateUserInfo);

module.exports = router;
