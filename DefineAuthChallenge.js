export const handler = async (event) => {
    try {
    // If user is not registered
    if (event.request.userNotFound) {
    event.response.failAuthentication = true
    event.response.issueTokens = false
    throw new Error('User does not exist')
    }
    // Wrong otp even after 3 session
    if (event.request.session &&
    event.request.session.length >= 3 &&
    event.request.session.slice(-1)[0].challengeResult === false) 
    {
    event.response.failAuthentication = true
    event.response.issueTokens = false
    throw new Error('Invalid OTP')
    } else if (
    event.request.session &&
    event.request.session.length > 0 &&
    event.request.session.slice(-1)[0].challengeResult === true) 
    {
    event.response.failAuthentication = false
    event.response.issueTokens = true
    // The user provided the right answer; succeed auth
    console.log('Correct OTP!')
    } else {
    event.response.challengeName = 'CUSTOM_CHALLENGE'
    event.response.failAuthentication = false
    event.response.issueTokens = false
    // The user did not provide a correct answer yet; present challenge
    console.log('not yet received correct OTP')
    }
    } catch (error) {
    return error
    }
    return event
    }