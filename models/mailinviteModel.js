/**
 * Model to send invite mail to editor document with sendgrid.
 */
"use strict";

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const mail = {
    sendMailInvitation: async function sendMailInvitation({toMailAddress, editorUrl}) {
        const msg = {
            to: toMailAddress,
            from: 'emab21@student.bth.se', // Use the email address or domain you verified above
            subject: 'BTH editor invites you to edit a document',
            text: `${editorUrl}`,
            html: `<strong><a href="${editorUrl}">Click this link to get access to the document.</a></strong>`,
        };

        try {
            const result = await sgMail.send(msg);
            console.log('Email sent');
            return result;
        } catch (error) {
            console.error(error);
        
            if (error.response) {
            console.error(error.response.body)
            }
        }
    }
}

module.exports = mail;