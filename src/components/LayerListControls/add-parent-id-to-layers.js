/** @typedef {import('./_types').Layer} */
/** @typedef {import('./_types').LayerGroup} */
/** @typedef {String[]} ParentIds */
/** @typedef {Layer & { parentIds: ParentIds }} LayerWithParents */
/** @typedef {LayerGroup & { parentIds: ParentIds }} LayerGroupWithParents */
/** @typedef {LayerGroup & { children: LayerGroupWithParents[] | LayerWithParents[] }} LayerGroupWithParentIds */

/**
 * Checks if the item is a LayerGroup
 * @param {Layer | LayerGroup} item 
 * @returns {Boolean}
 */
const isLayerGroup = item => Boolean(item.children)

/**
 * [Recursive]
 * Adds ParentIds to all Layers and LayerGroups
 * @param {LayerGroup[]} items 
 * @param {ParentIds} parentIds 
 * @returns {LayerGroupWithParentIds[]}
 */
function addParentIdToLayers(items, parentIds = []) {
  return items.map(item => {
    if (isLayerGroup(item) === false) return { ...item, parentIds }

    const children = addParentIdToLayers(item.children, [...parentIds, item.id])
    return { ...item, children, parentIds }
  })
}

export default addParentIdToLayers