import moveInArray from "./move-in-array";

function walkGroup(parentIds, oldIndex, newIndex) {

  /** @param {LayerGroup} group */
  function execute(group) {
    const groupId = group.id
    const [ parentId, ...rest ] = parentIds

    // My id is at the root of the list. I am a (grand) parent
    if (groupId === parentId) {

      // I'm the last id of the Parent Ids, My children need to be reorderd
      if (rest.length === 0) {
        group.children = moveInArray(group.children, oldIndex, newIndex)

      // I'm not the last id of the Parent Ids, a grandkid of me needs to be 
      // reorderd. 
      } else {
        group.children = group.children.map(walkGroup(rest, oldIndex, newIndex))
      }
    }
    
    return group
  }

  return execute
}

/**
 * Reorders an item in the layers array.
 * @param {LayerGroup[]} source
 * @param {Number} oldIndex
 * @param {Number} newIndex
 * @param {String[]} parentIds
 */
export default function reorderLayerArray(source, parentIds, oldIndex, newIndex) {
  // We clone the source so we can mutate the clone in place
  const _source = JSON.parse(JSON.stringify(source))

  // The root list is being reorderd
  if (parentIds.length === 0) {
    return moveInArray(_source, oldIndex, newIndex)
  }

  // A nested list is being reorderd
  return _source.map(walkGroup(parentIds, oldIndex, newIndex))
}