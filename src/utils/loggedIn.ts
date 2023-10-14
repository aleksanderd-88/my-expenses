export const loggedIn = (): boolean => {
  const userString = localStorage.getItem('__user__')
  return !!userString
}