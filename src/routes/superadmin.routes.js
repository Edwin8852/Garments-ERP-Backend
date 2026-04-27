const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superadmin.controller');
const { verifyToken, authorize } = require('../middleware/auth.middleware');

// Protect all routes with SUPER_ADMIN requirement
router.use(verifyToken);
router.use(authorize(['SUPER_ADMIN']));

router.get('/stats', superAdminController.getGlobalStats);
router.patch('/users/:id/role', superAdminController.updateUserRole);
router.delete('/users/:id', superAdminController.deleteUser);

module.exports = router;
