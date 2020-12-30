import { ConnectionOptions, Schema, SchemaTypeOptions } from 'mongoose'
import { Beanify, PluginOptions, PluginDoneCallback } from 'beanify'

// @ts-ignore
export class BeanifyMongooseOptions extends PluginOptions {
  uri: string
  models?: Array<{
    name?: string
    alias?: string
    schema?: {
      [key: string]: SchemaTypeOptions<'Array' | 'Boolean' | 'Buffer' | 'Date' | 'Decimal128' | 'DocumentArray'
      | 'Embedded' | 'Map' | 'Mixed' | 'Number' | 'ObjectId' | 'String'>
    }
    virtualize?: (schema: Schema) => void
  }>

  useNameAndAlias?: boolean
  settings?: ConnectionOptions
}

export type BeanifyMongoose = (
  beanify: Beanify,
  options: BeanifyMongooseOptions,
  next: PluginDoneCallback
) => Promise<void>
