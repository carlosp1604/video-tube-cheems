This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


## API Docs

### Verification tokens
In order to create a user account or retrieve user password, first you need to get a verification token.

The token will be sent to your email address.

```
POST /api/auth/users/verify-email
```

```
{
  "type": string
  "email": string
  "sendNewToken": boolean
}
```

| Parameter    | Required   | Type/Possible values                      |
|--------------|------------|-------------------------------------------| 
| type         | ``true``   | ``create-account``, ``retrieve-password`` |
| email        | ``true``   | ``string``                                |
| sendNewToken | ``true``   | ``boolean``                               |


#### Responses
If token was created and sent you will receive a 201 Created.

Otherwise, you will receive an error message


```
{
    "code": string
    "message": string
    "errors": [
        {
            "message": string
            "parameter": string
        },
        ...
    ]
}
```

| HTTP Code | Code                                                       | Message                                                                                                                         |
|-----------|------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------| 
| 400       | ``verify-email-address-bad-request``                       | Invalid request. This message will be accompanied by the ``error`` field that will indicate the specific errors in the request  |
| 404       | ``verify-email-address-not-found``                         | User associated to given email was not found                                                                                    |
| 409       | ``verify-email-address-conflict-token-already-issued``     | Verification token for user with email ``email`` was already sent                                                               |
| 409       | ``verify-email-address-conflict-email-already-registered`` | ``email`` is already registered                                                                                                 |
| 422       | ``verify-email-address-cannot-create-verification-token``  | Verification token for user with email ``email`` could not be created                                                           |
| 422       | ``verify-email-address-cannot-send-verification-token``    | Verification token for user with email ``email`` could not be sent                                                              |
| 422       | ``verify-email-address-invalid-email``                     | Verification token for user with email ``email`` could not be created                                                           |
| 422       | ``verify-email-address-invalid-token-type``                | Cannot create verification token due to invalid email address: ``email``                                                        |
| 500       | ``verify-email-address-internal-server-error``             | Something went wrong while processing request                                                                                   |

### Validate Token
When a token is created its lifetime is 30 min. In order to validate the token you receive in your email address you can call to this endpoint with the user email and the token.

```
GET /api/auth/users/validate-token?email={email}&token={token}
```

| Parameter    | Required   | Type/Possible values |
|--------------|------------|----------------------| 
| email        | ``true``   | ``string``           |
| token        | ``true``   | ``string``           |


#### Responses
If token is still valid you will receive a 200 with the token data in the body

Otherwise, you will receive an error message


```
{
    "code": string
    "message": string
    "errors": [
        {
            "message": string
            "parameter": string
        },
        ...
    ]
}
```

| HTTP Code | Code                                       | Message                                                                                                                          |
|-----------|--------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------| 
| 400       | ``validate-token-bad-request``             | Invalid request. This message will be accompanied by the ``error`` field that will indicate the specific errors in the request   |
| 404       | ``validate-token-not-found``               | Token not found. Either because the token does not exist, is expired, or cannot be used in this context                          |
| 500       | ``validate-token-internal-server-error``   | Something went wrong while processing request                                                                                    |


### Create user
To create a user account you have to send all the required data along with the token you received in your email address.

```
POST /api/auth/users
```

```
{
  "name": string
  "email": string
  "password": string
  "username": string
  "language": string
  "token": string
}
```

| Parameter | Required   | Type/Possible values |
|-----------|------------|----------------------| 
| name      | ``true``   | ``string``           |
| email     | ``true``   | ``string``           |
| password  | ``true``   | ``string``           |
| username  | ``true``   | ``string``           |
| language  | ``true``   | ``string``           |
| token     | ``true``   | ``string``           |



#### Responses
If user was created you will receive a 201 Created.

Otherwise, you will receive an error message


```
{
    "code": string
    "message": string
    "errors": [
        {
            "message": string
            "parameter": string
        },
        ...
    ]
}
```

| HTTP Code | Code                                                  | Message                                                                                                                        |
|-----------|-------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------| 
| 400       | ``create-user-bad-request``                           | Invalid request. This message will be accompanied by the ``error`` field that will indicate the specific errors in the request |
| 401       | ``create-user-unauthorized``                          | Token is invalid or expired                                                                                                    |
| 409       | ``create-user-conflict-email-already-registered``     | Email: ``email`` is already registered                                                                                         |
| 409       | ``create-user-conflict-username-already-registered``  | Username: ``username`` is already registered                                                                                   |
| 422       | ``create-user-unprocessable-entity-invalid-name``     | Invalid name: ``name``                                                                                                         |
| 422       | ``create-user-unprocessable-entity-invalid-username`` | Invalid username: ``username``                                                                                                 |
| 422       | ``create-user-unprocessable-entity-invalid-email``    | Invalid email: ``email``                                                                                                       |
| 422       | ``create-user-unprocessable-entity-invalid-password`` | Invalid password: ``password``                                                                                                 |
| 500       | ``verify-email-address-internal-server-error``        | Something went wrong while processing request                                                                                  |

### Change user password
To change the user account password you have to send the user email and the new password along with the token you received in your email address.

```
PATCH /api/auth/users/change-password
```

```
{
  "email": string
  "password": string
  "token": string
}
```

| Parameter | Required   | Type/Possible values |
|-----------|------------|----------------------| 
| email     | ``true``   | ``string``           |
| password  | ``true``   | ``string``           |
| token     | ``true``   | ``string``           |



#### Responses
If user account password was changed correctly you will receive a 204.

Otherwise, you will receive an error message


```
{
    "code": string
    "message": string
    "errors": [
        {
            "message": string
            "parameter": string
        },
        ...
    ]
}
```

| HTTP Code | Code                                                  | Message                                                                                                                        |
|-----------|-------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------| 
| 400       | ``change-user-password-bad-request``                  | Invalid request. This message will be accompanied by the ``error`` field that will indicate the specific errors in the request |
| 401       | ``change-user-password-unauthorized``                 | Token is invalid or expired                                                                                                    |
| 404       | ``change-user-password-not-found``                    | User associated to token was not found                                                                                         |
| 422       | ``change-user-password-unprocessable-entity``         | Provided password is not valid                                                                                                 |
| 500       | ``change-user-password-internal-server-error``        | Something went wrong while processing request                                                                                  |

### Get logged user data
This endpoint returns the information of the logged user. Before calling to this endpoint you must sign in.

```
GET /api/auth
```


#### Responses
The next body will be returned if everything is ok.

```
{
    id: string
    name: string
    username: string
    email: string
    imageUrl: string | null
    language: string
    emailVerified: string | null
    createdAt: string
    updatedAt: string
}
```

Otherwise, you will receive an error message


```
{
    "code": string
    "message": string
}
```

| HTTP Code | Code                                 | Message                                       |
|-----------|--------------------------------------|-----------------------------------------------| 
| 401       | ``get-user-authentication-required`` | User not authenticated                        |
| 404       | ``get-user-resource-not-found``      | User with ID {userId} was not found           |
| 500       | ``get-user-server-error``            | Something went wrong while processing request |

### Get user data by its username
To get the data from an specific user you must provide its username

```
GET /api/users/{username}
```

| Parameter | Required   | Type/Possible values |
|-----------|------------|----------------------| 
| username  | ``true``   | ``string``           |


#### Responses
The next body will be returned if everything is ok.

```
{
    id: string
    name: string
    username: string
    email: string
    imageUrl: string | null
    language: string
    emailVerified: string | null
    createdAt: string
    updatedAt: string
}
```

Otherwise, you will receive an error message


```
{
    "code": string
    "message": string
    "errors": [
        {
            "message": string
            "parameter": string
        },
        ...
    ]
}
```

| HTTP Code | Code                            | Message                                                                                                                        |
|-----------|---------------------------------|--------------------------------------------------------------------------------------------------------------------------------| 
| 400       | ``get-user-bad-request``        | Invalid request. This message will be accompanied by the ``error`` field that will indicate the specific errors in the request |
| 404       | ``get-user-resource-not-found`` | User with username {username} was not found                                                                                    |
| 500       | ``get-user-server-error``       | Something went wrong while processing request                                                                                  |