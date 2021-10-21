import { MongoHelper } from '@/infra/db'

export const survey = {
  question: 'Question',
  answers: [{
    answer: 'Answer 1',
    image: 'http://image-name.com'
  }, {
    answer: 'Answer 2'
  }],
  date: new Date()
}

export const insertSurvey = async (date = new Date()): Promise<string> => {
  const surveyCollection = MongoHelper.getCollection('surveys')
  const { insertedId } = await surveyCollection.insertOne({
    ...survey,
    date
  })
  return insertedId.toString()
}
