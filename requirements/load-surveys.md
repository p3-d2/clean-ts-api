# List Surveys

> ## Success case

1. ✅ Receives a request of type **GET** in the route **/api/surveys**
2. ✅ Validates if the request was made by an **user**
3. ✅ Returns **204** if there is no survey
4. ✅ Returns **200** with survey data

> ## Exceptions

1. ✅ Returns **404** error if a API does not exists
2. ✅ Returns **403** error if not a user
3. ✅ Returns **500** error if make an error when trying to list the surveys