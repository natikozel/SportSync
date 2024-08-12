import {redirect} from "react-router-dom";

export function getEmailDuration(): number | null {
    const storedExpirationDate = localStorage.getItem('expiration');

    if (storedExpirationDate === null) {
        return null;
    }

    const expirationDate: Date = new Date(storedExpirationDate);
    const currentDate: Date = new Date();
    return expirationDate.getTime() - currentDate.getTime();
}

export function checkAuthLoader() {
    const token = getAuthEmail();

    if (!token) {
        return redirect('/');
    }

    return null;
}

export function getAuthEmail() {
    const emailUser = localStorage.getItem('email');

    if (!emailUser) {
        return null;
    }

    const tokenDuration: number | null = getEmailDuration();

    if (tokenDuration && tokenDuration < 0) {
        return 'EXPIRED';
    }

    return emailUser;
}

export function loaderEmailUser() {
    return getAuthEmail();
}