const { Notification } = require('../models');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        await Notification.update({ isRead: true }, {
            where: { userId: req.user.id, isRead: false }
        });
        res.json({ message: 'Notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
