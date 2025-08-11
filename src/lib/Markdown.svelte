<script lang="ts">
  import { marked } from 'marked'
  import DOMPurify from 'dompurify'
  import Code from './Code.svelte'
  import { afterUpdate, onDestroy, onMount } from 'svelte'
  import { mount } from 'svelte'

  export let source: string = ''

  // Configure marked to output simple pre/code blocks. We will hydrate them with Code component post-render.
  const renderer = new marked.Renderer()
  renderer.code = ({ text, lang }: { text: string; lang?: string; escaped?: boolean }) => {
    const language = (lang || '').trim()
    const encoded = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    return `<pre><code class="language-${language}">${encoded}</code></pre>`
  }

  let html = ''
  let container: HTMLElement

  type Mounted = { wrapper: HTMLElement; destroy?: () => void; $destroy?: () => void }
  let mountedCodes: Mounted[] = []

  const destroyMounted = () => {
    mountedCodes.forEach((m) => {
      try { m.destroy?.() } catch {}
      try { m.$destroy?.() } catch {}
    })
    mountedCodes = []
  }

  // Track when html changes so we only (re)hydrate on content changes
  let renderVersion = 0
  let hydratedVersion = -1

  const hydrateCodeBlocks = () => {
    if (!container) return
    if (hydratedVersion === renderVersion) return
    // Tear down previous mounts first so we don't leak
    destroyMounted()
    // Find all pre > code blocks and replace their parent <pre> with our Code component
    const nodes = Array.from(container.querySelectorAll('pre > code')) as HTMLElement[]
    nodes.forEach((codeEl) => {
      const pre = codeEl.closest('pre') as HTMLElement | null
      if (!pre) return
      const cls = codeEl.className || ''
      const langMatch = cls.match(/language-([a-zA-Z0-9_+-]+)/)
      const lang = langMatch ? langMatch[1] : undefined
      const text = codeEl.innerText || codeEl.textContent || ''
      const wrapper = document.createElement('div')
      pre.replaceWith(wrapper)
      const instance = mount(Code as any, { target: wrapper, props: { lang, text } }) as any
      mountedCodes.push({ wrapper, destroy: instance?.destroy, $destroy: instance?.$destroy })
    })
    hydratedVersion = renderVersion
  }

  $: {
    const raw = marked.parse(source, { renderer }) as string
    html = DOMPurify.sanitize(raw)
    renderVersion++
  }

  onMount(() => {
    hydrateCodeBlocks()
  })

  afterUpdate(() => {
    hydrateCodeBlocks()
  })

  onDestroy(() => {
    destroyMounted()
  })
</script>

<div bind:this={container} class="markdown" class:empty={!source}>
  {@html html}
  {#if !source}
    <span></span>
  {/if}
  
  
</div>

<style>
.markdown :global(pre) {
  background: transparent;
}
</style>


