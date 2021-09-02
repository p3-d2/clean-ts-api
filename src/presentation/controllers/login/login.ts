import { Authentication } from '../../../data/usecases/authentication'
import { EmailValidator } from '../signup/signup-protocols'
import { badRequest, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { MissingParamError, InvalidParamError } from '../../errors'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.body.email) {
        return await new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
      }
      if (!httpRequest.body.password) {
        return await new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
      }
      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValid) {
        return await new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))))
      }
      await this.authentication.auth(httpRequest.body.email, httpRequest.body.password)
    } catch (error) {
      return serverError(error)
    }
  }
}
