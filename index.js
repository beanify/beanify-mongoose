'use strict'

const beanifyPlugin = require("beanify-plugin")
const mongoose = require("mongoose")

module.exports = beanifyPlugin(async (beanify, { url, config, useNameAndAlias = false }, done) => {
  await mongoose.connect(url, config);

  beanify.addHook('onClose', (ctx, done) => {
    console.log('Mongodb connection closed!')
    mongoose.connection.close(done)
  })

  function addModel(name, schema) {
    this.models[name] = mongoose.model(name, schema)
  }

  const decorator = {
    models: {},
    db: mongoose,
    SchemaObjectId: mongoose.Schema.Types.ObjectId,
    ObjectId: mongoose.Types.ObjectId,
    Schema: mongoose.Schema
  }

  decorator.addModel = addModel.bind(decorator)
  beanify.decorate("mongoose", decorator)

  console.log('mongoDB connected!')
  done()
})
