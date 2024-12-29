/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import type Document from '../document.js';
import type View from '../view.js';
declare const Observer_base: {
    new (): import("@ckeditor/ckeditor5-utils").DomEmitter;
    prototype: import("@ckeditor/ckeditor5-utils").DomEmitter;
};
/**
 * Abstract base observer class. Observers are classes which listen to DOM events, do the preliminary
 * processing and fire events on the {@link module:engine/view/document~Document} objects.
 * Observers can also add features to the view, for instance by updating its status or marking elements
 * which need a refresh on DOM events.
 */
export default abstract class Observer extends Observer_base {
    /**
     * An instance of the view controller.
     */
    readonly view: View;
    /**
     * A reference to the {@link module:engine/view/document~Document} object.
     */
    readonly document: Document;
    /**
     * The state of the observer. If it is disabled, no events will be fired.
     */
    private _isEnabled;
    /**
     * Creates an instance of the observer.
     */
    constructor(view: View);
    /**
     * The state of the observer. If it is disabled, no events will be fired.
     */
    get isEnabled(): boolean;
    /**
     * Enables the observer. This method is called when the observer is registered to the
     * {@link module:engine/view/view~View} and after {@link module:engine/view/view~View#forceRender rendering}
     * (all observers are {@link #disable disabled} before rendering).
     *
     * A typical use case for disabling observers is that mutation observers need to be disabled for the rendering.
     * However, a child class may not need to be disabled, so it can implement an empty method.
     *
     * @see module:engine/view/observer/observer~Observer#disable
     */
    enable(): void;
    /**
     * Disables the observer. This method is called before
     * {@link module:engine/view/view~View#forceRender rendering} to prevent firing events during rendering.
     *
     * @see module:engine/view/observer/observer~Observer#enable
     */
    disable(): void;
    /**
     * Disables and destroys the observer, among others removes event listeners created by the observer.
     */
    destroy(): void;
    /**
     * Checks whether a given DOM event should be ignored (should not be turned into a synthetic view document event).
     *
     * Currently, an event will be ignored only if its target or any of its ancestors has the `data-cke-ignore-events` attribute.
     * This attribute can be used inside the structures generated by
     * {@link module:engine/view/downcastwriter~DowncastWriter#createUIElement `DowncastWriter#createUIElement()`} to ignore events
     * fired within a UI that should be excluded from CKEditor 5's realms.
     *
     * @param domTarget The DOM event target to check (usually an element, sometimes a text node and
     * potentially sometimes a document, too).
     * @returns Whether this event should be ignored by the observer.
     */
    checkShouldIgnoreEventFromTarget(domTarget: Node | null): boolean;
    /**
     * Starts observing given DOM element.
     *
     * @param domElement DOM element to observe.
     * @param name The name of the related root element.
     */
    abstract observe(domElement: HTMLElement, name: string): void;
    /**
     * Stops observing given DOM element.
     */
    abstract stopObserving(domElement: HTMLElement): void;
}
/**
 * The constructor of {@link ~Observer} subclass.
 */
export type ObserverConstructor = new (view: View) => Observer;
export {};
