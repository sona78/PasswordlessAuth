export const handler = async (event) => {
    const expectedAnswer = event.request.privateChallengeParameters.answer
    try {
    if (event.request.challengeAnswer == expectedAnswer) {
        event.response.answerCorrect = true
        console.log('valid', expectedAnswer)
    } else {
    event.response.answerCorrect = false
    // throw new Error('Invalid OTP')
    console.log('Invalid', expectedAnswer)
    }
    } catch (error) {
    return error
    }
    return event
    }