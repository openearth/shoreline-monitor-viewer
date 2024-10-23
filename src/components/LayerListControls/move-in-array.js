/**
 * Moves an item in the array to a new index
 * 
 * @template Item
 * @param {Item[]} array The source array
 * @param {Number} oldIndex The index of the item before reordering
 * @param {Number} newIndex The index of the item after reordering
 * @return {<Item>}
 */
export default function moveInArray(array, oldIndex, newIndex) {
  if (newIndex > array.length) throw new RangeError(`newIndex (${newIndex}) lies outside of array length (${array.length})`)

  const item = array[oldIndex]
  if (item === undefined) throw new ReferenceError('No item defined on provided oldIndex')

  const firstPart = array.slice(0, oldIndex)
  const lastPart = array.slice(oldIndex + 1)
  const newArray = [...firstPart, ...lastPart]
  newArray.splice(newIndex, 0, item)
  return newArray
}