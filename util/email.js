// Sends transactional email through the MailerSend HTTP API.
// Credentials come from environment variables (see email-credentials.env, gitignored).

const sendEmail = ({ to, subject, html }) => {
    return fetch("https://api.mailersend.com/v1/email", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.MAILERSEND_API_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: { email: process.env.MAIL_FROM },
            to: [{ email: to }],
            subject: subject,
            html: html,
        }),
    }).then((res) => {
        if (!res.ok) {
            return res.text().then((body) => {
                throw new Error(`MailerSend ${res.status}: ${body}`);
            });
        }
        return res;
    });
};

exports.sendSignupEmail = (to) => {
    return sendEmail({
        to: to,
        subject: "Signup succeeded!",
        html: "<h1>You successfully signed up!</h1>",
    });
};
