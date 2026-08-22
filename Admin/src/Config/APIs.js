// export const API_ENDPOINT = "http://localhost:6969/api";
export const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export const API_DATA = {
    forgotPassword: '/auth_admin/forgot-password',
    changePassword: '/auth_admin/change-password',
    reservations_admin: 'reservations_t_admin',
    statistical: '/statistical'
}