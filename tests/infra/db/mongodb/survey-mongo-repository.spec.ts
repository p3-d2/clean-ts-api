import { Collection } from 'mongodb'

import { AccountModel } from '@/domain/models'
import { SurveyMongoRepository, MongoHelper } from '@/infra/db'
import { mockAddSurveyParams, mockAddAccountParams } from '@/tests/domain/mocks'

let surveyResultCollection: Collection
let accountCollection: Collection

const mockAccount = async (): Promise<AccountModel> => {
  const { insertedId } = await accountCollection.insertOne(mockAddAccountParams())
  const account = await accountCollection.findOne({ _id: insertedId })
  return MongoHelper.map(account)
}

const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository()

describe('SurveyMongoRepository', () => {
  let surveyCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    surveyResultCollection = MongoHelper.getCollection('surveyResults')
    accountCollection = MongoHelper.getCollection('accounts')
    await surveyResultCollection.deleteMany({})
    await accountCollection.deleteMany({})
    await surveyCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut()
      await sut.add(mockAddSurveyParams())
      const count = await surveyCollection.countDocuments()
      expect(count).toBe(1)
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      const account = await mockAccount()
      const addSurveyModels = [mockAddSurveyParams(), mockAddSurveyParams()]
      const { insertedIds } = await surveyCollection.insertMany(addSurveyModels)
      const survey = await surveyCollection.findOne({ _id: insertedIds[0] })
      await surveyResultCollection.insertOne({
        surveyId: survey._id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      const surveys = await sut.loadAll(account.id)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveyModels[0].question)
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].question).toBe(addSurveyModels[1].question)
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('Should load empty list', async () => {
      const sut = makeSut()
      const account = await mockAccount()
      const surveys = await sut.loadAll(account.id)
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const { insertedId } = await surveyCollection.insertOne(mockAddSurveyParams())
      const sut = makeSut()
      const survey = await sut.loadById(insertedId.toString())
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })
  })
})
