// src/index.ts
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as EchoService from './echo-service'

admin.initializeApp(functions.config().firebase)

export const echo = EchoService.listener
