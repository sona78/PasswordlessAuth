import { createRequire } from 'module' 
const require = createRequire(import.meta.url);
const AWS = require('aws-sdk')
const { SES } = require('aws-sdk');

const ses = new SES();

export const handler = async (event) => {
let secretLoginCode
if (!event.request.session || !event.request.session.length) {
// or you can use email also
const email= event.request.userAttributes.email
secretLoginCode = Math.floor(100000 + Math.random() * 900000)
// This is a new auth session         
// Generate a new secret login code and SMS or mail it to the user

await sendEmail(email, secretLoginCode) // in case of email


} else {
// re-use code generated in previous challenge
const previousChallenge = event.request.session.slice(-1)[0]
secretLoginCode = previousChallenge.challengeMetadata.match(/CODE-(\d*)/)[1]
}
// or  in case of email
event.response.publicChallengeParameters = { email: event.request.userAttributes.email}
// Add the secret login code to the private challenge parameters
// so it can be verified by the "Verify Auth Challenge Response" 
event.response.privateChallengeParameters = {answer: 
secretLoginCode}
// Add the secret login code to the session so it is available
event.response.challengeMetadata = `CODE-${secretLoginCode}`
return event
}

async function sendEmail(emailAddress, secretLoginCode) {
    const params = {
        Destination: { ToAddresses: [emailAddress] },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `<html><body><p>This is your secret login code:</p>
                           <h3>${secretLoginCode}</h3></body></html>`
                },
                Text: {
                    Charset: 'UTF-8',
                    Data: `Your secret login code: ${secretLoginCode}`
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Your secret login code'
            }
        },
        Source: "betterwager@gmail.com"
    };
    await ses.sendEmail(params).promise();
}