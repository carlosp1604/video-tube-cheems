export class AuthApiService {
  public async verifyEmail (email: string, sendNewToken: boolean): Promise<Response> {
    return fetch('/api/auth/users/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        sendNewToken,
      }),
    })
  }

  public async validateVerificationCode (email: string, code: string): Promise<Response> {
    return fetch(`/api/auth/users/validate-token?email=${email}&token=${code}`)
  }

  public async createUser (
    name: string,
    email: string,
    password: string,
    username: string,
    language: string,
    token: string
  ): Promise<Response> {
    return fetch('/api/auth/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        username,
        language,
        token,
      }),
    })
  }
}
