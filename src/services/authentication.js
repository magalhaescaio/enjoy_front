export const isAuthenticated  = () => localStorage.getItem('OnlyOne-token') !== null

export const getToken = () => localStorage.getItem('OnlyOne-token')

export const login = token => {
    localStorage.setItem('OnlyOne-token', token)
}

export const logout = () => {
    localStorage.removeItem('OnlyOne-token')
}