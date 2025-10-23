export function error(status, message) {
  return {
    status,
    data: { error: message },
  }
}

export function success(data, status = 200) {
  return {
    status,
    data,
  }
}

export function wrapError(message) {
  return { error: message }
}

export function wrapMessage(message) {
  return { message }
}
