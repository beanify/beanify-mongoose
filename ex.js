const Beanify = require('beanify')
const mongoose = require('./index.js')
const beanify = Beanify({})

beanify
  .register(mongoose, {
    uri: 'mongodb://127.0.0.1:27017/test?readPreference=primary&appname=MongoDB%20Compass&ssl=false',
    models: [
      {
        name: 'test',
        alias: 'Test',
        schema: {
          test: {
            type: 'String'
          }
        }
      }
    ]
  })
  .ready(async e => {
    e && beanify.$log.error(e.message)
    beanify.print()
    await beanify.mongoose.Test.deleteMany()
    await beanify.mongoose.Test.create({
      test: 'this is test'
    })
    const doc = await beanify.mongoose.Test.findOne()
    console.log(doc)
  })