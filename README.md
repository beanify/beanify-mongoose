# beanify-mongoose

beanify操作mongodb插件

## 安装

```bash
npm i beanify-mongoose --save
```

with yarn

```bash
yarn add beanify-mongoose
```

## 例子

```javascript
const Beanify = require('beanify')
const mongoose = require('beanify-mongoose')
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
  .ready(e => {
    e && beanify.$log.error(e.message)
    beanify.print()
    await beanify.mongoose.Test.deleteMany()
    await beanify.mongoose.Test.create({
      test: 'this is test'
    })
    const doc = await beanify.mongoose.Test.findOne()
    console.log(doc.test) // this is test
  })
```

## 参数

|    字段      | 类型 | 描述 |
|   :---:      | :---: | :---: |
| `uri`    | `string` | mongoDB服务地址 |
| `models?` | [`object`] | 数据模型列表 |
| `useNameAndAlias?`      |  `boolean` | 是否启用模型别名 |
| `settings?`     |  [mongoose](https://github.com/Automattic/mongoose) | mongoose库的配置参数 |
