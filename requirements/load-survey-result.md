# Survey result

> ## Success case

1. ✅ Receives a request of type **GET** in the route **/api/surveys/{survey_id}/results**
2. ✅ Validates if the request was made by an **user**
3. ✅ Returns **200** with the data from the survey results

> ## Exceptions

1. ✅ Returns **404** error if API does not exists
2. ✅ Returns **403** error if not a user
3. ✅ Returns **500** error if you get an error when trying to list the survey results