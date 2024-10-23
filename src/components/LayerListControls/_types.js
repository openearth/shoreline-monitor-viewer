/**
 * @typedef Layer
 * @property {String} id - Id of the Layer
 * @property {String} name - Display friendly name of the Layer
 * @property {String} layer - Layer id
 * @property {String} url - The url for the layer
 */

 /**
  * @typedef LayerGroup
  * @property {String} id - If of the Layer Group
  * @property {String} name - Display friendly name of the Layer Group
  * @property {Layer | LayerGroup} children - Collection of children, either Layers or LayerGroups
  */
