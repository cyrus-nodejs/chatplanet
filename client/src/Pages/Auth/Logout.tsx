import Cookies from 'js-cookie';

export const Logout = () => {
Cookies.remove('accessToken')
Cookies.remove('token')
}