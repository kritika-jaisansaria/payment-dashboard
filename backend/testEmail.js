require('dotenv').config();
const sendEmail = require('./utils/sendEmail');
const { generateEmail } = require('./emails/templates');

// Mock payment data to test the template
const mockPayment = {
  paymentName: 'Electricity Bill',
  amount: 1200,
  deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  category: 'bills',
};

async function test() {
  try {
    // Generate HTML email using 'upcoming' template
    const htmlBody = generateEmail(mockPayment, 'upcoming');

    // Send email to your address — replace with your actual email!
    await sendEmail(
      'jaisansariakritika@gmail.com',    // <---- Replace with your email here
      'Test: Payment Reminder Email',
      htmlBody
    );

    console.log('✅ Test email sent!');
  } catch (err) {
    console.error('❌ Test email failed:', err);
  }
}

test();
