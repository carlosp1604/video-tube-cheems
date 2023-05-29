import { z } from 'zod'

export const usernameValidator = z.string()
  .min(4)
  .max(36)
  .regex(/^[a-zA-Z0-9_]+$/)

export const passwordValidator = z.string()
  .min(8)

export const nameValidator = z.string()
  .min(1)
  .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/)

export const verificationCodeValidator = z.string()
  .min(8)

export const emailValidator = z.string()
  .email()
  .min(1)
