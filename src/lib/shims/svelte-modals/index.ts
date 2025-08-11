// Minimal shim for svelte-modals v1 to avoid peer dependency on Svelte < 5
// Provides Modals component and openModal/closeModal no-ops sufficient for this app's usage

import type { SvelteComponent } from 'svelte'
export { default as Modals } from './Modals.svelte'

type ModalOptions = Record<string, any>

let _openFn: (component: typeof SvelteComponent, props?: ModalOptions) => void = () => {}
let _closeFn: () => void = () => {}

export function setModalHandlers(openFn: typeof _openFn, closeFn: typeof _closeFn) {
  _openFn = openFn
  _closeFn = closeFn
}

export function openModal(component: typeof SvelteComponent, props?: ModalOptions) {
  _openFn(component, props)
}

export function closeModal() {
  _closeFn()
}

// Simple passthrough wrapper that renders a slot; the actual implementation is provided in app via handlers
// named Modals function removed to avoid duplicate export; use component above

export default {}


