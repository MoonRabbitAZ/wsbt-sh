import _ from 'lodash'

export const get = (a, b, c) => {
  const retValue = c !== undefined ? c : null
  return a.reduce(
    (obj, key) =>
      obj && key && obj[key] !== null && obj[key] !== undefined
        ? obj[key]
        : retValue,
    b,
  )
}

export const findKeyFromArrayOfObject = (
  key,
  keynameofObject,
  data,
) => {
  if (data && data.length > 0) {
    const find = data.find(k => k[keynameofObject] === key)
    return find
  }

  return []
}

export function cleanUpObject(jsonObject) {
  Object.keys(jsonObject).forEach(function (key) {
    const currentObj = jsonObject[key]

    if (_.isNull(currentObj) || currentObj === '') {
      delete jsonObject[key]
    } else if (_.isObject(currentObj)) {
      if (_.isArray(currentObj)) {
        if (!currentObj.length) {
          delete jsonObject[key]
        } else {
          const cleanupArrayObj = []
          for (const obj of currentObj) {
            if (!_.isNull(obj) || currentObj !== '') {
              const cleanObj = cleanUpObject(obj)
              if (!_.isEmpty(cleanObj)) {
                cleanupArrayObj.push(cleanObj)
              }
            }
          }
          if (!cleanupArrayObj.length) {
            delete jsonObject[key]
          } else {
            jsonObject[key] = cleanupArrayObj
          }
        }
      } else if (_.isEmpty(Object.keys(jsonObject[key]))) {
        delete jsonObject[key]
      } else {
        jsonObject[key] = cleanUpObject(currentObj)

        if (_.isEmpty(Object.keys(jsonObject[key]))) {
          delete jsonObject[key]
        }
      }
    }
  })

  return jsonObject
}

export const getQueryStringObj = () => {
  const url = new URL(window.location.href)
  return Object.fromEntries(new URLSearchParams(url.search))
}

export function getQuery(params) {
  const keys = Object.keys(params || {})
  const query = keys
    .filter(key => params[key])
    .map(key => `${key}=${params[key]}`)
    .join('&')
  return query
}

export const joiUpdatedMessage = {
  'string.empty': `Please enter a {{#label}}.`,
  'string.min': `{#label} should have a minimum length of {#limit}`,
  'array.min': `should have minimum {#limit} {#label}`,
  'array.max': `should have maximum {#limit} {#label}`,
  'string.max': `{#label} should have a max length of {#limit}`,
  'any.required': `{#label} is required`,
  'string.email': `Please enter a valid email address.`,
  'string.image': `Image size limit exceeded!`,
}