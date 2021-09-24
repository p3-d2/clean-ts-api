# Answer survey

> ## Success case

1. ✅ Receives a request of type **PUT** in the route **/api/surveys/{survey_id}/results**
2. ✅ Validates if the request was made by an **user**
3. ✅ Validate the parameter **survey_id**
4. ✅ Validates if the field **answer** is a valid answer
5. ✅ **Create** a survey result with the data provided if you do not have a record
6. ✅ **Update** a survey result with the data provided if you already have a record
7. ✅ Returns **200** with the data from the poll results

> ## Exceptions

1. ✅ Returns **404** error if a API does not exists
2. ✅ Returns **403** error if not a user
3. ✅ Returns **403** error if the survey_id passed in the URL is invalid
4. ✅ Returns **403** error if the response sent by the client is an invalid response
5. ✅ Returns **500** error if make an error when trying to create the survey result
6. ✅ Returns **500** error if fails when trying to update the survey result
7. ✅ Returns **500** error if fails when trying to load the poll