export function getLocal(localName) {
  return localStorage.getItem(localName)
}

export function setLocal(localName, localValue) {
  localStorage.setItem(localName, localValue)
}

export function removeLocal(localName) {
  localStorage.removeItem(localName)
}
