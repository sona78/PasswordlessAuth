import { createRequire } from 'module' 
const require = createRequire(import.meta.url);
const AWS = require('aws-sdk')
var https = require('https')


export const handler = async (event) => {
  let secretLoginCode
  if (!event.request.session || !event.request.session.length) {
  // or you can use email also
  const email= event.request.userAttributes.email
  secretLoginCode = Math.floor(100000 + Math.random() * 900000)
  // This is a new auth session         
  // Generate a new secret login code and SMS or mail it to the user
  
  await sendEmail(email, secretLoginCode)
    
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
  
  console.log(event);
  return event
}

function sendEmail(emailAddress, secretLoginCode) {
    return new Promise((resolve, reject) => {
      //Postman Output in Node.js - Native
    })
}
