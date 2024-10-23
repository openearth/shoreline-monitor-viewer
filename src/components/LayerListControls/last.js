/**
 * Returns the last item of an array
 * @template Item
 * @param {Item[]} array
 * @retrun {<Item>}
 */
export default function last(array = []) {
  const total = array.length
  const lastItem = total - 1
  return array[lastItem]
}