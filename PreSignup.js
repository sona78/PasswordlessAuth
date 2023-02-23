export const handler = async (event) => {
    event.response.autoConfirmUser = true
    // Set the SMS as verified if it is in the request
    // Set the email as verified if it is in the request
    if (event.request.userAttributes.hasOwnProperty('email')) {
    event.response.autoVerifyEmail = true
    }
    return event
    }