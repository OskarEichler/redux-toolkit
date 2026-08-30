import { isPlainObject as _iPO } from '../core/rtkImports'

// remove type guard
const isPlainObject: (_: any) => boolean = _iPO

export function copyWithStructuralSharing<T>(oldObj: any, newObj: T): T
export function copyWithStructuralSharing(oldObj: any, newObj: any): any {
  if (
    oldObj === newObj ||
    !(
      (isPlainObject(oldObj) && isPlainObject(newObj)) ||
      (Array.isArray(oldObj) && Array.isArray(newObj))
    )
  ) {
    return newObj
  }
  const newKeys = Object.keys(newObj)
  const oldKeys = Object.keys(oldObj)

  let isSameObject = newKeys.length === oldKeys.length
  const mergeObj: any = Array.isArray(newObj) ? [] : {}
  for (const key of newKeys) {
    const sharedValue = copyWithStructuralSharing(oldObj[key], newObj[key])
    if (key === '__proto__') {
      Object.defineProperty(mergeObj, key, {
        value: sharedValue,
        enumerable: true,
        configurable: true,
        writable: true,
      })
    } else {
      mergeObj[key] = sharedValue
    }
    if (isSameObject) isSameObject = oldObj[key] === sharedValue
  }
  return isSameObject ? oldObj : mergeObj
}
