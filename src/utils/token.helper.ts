import {jwtDecode} from 'jwt-decode'
export function isTokenExpired(token?: string | null): boolean{
    try {
        if(!token) {
            return true;
        }

        const decoded = jwtDecode(token);
        if (!decoded) {
            return true;
        }
        return decoded.exp! < Math.floor(Date.now() / 1000);
    } catch {
        return true;
    }
}