const Beanify = require("beanify")
const beanifyPlugin = require("beanify-plugin")
const tap = require("tap")

const beanifyOpts = {
  nats: {
    url: 'nats://127.0.0.1:4222',
    user: 'bimgroup',
    pass: 'commonpwd'
  }
}

const beanify = new Beanify({
  nats: Object.assign({}, beanifyOpts.nats),
  log: { level: 'error' }
})

//mongoose plugin
beanify.register(require("../index"), {
  url: 'mongodb://localhost:27017/test',
  config: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
})

beanify.register(beanifyPlugin((beanify, opts, done) => {
  const { addModel, ObjectId, SchemaObjectId } = beanify.mongoose
  addModel("oseTest1", {
    title: String,
    body: String,
    date: Date,
    ssid: SchemaObjectId
  })
  done()
}))

beanify.ready(() => {
  console.log("beanify ready....")
  tap.test("register mongoose plugin", (t) => {
    t.plan(1)
    t.ok(beanify.hasDecorator("mongoose"), "decorator mongoose plugin error")
  })

  tap.test("create mongoose schema", (t) => {
    t.plan(1)
    const { models } = beanify.mongoose
    t.ok(models['oseTest1'] !== undefined, "models[oseTest1]===undefined ")
  })

  tap.test("find mongoose data", (t) => {
    t.plan(1)
    const { models: { oseTest1 } } = beanify.mongoose
    oseTest1.find({}, (err, data) => {
      t.error(err)
    })
  })

  tap.test("insert mongoose data", (t) => {
    t.plan(1)
    const { models: { oseTest1 }, ObjectId } = beanify.mongoose
    var t1 = oseTest1()
    t1.title = "this is title"
    t1.body = "this is body"
    t1.date = new Date()
    t1.ssid = new ObjectId
    t1.save()
    oseTest1.find({}, (err, data) => {
      t.error(err);
    })
  })

  tap.tearDown(() => {
    console.log("tap.tearDown")
    beanify.close()
  })

})

