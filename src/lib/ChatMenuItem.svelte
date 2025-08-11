<script lang="ts">
  import { replace } from 'svelte-spa-router'
  import type { Chat } from './Types.svelte'
  import { deleteChat, pinMainMenu, saveChatStore } from './Storage.svelte'
  import Fa from 'svelte-fa/src/fa.svelte'
  import { faTrash, faCircleCheck, faPencil } from '@fortawesome/free-solid-svg-icons/index'
  import { faMessage } from '@fortawesome/free-regular-svg-icons/index'
  import { onMount } from 'svelte'
  import { hasActiveModels } from './Models.svelte'

  export let chat:Chat
  export let activeChatId:number|undefined
  export let prevChat:Chat|undefined
  export let nextChat:Chat|undefined

  let editing:boolean = false
  let original:string

  let waitingForConfirm:any = 0

  onMount(async () => {
    if (!chat.name) {
      chat.name = `Chat ${chat.id}`
    }
  })

  const keydown = (event:KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      event.preventDefault()
      chat.name = original
      editing = false
    }
    if (event.key === 'Tab' || event.key === 'Enter') {
      event.stopPropagation()
      event.preventDefault()
      update()
    }
  }

  const update = () => {
    editing = false
    if (!chat.name) {
      chat.name = original
      return
    }
    saveChatStore()
  }

  const delChat = () => {
    if (!waitingForConfirm) {
      // wait a second for another click to avoid accidental deletes
      waitingForConfirm = setTimeout(() => { waitingForConfirm = 0 }, 1000)
      return
    }
    clearTimeout(waitingForConfirm)
    waitingForConfirm = 0
    if (activeChatId === chat.id) {
      const newChat = nextChat || prevChat
      if (!newChat) {
        // No other chats, clear all and go to home
        replace('/').then(() => { deleteChat(chat.id) })
      } else {
        // Delete the current chat and go to the max chatId
        replace(`/chat/${newChat.id}`).then(() => { deleteChat(chat.id) })
      }
    } else {
      deleteChat(chat.id)
    }
  }

  const edit = () => {
    original = chat.name
    editing = true
    setTimeout(() => {
      const el = document.getElementById(`chat-menu-item-${chat.id}`)
      el && el.focus()
    }, 0)
  }

  const goToChat = () => {
    $pinMainMenu = false
    replace(`#/chat/${chat.id}`)
  }

  const onItemKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      goToChat()
    }
  }

</script>

<li>
  {#if editing}
    <div id="chat-menu-item-{chat.id}" class="chat-name-editor" role="textbox" tabindex="0" on:keydown={keydown} contenteditable bind:innerText={chat.name} on:blur={update}></div>
{:else}
  <div class="chat-menu-row" class:is-active={activeChatId === chat.id}>
    <a 
      href={`#/chat/${chat.id}`}
      class="chat-menu-item"
      class:is-waiting={waitingForConfirm} class:is-disabled={!hasActiveModels()} class:is-active={activeChatId === chat.id}
      on:click={() => { $pinMainMenu = false }}
      on:keydown={onItemKeydown}
    >
      <span class="chat-item-name"><Fa class="mr-2 chat-icon" size="xs" icon="{faMessage}"/>{chat.name || `Chat ${chat.id}`}</span>
      <span class="chat-menu-actions">
        {#if waitingForConfirm}
          <button class="px-1 py-0 has-text-weight-bold delete-button icon-button" type="button" on:click|preventDefault|stopPropagation={() => delChat()} aria-label="Confirm delete"><Fa icon={faCircleCheck} /></button>
        {:else}
          <button class="px-1 py-0 has-text-weight-bold edit-button icon-button" type="button" on:click|preventDefault|stopPropagation={() => edit()} aria-label="Edit chat"><Fa icon={faPencil} /></button>
          <button class="px-1 py-0 has-text-weight-bold delete-button icon-button" type="button" on:click|preventDefault|stopPropagation={() => delChat()} aria-label="Delete chat"><Fa icon={faTrash} /></button>
        {/if}
      </span>
    </a>
  </div>
  {/if}
</li>

<style>
.chat-menu-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.chat-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1 1 auto;
  padding-right: 0.25rem;
  color: inherit;
  min-height: 2.25rem;
}
.chat-item-name {
  display: inline-flex;
  align-items: center;
}
.chat-menu-actions {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}
.icon-button {
  background: transparent;
  border: 0;
  padding: 0.1rem 0.25rem;
  line-height: 1;
  height: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: inherit;
}
.icon-button:focus {
  outline: 1px dotted currentColor;
}
.icon-button :global(svg) {
  vertical-align: middle;
}

/* Ensure hover/active styles apply to actions too */
.chat-menu-item.is-active,
.chat-menu-item:hover {
  background-color: rgba(32, 156, 238, 0.1);
}
.chat-menu-item.is-active .chat-menu-actions :global(svg),
.chat-menu-item:hover .chat-menu-actions :global(svg) {
  color: #209cee; /* Bulma info color */
}
</style>