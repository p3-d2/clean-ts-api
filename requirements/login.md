# Login

> ## Success case

1. ✅ Receives a request of type **POST** in the route **/api/login**
2. ✅ Validates mandatory data **email** and **password**
3. ✅ Validates that the field **email** is a valid email
4. ✅ **Search** the user with the email and password provided
5. ✅ Generates a **token** access from user ID
6. ✅ **Update** the user data with the generated access token
7. ✅ Returns **200** with the access token and the username

> ## Exceptions

1. ✅ Returns **404** error if a API does not exists
2. ✅ Returns **400** error if email or password are not provided by the client
3. ✅ Returns **400** error if the email field is an invalid email
4. ✅ Returns **401** error if not find a user with the given data
5. ✅ Returns **500** error if fails when trying to generate the access token
6. ✅ Returns **500** error if fails when trying to update the user with the generated access token