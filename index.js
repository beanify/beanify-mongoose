'use strict'

const beanifyPlugin = require('beanify-plugin')
const mongoose = require('mongoose')

const fixReferences = (decorator, schema) => {
  Object.keys(schema).forEach(key => {
    if (schema[key].type === 'ObjectId') {
      schema[key].type = mongoose.Schema.Types.ObjectId
      if (schema[key].validateExistance) {
        delete schema[key].validateExistance
        schema[key].validate = {
          validator: async v => {
            try {
              await decorator[schema[key].ref].findById(v)
            } catch (e) {
              throw new Error(
                `${schema[key].ref} with ID ${v} does not exist in database!`
              )
            }
          }
        }
      }
    } else if (schema[key].length !== undefined) {
      schema[key].forEach(member => {
        if (member.type === 'ObjectId') {
          member.type = mongoose.Schema.Types.ObjectId
          if (member.validateExistance) {
            delete member.validateExistance
            member.validate = {
              validator: async v => {
                try {
                  await decorator[member.ref].findById(v)
                } catch (e) {
                  throw new Error(
                    `Post with ID ${v} does not exist in database!`
                  )
                }
              }
            }
          }
        }
      })
    }
  })
}

let decorator

module.exports = beanifyPlugin(async function (
  beanify,
  { uri, settings, models = [], useNameAndAlias = false },
  next
) {
  try {
    settings = settings || {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
    await mongoose.connect(uri, settings)
    decorator = {
      instance: mongoose
    }
    if (models.length !== 0) {
      models.forEach(model => {
        fixReferences(decorator, model.schema)
        const schema = new mongoose.Schema(model.schema, model.options)
        if (model.class) {
          schema.loadClass(model.class)
        }
        if (model.virtualize) {
          model.virtualize(schema)
        }
        if (useNameAndAlias) {
          if (model.alias === undefined) {
            next(new Error(`No alias defined for ${model.name}`))
          }
          decorator[model.alias] = mongoose.model(
            model.alias,
            schema,
            model.name
          )
        } else {
          decorator[
            model.alias
              ? model.alias
              : `${model.name[0].toUpperCase()}${model.name.slice(1)}`
          ] = mongoose.model(model.name, schema)
        }
      })
    }
    beanify.addHook('onClose', function () {
      mongoose.connection.on('close', function () {
        beanify.$log.info('Mongodb connection closed!')
      })
      mongoose.connection.close()
    })
    beanify.decorate('mongoose', decorator)
    beanify.$log.info('mongoDB connected!')
  } catch (error) {
    beanify.$log.error(`mongoDB connect Error:${error}`)
    next(error)
  }
})

module.exports.decorator = () => decorator
