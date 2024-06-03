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

| HTTP Code | Code                                                         | Message                                                                                                                              |
|-----------|--------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------| 
| 400       | ``user-request-validation-exception``                        | Invalid request body. This message will be accompanied by the ``errors`` field that will indicate the specific errors in the request |
| 404       | ``user-user-resource-not-found``                             | User associated to given email was not found                                                                                         |
| 409       | ``user-conflict-token-already-issued``                       | Verification token for user with email ``email`` was already sent                                                                    |
| 409       | ``user-conflict-email-already-registered``                   | ``email`` is already registered                                                                                                      |
| 422       | ``user-unprocessable-entity-cannot-send-verification-token`` | Verification token for user with email ``email`` could not be sent                                                                   |
| 422       | ``user-unprocessable-entity-invalid-email``                  | Verification token for user with email ``email`` could not be created                                                                |
| 422       | ``user-unprocessable-entity-invalid-email-token-type``       | Cannot create verification token due to invalid email address: ``email``                                                             |
| 500       | ``user-server-error``                                        | Something went wrong while processing request                                                                                        |

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

| HTTP Code | Code                                  | Message                                                                                                                         |
|-----------|---------------------------------------|---------------------------------------------------------------------------------------------------------------------------------| 
| 400       | ``user-bad-request``                  | email and token parameters are required                                                                                         |
| 400       | ``user-request-validation-exception`` | Invalid request. This message will be accompanied by the ``errors`` field that will indicate the specific errors in the request |
| 401       | ``user-unauthorized-invalid-token``   | Token is invalid, expired or cannot be used for the required operation                                                          |
| 404       | ``user-token-resource-not-found``     | Token not found. Either because the token does not exist, is expired, or cannot be used in this context                         |
| 500       | ``user-server-error``                 | Something went wrong while processing request                                                                                   |


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

| HTTP Code | Code                                           | Message                                                                                                                              |
|-----------|------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------| 
| 400       | ``user-request-validation-exception``          | Invalid request body. This message will be accompanied by the ``errors`` field that will indicate the specific errors in the request |
| 401       | ``user-unauthorized-invalid-token``            | Token is invalid or expired                                                                                                          |
| 409       | ``user-conflict-email-already-registered``     | Email: ``email`` is already registered                                                                                               |
| 409       | ``user-conflict-username-already-registered``  | Username: ``username`` is already registered                                                                                         |
| 422       | ``user-unprocessable-entity-invalid-name``     | Invalid name: ``name``                                                                                                               |
| 422       | ``user-unprocessable-entity-invalid-username`` | Invalid username: ``username``                                                                                                       |
| 422       | ``user-unprocessable-entity-invalid-email``    | Invalid email: ``email``                                                                                                             |
| 422       | ``user-unprocessable-entity-invalid-password`` | Invalid password: ``password``                                                                                                       |
| 500       | ``user-server-error``                          | Something went wrong while processing request                                                                                        |

### Change user password
To change the user account password you have to send the user email and the new password along with the token you received in your email address.

```
PATCH /api/auth/users/{userEmail}/change-password
```

```
{
  "password": string
  "token": string
}
```

| Parameter | Required   | Type/Possible values |
|-----------|------------|----------------------| 
| userEmail | ``true``   | ``string``           |
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

| HTTP Code | Code                                           | Message                                                                                                                               |
|-----------|------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------| 
| 400       | ``user-bad-request``                           | userEmail parameter is required                                                                                                       |
| 400       | ``user-request-validation-exception``          | Invalid request body. This message will be accompanied by the ``errors`` field that will indicate the specific errors in the request  |
| 401       | ``user-unauthorized-invalid-token``            | Token is invalid or expired                                                                                                           |
| 404       | ``user-user-resource-not-found``               | User associated to token was not found                                                                                                |
| 422       | ``user-unprocessable-entity-invalid-password`` | Provided password is not valid                                                                                                        |
| 500       | ``user-server-error``                          | Something went wrong while processing request                                                                                         |

### Get logged user data
This endpoint returns the information of the logged user. Before calling to this endpoint you must sign in.

```
GET /api/auth
```


#### Responses
The following body will be returned if everything is ok.

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

| HTTP Code | Code                               | Message                                        |
|-----------|------------------------------------|------------------------------------------------| 
| 401       | ``user-authentication-required``   | User not authenticated                         |
| 404       | ``user-user-resource-not-found``   | User with ID `userId` was not found            |
| 500       | ``user-server-error``              | Something went wrong while processing request  |

### Get user data by its username
To get the data from a specific user you must provide its username

```
GET /api/users/{username}
```

| Parameter | Required   | Type/Possible values |
|-----------|------------|----------------------| 
| username  | ``true``   | ``string``           |


#### Responses
The following body will be returned if everything is ok.

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

| HTTP Code | Code                                  | Message                                                                                                                         |
|-----------|---------------------------------------|---------------------------------------------------------------------------------------------------------------------------------| 
| 400       | ``user-bad-request``                  | username parameter is required                                                                                                  |
| 400       | ``user-bad-request``                  | Invalid request. This message will be accompanied by the ``errors`` field that will indicate the specific errors in the request |
| 404       | ``user-request-validation-exception`` | User with username {username} was not found                                                                                     |
| 500       | ``user-server-error``                 | Something went wrong while processing request                                                                                   |

### Get posts
To get a list of posts you must provide some parameters

```
GET /api/posts?order={order}&orderBy={orderBy}&{...filters}
```

| Parameter | Required | Type/Possible values |
|-----------|----------|----------------------| 
| order     | ``true`` | ``asc``, ``desc``    |
| orderBy   | ``true`` | ``string``           |
| filters   | ``true`` | ``array``            |

Filters should be sent like: ``filterType=value``. Example:

```
GET /api/posts?order=asc&orderBy=postTitle&postTitle=some post title
```

#### Responses
The next body will be returned if everything is ok.

```
{
    posts: [
        {
            post: {
                id: string
                title: string
                description: string
                publishedAt: string
                producer: {
                    id: string
                    name: string
                    description: string
                    imageUrl: string | null
                    parentProducerId: string | null 
                    brandHexColor: string
                    createdAt: string
                    parentProducer: {
                        id: string
                        name: string
                        description: string
                        imageUrl: string | null
                        parentProducerId: string | null 
                        brandHexColor: string
                        createdAt: string
                        parentProducer: null 
                    } | null, 
                } | null,
                meta: [
                    {
                        type: string
                        value: string
                        postId: string
                        createdAt: string
                    },
                    ...
                ]
                createdAt: string
            },
            postRections: number,
            postComments: number,
            postViews: number 
        },
        ...
    ],
    postsNumber: number
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

| HTTP Code | Code                                                   | Message                                                                                                                         |
|-----------|--------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------| 
| 400       | ``post-validation-exception``                          | Invalid request. This message will be accompanied by the ``errors`` field that will indicate the specific errors in the request |
| 422       | ``post-unprocessable-entity-invalid-sorting-criteria`` | Sorting criteria `sortingCriteria` is not a valid sorting criteria                                                              |
| 422       | ``post-unprocessable-entity-invalid-sorting-option``   | Sorting option `sortingOption` is not a valid sorting option                                                                    |
| 422       | ``post-unprocessable-entity-invalid-filter-type``      | Filter `filter` is not a valid filter                                                                                           |
| 422       | ``post-unprocessable-entity-invalid-filter-value``     | Filter must be a not empty string and must not include special characters                                                       |
| 422       | ``post-unprocessable-entity-invalid-per-page``         | PerPage must be a positive integer in range 10 - 256                                                                            |
| 422       | ``post-unprocessable-entity-invalid-page``             | Page must be a integer greater or equal to 0                                                                                    |
| 500       | ``post-server-error``                                  | Something went wrong while processing request                                                                                   |

### Add a post comment
Add a new post comment providing the postId and the comment text

*NOTE: AUTHENTICATION IS REQUIRED*
```
POST /api/posts/{postId}/comments
```

```
{
  "comment": string
}
```

| Parameter | Required | Type/Possible values |
|-----------|----------|----------------------| 
| postId    | ``true`` | ``string``           |
| comment   | ``true`` | ``string``           |


#### Responses
The next body will be returned if everything is ok.

```
{
    id: string
    comment: string
    postId: string
    userId: string
    createdAt: string
    updatedAt: string
    user: {
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

| HTTP Code | Code                                     | Message                                                                                                                         |
|-----------|------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------| 
| 400       | ``post-comment-bad-request``             | postId and comment parameters are required                                                                                      |
| 400       | ``post-comment-validation-exception``    | Invalid request. This message will be accompanied by the ``errors`` field that will indicate the specific errors in the request |
| 401       | ``post-comment-authentication-required`` | User must be authenticated to access to resource                                                                                |
| 404       | ``post-comment-post-not-found``          | Post with ID `postId` was not found                                                                                             |
| 500       | ``post-comment-server-error``            | Something went wrong while processing request                                                                                   |

### Add a post child comment (reply)
Add a new post child comment providing the postId, commentId and the comment text

*NOTE: AUTHENTICATION IS REQUIRED*
```
POST /api/posts/{postId}/comments/{commentId}/children
```

```
{
  "comment": string
}
```

| Parameter | Required | Type/Possible values |
|-----------|----------|----------------------| 
| postId    | ``true`` | ``string``           |
| commentId | ``true`` | ``string``           |
| comment   | ``true`` | ``string``           |


#### Responses
The next body will be returned if everything is ok.

```
{
    id: string
    comment: string
    parentCommentId: string
    userId: string
    createdAt: string
    updatedAt: string
    user: {
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

| HTTP Code | Code                                             | Message                                                                                                                           |
|-----------|--------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------| 
| 400       | ``post-child-comment-bad-request``               | commentId, postId and comment parameters are required                                                                             |
| 400       | ``post-child-comment-validation-exception``      | Invalid request. This message will be accompanied by the ``errors`` field that will indicate the specific errors in the request   |
| 401       | ``post-child-comment-authentication-required``   | User must be authenticated to access to resource                                                                                  |
| 404       | ``post-child-comment-post-not-found``            | Post with ID `postId` was not found                                                                                               |
| 404       | ``post-child-comment-parent-comment-not-found``  | PostComment with ID `postCommentId` was not found                                                                                 |
| 500       | ``post-child-comment-server-error``              | Something went wrong while processing request                                                                                     |

### Delete a post comment
To delete a post comment from a post you must provide postId and commentId

*NOTE: AUTHENTICATION IS REQUIRED*
```
DELETE /api/posts/{postId}/comments/{commentId}
```

| Parameter | Required | Type/Possible values |
|-----------|----------|----------------------| 
| postId    | ``true`` | ``string``           |
| commentId | ``true`` | ``string``           |


#### Responses
If post comment is removed correctly a 204 No Content will be returned.


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

| HTTP Code | Code                                            | Message                                                                                                                         |
|-----------|-------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------| 
| 400       | ``post-comment-bad-request``                    | postId and commentId parameters are required                                                                                    |
| 400       | ``post-comment-validation-exception``           | Invalid request. This message will be accompanied by the ``errors`` field that will indicate the specific errors in the request |
| 401       | ``post-comment-authentication-required``        | User must be authenticated to access to resource                                                                                |
| 403       | ``post-comment-forbidden``                      | User does not have access to the resource                                                                                       |
| 404       | ``post-comment-post-not-found``                 | Post with ID `postId` was not found                                                                                             |
| 404       | ``post-comment-post-comment-not-found``         | Post comment with ID `postId` was not found                                                                                     |
| 409       | ``post-comment-conflict-cannot-delete-comment`` | Cannot delete comment with ID `postCommentId` from it's post or parent                                                          |
| 500       | ``post-comment-server-error``                   | Something went wrong while processing request                                                                                   |

### Delete a post child comment (reply)
To delete a post child comment from a parent comment you must provide postId, commentId and childCommentId

*NOTE: AUTHENTICATION IS REQUIRED*
```
DELETE /api/posts/{postId}/comments/{commentId}/children/{childCommentId}
```

| Parameter      | Required | Type/Possible values |
|----------------|----------|----------------------| 
| postId         | ``true`` | ``string``           |
| commentId      | ``true`` | ``string``           |
| childCommentId | ``true`` | ``string``           |


#### Responses
If post child comment is removed correctly a 204 No Content will be returned.


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

| HTTP Code | Code                                                 | Message                                                                                                                         |
|-----------|------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------| 
| 400       | ``post-child-comment-bad-request``                   | postId, commentId and childCommentId parameters are required                                                                    |
| 400       | ``post-child-comment-validation-exception``          | Invalid request. This message will be accompanied by the ``errors`` field that will indicate the specific errors in the request |
| 401       | ``post-child-comment-authentication-required``       | User must be authenticated to access to resource                                                                                |
| 403       | ``post-child-comment-forbidden-resource``            | User does not have access to the resource                                                                                       |
| 404       | ``post-child-comment-post-not-found``                | Post with ID `postId` was not found                                                                                             |
| 404       | ``post-child-comment-parent-comment-not-found``      | Parent comment with ID `postId` was not found                                                                                   |
| 404       | ``post-child-comment-post-comment-not-found``        | Post comment with ID `postId` was not found                                                                                     |
| 409       | ``post-child-comment-cannot-delete-child-comment``   | Cannot delete comment with ID `postCommentId` from it's post or parent                                                          |
| 500       | ``post-child-comment-server-error``                  | Something went wrong while processing request                                                                                   |

### Create a post reaction (ONLY LIKE IS SUPPORTED)
Create a new reaction given the postId and the reactionType (at the moment only LIKE type is supported)

*NOTE: AUTHENTICATION IS REQUIRED*
```
POST /api/posts/{postId}/reactions
```

| Parameter    | Required | Type/Possible values |
|--------------|----------|----------------------| 
| postId       | ``true`` | ``string``           |
| reactionType | ``true`` | ``string``           |


#### Responses
If post reaction is created you will get a 201 Created with the following body:

``` 
{
    postId: string
    userId: string
    reactionType: string
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

| HTTP Code | Code                                               | Message                                                                                                                         |
|-----------|----------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------| 
| 400       | ``post-reaction-bad-request``                      | postId parameter is required                                                                                                    |
| 400       | ``post-reaction-validation-exception``             | Invalid request. This message will be accompanied by the ``errors`` field that will indicate the specific errors in the request |
| 401       | ``post-reaction-authentication-required``          | User must be authenticated to access to resource                                                                                |
| 404       | ``post-reaction-post-not-found``                   | Post with ID `postId` was not found                                                                                             |
| 409       | ``post-reaction-conflict-reaction-already-exists`` | User with ID `userId` already reacted to post with ID `postId`                                                                  |
| 500       | ``post-reaction-server-error``                     | Something went wrong while processing request                                                                                   |

### Delete a post reaction 
You can remove a post reaction providing the postId.

*NOTE: AUTHENTICATION IS REQUIRED*
```
DELETE /api/posts/{postId}/reactions
```

| Parameter    | Required | Type/Possible values |
|--------------|----------|----------------------| 
| postId       | ``true`` | ``string``           |


#### Responses
If post reaction is removed a 204 No Content will be returned.

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

| HTTP Code | Code                                               | Message                                                                                                                         |
|-----------|----------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------| 
| 400       | ``post-reaction-bad-request``                      | postId parameter is required                                                                                                    |
| 400       | ``post-reaction-validation-exception``             | Invalid request. This message will be accompanied by the ``errors`` field that will indicate the specific errors in the request |
| 404       | ``post-reaction-post-not-found``                   | Post with ID `postId` was not found                                                                                             |
| 404       | ``post-reaction-reaction-not-found``               | User with ID `userId` has not reacted to post with ID `postId`                                                                  |
| 500       | ``post-reaction-server-error``                     | Something went wrong while processing request                                                                                   |
