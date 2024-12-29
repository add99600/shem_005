/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @module utils/dom/insertat
 */
/**
 * Inserts node to the parent at given index.
 *
 * @param parentElement Parent element.
 * @param index Insertions index.
 * @param nodeToInsert Node to insert.
 */
export default function insertAt(parentElement, index, nodeToInsert) {
    parentElement.insertBefore(nodeToInsert, parentElement.childNodes[index] || null);
}
