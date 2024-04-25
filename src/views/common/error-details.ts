export function getErrorDescription(error: any) {
    if (error && error.status === 401) {
        return 'This error usually happens when the API token is invalid or expired. Try to update it using the option below.'
    }

    if (error && error.status === 400) {
        return 'This error usually happens when Todoist could not process the request.'
    }

    if (error && error.status >= 500) {
        return 'The Todoist servers may be currently unavailable.'
    }

    if (error && !error.status) {
        return 'We were not able to reach the Todoist servers. Please check your internet connection and try again.'
    }

    return 'An unknown error occurred.'
}
