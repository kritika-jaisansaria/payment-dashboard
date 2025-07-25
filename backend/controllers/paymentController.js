const Payment = require('../models/Payment');

// CREATE
exports.createPayment = async (req, res) => {
  try {
    const payment = await Payment.create({ ...req.body, userId: req.user.id });
    res.status(201).json(payment);
  } catch (err) {
    console.error('Error creating payment:', err);
    res.status(400).json({ message: err.message, errors: err.errors });
  }
};

// READ with pagination and filtering
exports.getPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category } = req.query;
    const filters = { userId: req.user.id };

    if (status) filters.status = status;
    if (category) filters.category = category;

    const payments = await Payment.find(filters)
      .sort({ deadline: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Payment.countDocuments(filters);

    res.json({
      payments,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching payments' });
  }
};

// UPDATE entire payment by ID with authorization check
exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    if (payment.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    Object.assign(payment, req.body);
    const updated = await payment.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Error updating payment', details: err.message });
  }
};

// UPDATE STATUS ONLY with authorization check
exports.updateStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    if (payment.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    payment.status = req.body.status;
    const updated = await payment.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Error updating status' });
  }
};

// DELETE with authorization check
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    if (payment.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Payment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting payment' });
  }
};
