import paths from './paths'
import components from './components'
import schemas from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: '4Dev - Survey for programmers',
    description: 'API for conduct surveys between programmers',
    version: '1.0.0',
    contact: {
      name: 'Pedro-frontEnd',
      email: 'pedro.contato.email@gmail.com',
      url: 'https://github.com/Pedro-frontEnd'
    },
    license: {
      name: 'GPL-3.0-or-later',
      url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'
    }
  },
  servers: [{
    url: '/api',
    description: 'Main server'
  }],
  tags: [{
    name: 'Login',
    description: 'Login related APIs'
  }, {
    name: 'Survey',
    description: 'Survey related APIs'
  }],
  paths,
  schemas,
  components
}
