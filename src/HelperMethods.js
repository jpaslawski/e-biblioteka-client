import { USER_PERMISSIONS } from "./Constants";

export function signOut() {
    sessionStorage.clear();
    window.location.href = "/home";
}

export function redirectToSignIn() {
    sessionStorage.clear();
    window.location.href = "/sign-in"
}

export function redirectHome() {
    window.location.href = "/home"
}

export function getUserPermissions() {
    if(sessionStorage.getItem("token") !== null) {
        const token = sessionStorage.getItem("token");
        let jwtData = token.split('.')[1];
        let decodedJwtJsonData = window.atob(jwtData);
        let decodedJwtData = JSON.parse(decodedJwtJsonData);
        return decodedJwtData.role;
    }

    return null;
}

export function handleErrorResponse(response) {
    if(!response) {
        return "Błąd serwera!"
    } else if(response.status === 500) {
        signOut()
    } else {
        return response.data.message
    }
}

export function sortAlphabetically(set) {
    return set.sort(function (a, b) {
        if (a < b) { return -1; }
        if (a > b) { return 1; }
        return 0;
    })
}

export function transformUserRole(userRole) {
    switch(userRole) {
        case USER_PERMISSIONS.student:
            return "Student"
        case USER_PERMISSIONS.librarian:
            return "Bibliotekarz"
        default:
            return "Student"
    }
}

export function transformLongText(text) {
    if(text.length > 50) {
        return text.substring(0, 50) + "..."
    } else {
        return text
    }
}