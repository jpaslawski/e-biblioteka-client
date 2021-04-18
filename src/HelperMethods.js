export function signOut() {
    sessionStorage.clear();
    window.location.href = "/home";
}

export function redirectToSignIn() {
    sessionStorage.clear();
    window.location.href = "/sign-in"
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