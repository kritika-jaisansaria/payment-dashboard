function generateEmail(payment, type) {
  const { paymentName, amount, deadline, category } = payment;
  const formattedDate = new Date(deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  
  let subject = '';
  let message = '';
  
  if (type === 'upcoming') {
    subject = `Reminder: Your payment "${paymentName}" is due in 2 days`;
    message = `
      <p>This is a friendly reminder that your payment is coming up soon.</p>
      <p><strong>Payment:</strong> ${paymentName}</p>
      <p><strong>Amount:</strong> ₹${amount}</p>
      <p><strong>Deadline:</strong> ${formattedDate}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p>Please make sure to complete your payment on time to avoid any late fees.</p>
    `;
  } else if (type === 'due') {
    subject = `Alert: Your payment "${paymentName}" is due today!`;
    message = `
      <p>Your payment deadline is today. Please take action immediately.</p>
      <p><strong>Payment:</strong> ${paymentName}</p>
      <p><strong>Amount:</strong> ₹${amount}</p>
      <p><strong>Deadline:</strong> ${formattedDate}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p>Don’t forget to mark it as paid once done.</p>
    `;
  } else if (type === 'overdue') {
    subject = `Urgent: Your payment "${paymentName}" is overdue!`;
    message = `
      <p>Your payment deadline has passed. Please make the payment as soon as possible.</p>
      <p><strong>Payment:</strong> ${paymentName}</p>
      <p><strong>Amount:</strong> ₹${amount}</p>
      <p><strong>Deadline:</strong> ${formattedDate}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p>Please avoid late fees by completing your payment now.</p>
    `;
  } else {
    throw new Error('Unknown email type');
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f6f6f6;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          background-color: white;
          margin: 20px auto;
          padding: 20px;
          border-radius: 6px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        h2 {
          color: #333;
        }
        p {
          font-size: 16px;
          color: #555;
          line-height: 1.5;
        }
        .button {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 24px;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #aaa;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Payment Reminder System</h2>
        <p>Hi there,</p>
        ${message}
        <a href="http://your-frontend-url.com/dashboard" class="button">View Payments</a>
        <div class="footer">
          <p>If you have any questions, reply to this email or contact support.</p>
          <p>© 2025 Payment Reminder System</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = { generateEmail };
