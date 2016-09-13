const hasOwnProperty = Object.prototype.hasOwnProperty;
export default function objectExtend<T>(oldObj: T, newObj: T): T {
  var target = {};
  for (var key in oldObj) {
    if (hasOwnProperty.call(oldObj, key)) {
      target[key] = oldObj[key];
    }
  }
  for (var key in newObj) {
    if (hasOwnProperty.call(newObj, key)) {
      target[key] = newObj[key];
    }
  }
  return <T> target;
}