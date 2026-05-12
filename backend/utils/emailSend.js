const { jsPDF }= require('jspdf');
const nodemailer = require('nodemailer');
const dataParserForItems = require('./dataParser');
require('jspdf-autotable');

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'ldead4524@gmail.com',
        pass: process.env.EMAIL_PASS || 'cppqyjfnxyhrxkzq'
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////
// generating PDF Data 
function generatePDF(data) {
    const doc = new jsPDF({
      orientation : "vertical"
    });
    doc.setFontSize(32)

    doc.text("Your Expenses In Last One Month !!" , 100 , 20,'center')
    doc.setLineWidth(2)
    doc.line(20, 25, 170, 25);

    doc.setFontSize(22)
    doc.autoTable({
      body : data.body , 
      theme : 'grid',
      startY : 40,
      head : [['S.No','Date','Amount','Category']],
      foot : [['','Total',data.total,'']],
      styles: { 
          // fillColor:  [0,0,0] ,
          textColor : [0,0,0],
          fontSize : 14
      },
    })


    return doc.output("dataurlstring").split(',')[1];
}


// Function to send the email with the generated PDF as an attachment
async function sendEmailWithAttachment( recipient,items) {
    let body = dataParserForItems(items)
    const pdfContent = generatePDF(body)

    const mailOptions = {
        from: process.env.EMAIL_USER || 'ldead4524@gmail.com' , 
        to: recipient,
        subject: 'Expense Report for This Month',
        text: 'Please find your expense report attached.',
        attachments: [
          {
            filename: 'expense_report.pdf',
            content: pdfContent,
            encoding : 'base64'
          },
        ],
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

// Function to send split expense invites to friends
async function sendSplitInvites(creatorName, creatorEmail, recipients, expenseDetails) {
    const { amount, category, description, date, splitAmount } = expenseDetails;

    for (let recipientEmail of recipients) {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'ldead4524@gmail.com',
            to: recipientEmail,
            subject: `💰 ${creatorName} wants to split an expense with you!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-bottom: 20px;">💰 You've been added to a split expense!</h2>
                        
                        <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
                            <strong>${creatorName}</strong> (<code>${creatorEmail}</code>) has created a split expense and added you.
                        </p>
                        
                        <div style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #3b82f6; border-radius: 5px; margin-bottom: 20px;">
                            <p style="margin: 5px 0;"><strong>Category:</strong> ${category}</p>
                            <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${amount}</p>
                            <p style="margin: 5px 0;"><strong>Your Share:</strong> <span style="color: #e74c3c; font-weight: bold;">₹${splitAmount}</span></p>
                            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-IN')}</p>
                            ${description ? `<p style="margin: 5px 0;"><strong>Description:</strong> ${description}</p>` : ''}
                        </div>
                        
                        <p style="color: #666; font-size: 14px; margin-top: 20px;">
                            ⚠️ <strong>Note:</strong> This is just a notification. Please coordinate with ${creatorName} to settle the payment.
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        
                        <p style="color: #999; font-size: 12px; margin: 0;">
                            Sent from Expense Tracker • Do not reply to this email
                        </p>
                    </div>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Split invite sent to ${recipientEmail}`);
        } catch (error) {
            console.error(`Error sending split invite to ${recipientEmail}:`, error);
        }
    }
}

module.exports = { sendEmailWithAttachment, sendSplitInvites };
