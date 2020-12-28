import mongoose from 'mongoose'
import { Beanify } from 'beanify'

import { BeanifyMongoose, BeanifyMongooseOptions } from './types/options'
declare const mongoose: BeanifyMongoose

declare const decorator: () => {
  [key: string]: mongoose.Model<unknown, unknown>
} & {
  instance: mongoose.Mongoose
}

export {
  mongoose,
  decorator
}

declare module 'beanify' {
  interface BeanifyPlugin {
    (plugin: BeanifyMongoose, options: BeanifyMongooseOptions): Beanify
  }

  interface Beanify {
    mongoose: {
      [key: string]: mongoose.Model<unknown, unknown>
    } & {
      instance: mongoose.Mongoose
    }
  }
}
