// export const BASE_URL = "http://localhost:6010"
export const BASE_URL = "https://employee-managment-backend-theta.vercel.app"

export const profileImageUrl = (profile) =>
  /^https?:\/\//i.test(profile || "")
    ? profile
    : `${BASE_URL}/uploads/${profile}`
