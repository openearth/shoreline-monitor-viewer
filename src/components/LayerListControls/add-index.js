/** @typedef {import('./_types').Layer} */
/** @typedef {import('./_types').LayerGroup} */
/** @typedef {Layer & { index: Number }} LayerWithIndex */
/** @typedef {LayerGroup & { children: LayerGroup[] | LayerWithIndex[] }} LayerGroupWithIndex */
/** @typedef {{ value: Number }} LayerIndex */
/**
 * @typedef Index
 * @property {() => Number} getValue
 * @property {() => Number} increment
 */

 /**
  * The createIndex function creates a closure around the currentIndex and
  * provides methods to increase and read the value of the currentIndex value.
  * We do this because we need to keep a reference of the current index in the
  * recursive function.
  * 
  * @param {Number} value initial value
  * @returns {Index}
  */
function createIndex(value) {
  let currentIndex = value
  return {
    getValue: () => currentIndex,
    increment: () => currentIndex++
  }
}

/**
 * [Recursive]
 * Reverses all items in the array as well as the array of the `children` property
 * 
 * @param {LayerGroup[] | LayerGroupWithIndex[]} list 
 * @returns {LayerGroup[] | LayerGroupWithIndex[]}
 */
function reverse(list) {
  return list
    .reverse()
    .map(item => 
      item.children
        ? { ...item, children: reverse(item.children) }
        : item
    )
}

/**
 * [Recursive]
 * Adds indexes to all layers in a LayerGroup
 * 
 * @param {LayerGroup[]} list
 * @param {Index} index
 * @returns {LayerGroupWithIndex[]}
 */
function addIndexToLayers(list, index) {
  return list
    .map(item => {
      if (item.url) {
        index.increment()
        return {
          ...item,
          index: index.getValue()
        }
      } else {
        return {
          ...item,
          children: addIndexToLayers(item.children, index)
        }
      }
    })
}

/**
 * 
 * @param {LayerGroup[]} source 
 * @returns {LayerGroupWithIndex[]}
 */
function addIndex(source) {
  /** @type {Index} */
  let index = createIndex(-1)

  /** @type {LayerGroup[]} */
  const _source = JSON.parse(JSON.stringify(source))
  const reversed = reverse(_source)
  const withIndex = addIndexToLayers(reversed, index)
  const normalised = reverse(withIndex)
  return normalised
}

export default addIndex