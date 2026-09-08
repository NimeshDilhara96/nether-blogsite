'use client'

import { useCallback, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { Selection } from '@tiptap/pm/state'
import { Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Image as ImageIcon, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight, Table as TableIcon, Highlighter, Type } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
}

const btn = (active: boolean): React.CSSProperties => ({
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: '30px', height: '30px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: active ? '#27272a' : 'transparent',
  color: active ? '#f4f4f5' : '#71717a',
  transition: 'all 0.1s',
  flexShrink: 0,
})

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const supabase = createClient()
  // Stores the ProseMirror Selection captured on mousedown, before focus can be lost
  const savedSelection = useRef<Selection | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Highlight,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none w-full focus:outline-none tiptap-content',
        style: 'min-height: 280px; padding: 16px;',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  const setLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Enter URL', previousUrl)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) return null

  /**
   * Save the current ProseMirror selection on mousedown, before the browser
   * has any chance to move focus (and thus reset the selection).
   */
  const captureSelection = () => {
    savedSelection.current = editor.state.selection
  }

  /**
   * Restore the saved selection into the editor, then run the given command.
   * This guarantees the command operates on exactly what the user highlighted,
   * regardless of any focus/blur events that may have happened in between.
   */
  const run = (command: () => void) => {
    if (savedSelection.current) {
      // Re-apply the saved selection via a direct ProseMirror transaction
      const sel = savedSelection.current
      try {
        const tr = editor.state.tr.setSelection(
          Selection.fromJSON(editor.state.doc, sel.toJSON())
        )
        editor.view.dispatch(tr)
      } catch {
        // If selection can't be restored (doc changed), proceed without it
      }
    }
    command()
    savedSelection.current = null
  }

  const addImage = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const { error } = await supabase.storage.from('blog-images').upload(fileName, file)
      if (error) { alert('Upload failed'); return }
      const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName)
      editor.chain().focus().setImage({ src: data.publicUrl }).run()
    }
    input.click()
  }

  const divider = (
    <div style={{ width: '1px', height: '18px', backgroundColor: '#27272a', margin: '0 4px', flexShrink: 0 }} />
  )

  return (
    <div style={{
      border: '1px solid #27272a',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#111111',
    }}>
      {/* Toolbar
          Pattern: onMouseDown captures the selection (before browser moves focus),
          onClick restores that selection then runs the command. */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2px',
        padding: '8px 10px',
        borderBottom: '1px solid #1f1f1f',
        backgroundColor: '#0a0a0a',
      }}>
        <button type="button" onMouseDown={captureSelection} onClick={() => run(() => editor.chain().focus().toggleBold().run())} style={btn(editor.isActive('bold'))} title="Bold"><Bold size={14} /></button>
        <button type="button" onMouseDown={captureSelection} onClick={() => run(() => editor.chain().focus().toggleItalic().run())} style={btn(editor.isActive('italic'))} title="Italic"><Italic size={14} /></button>
        <button type="button" onMouseDown={captureSelection} onClick={() => run(() => editor.chain().focus().toggleUnderline().run())} style={btn(editor.isActive('underline'))} title="Underline"><UnderlineIcon size={14} /></button>
        <button type="button" onMouseDown={captureSelection} onClick={() => run(() => editor.chain().focus().toggleHighlight().run())} style={btn(editor.isActive('highlight'))} title="Highlight"><Highlighter size={14} /></button>
        {divider}
        <button type="button" onMouseDown={captureSelection} onClick={() => run(() => editor.chain().focus().setTextAlign('left').run())} style={btn(editor.isActive({ textAlign: 'left' }))} title="Align Left"><AlignLeft size={14} /></button>
        <button type="button" onMouseDown={captureSelection} onClick={() => run(() => editor.chain().focus().setTextAlign('center').run())} style={btn(editor.isActive({ textAlign: 'center' }))} title="Align Center"><AlignCenter size={14} /></button>
        <button type="button" onMouseDown={captureSelection} onClick={() => run(() => editor.chain().focus().setTextAlign('right').run())} style={btn(editor.isActive({ textAlign: 'right' }))} title="Align Right"><AlignRight size={14} /></button>
        {divider}
        <button type="button" onMouseDown={captureSelection} onClick={() => run(() => editor.chain().focus().setParagraph().run())} style={btn(editor.isActive('paragraph'))} title="Paragraph"><Type size={14} /></button>
        <button type="button" onMouseDown={captureSelection} onClick={() => run(() => editor.chain().focus().toggleHeading({ level: 1 }).run())} style={btn(editor.isActive('heading', { level: 1 }))} title="H1"><Heading1 size={14} /></button>
        <button type="button" onMouseDown={captureSelection} onClick={() => run(() => editor.chain().focus().toggleHeading({ level: 2 }).run())} style={btn(editor.isActive('heading', { level: 2 }))} title="H2"><Heading2 size={14} /></button>
        <button type="button" onMouseDown={captureSelection} onClick={() => run(() => editor.chain().focus().toggleHeading({ level: 3 }).run())} style={btn(editor.isActive('heading', { level: 3 }))} title="H3"><Heading3 size={14} /></button>
        {divider}
        <button type="button" onMouseDown={captureSelection} onClick={() => run(() => editor.chain().focus().toggleBulletList().run())} style={btn(editor.isActive('bulletList'))} title="Bullet List"><List size={14} /></button>
        <button type="button" onMouseDown={captureSelection} onClick={() => run(() => editor.chain().focus().toggleOrderedList().run())} style={btn(editor.isActive('orderedList'))} title="Ordered List"><ListOrdered size={14} /></button>
        <button type="button" onMouseDown={captureSelection} onClick={() => run(() => editor.chain().focus().toggleBlockquote().run())} style={btn(editor.isActive('blockquote'))} title="Quote"><Quote size={14} /></button>
        {divider}
        <button type="button" onClick={setLink} style={btn(editor.isActive('link'))} title="Link"><LinkIcon size={14} /></button>
        <button type="button" onClick={addImage} style={btn(false)} title="Upload Image"><ImageIcon size={14} /></button>
        {divider}
        <button type="button" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} style={btn(editor.isActive('table'))} title="Insert Table"><TableIcon size={14} /></button>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .tiptap-content table { border-collapse: collapse; table-layout: fixed; width: 100%; margin: 0; overflow: hidden; }
        .tiptap-content td, .tiptap-content th { min-width: 1em; border: 1px solid #3f3f46; padding: 3px 5px; vertical-align: top; box-sizing: border-box; position: relative; }
        .tiptap-content th { font-weight: bold; text-align: left; background-color: #27272a; }
      `}} />
      
      <EditorContent editor={editor} />
    </div>
  )
}
