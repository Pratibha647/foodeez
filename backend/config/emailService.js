const nodemailer = require("nodemailer");

/**
 * Validates an email address.
 * @param {string} email 
 * @returns {boolean}
 */
const isValidEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Sends a recipe submission confirmation email.
 * @param {string} toEmail - Recipient email address
 * @param {string} recipeTitle - The name of the recipe
 * @param {string} category - Category of the recipe
 * @returns {Promise<boolean>} - Resolves to true if email sent successfully, false otherwise
 */
const sendRecipeConfirmation = async (toEmail, recipeTitle, category) => {
    // 1. Security & validation check
    if (!isValidEmail(toEmail)) {
        console.error(`[Email Service Error]: Invalid recipient email address: "${toEmail}"`);
        return false;
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
        console.warn("[Email Service Warning]: EMAIL_USER or EMAIL_PASS environment variables are not configured. Skipping email sending.");
        return false;
    }

    try {
        // 2. Initialize transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: emailUser,
                pass: emailPass
            }
        });

        // 3. Format dynamic date
        const submissionDate = new Date().toLocaleDateString("en-US", {
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        });

        // 4. Set up email details
        const mailOptions = {
            from: `"Team Foodeez" <${emailUser}>`,
            to: toEmail,
            subject: "Recipe Submitted Successfully 🍽️",
            text: `Hello,

Your recipe has been successfully submitted to Foodeez.

Recipe Details:

* Recipe Name: ${recipeTitle}
* Category: ${category}
* Submission Date: ${submissionDate}

Thank you for contributing to the Foodeez community.

Happy Cooking! 🍴
Team Foodeez`
        };

        // 5. Send email
        const info = await transporter.sendMail(mailOptions);
        console.log(`[Email Service]: Email confirmation sent successfully. Message ID: ${info.messageId}`);
        return true;
    } catch (err) {
        console.error(`[Email Service Error]: Failed to send email confirmation: ${err.message}`);
        return false;
    }
};

module.exports = {
    sendRecipeConfirmation
};
