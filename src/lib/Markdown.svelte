<script lang="ts">
  import { marked } from 'marked'
  import DOMPurify from 'dompurify'
  import Code from './Code.svelte'

  export let source: string = ''

  // Configure marked to delegate code rendering to our Code component via a custom renderer
  const renderer = new marked.Renderer()
  renderer.code = (code: string, infostring: string | undefined) => {
    const lang = (infostring || '').trim()
    // Escape code for HTML injection safety; DOMPurify will sanitize again
    const encoded = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  
    // We render a placeholder that we replace with Code component below
    // Here we keep simple pre/code; Code component is used elsewhere where needed
    return `<pre><code class="language-${lang}">${encoded}</code></pre>`
  }

  let html = ''

  $: {
    const raw = marked.parse(source, { renderer }) as string
    html = DOMPurify.sanitize(raw)
  }
</script>

<div class="markdown" class:empty={!source}>
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


