import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowUp,
  Paperclip,
  Sparkles,
  Mic,
  X,
  FileText,
  Image as ImageIcon,
  StopCircle,
  HelpCircle
} from 'lucide-react';
import { SlashCommandPalette } from './SlashCommandPalette';
import { SkillDefinition, AgentDefinition, RemoteMcpConnector, ProjectSource } from '../types';

interface ComposerProps {
  onSendMessage: (content: string, attachments?: File[]) => void;
  isRunning: boolean;
  onCancelRun: () => void;
  skills: SkillDefinition[];
  agents: AgentDefinition[];
  connectors: RemoteMcpConnector[];
  projectSources?: ProjectSource[];
}

export function Composer({
  onSendMessage,
  isRunning,
  onCancelRun,
  skills,
  agents,
  connectors,
  projectSources
}: ComposerProps) {
  const [text, setText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [showSlashPalette, setShowSlashPalette] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (showSlashPalette) return;
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setShowSlashPalette(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);

    // Detect slash command trigger at cursor
    const lastWord = val.split(/\s+/).pop() || '';
    if (lastWord.startsWith('/')) {
      setShowSlashPalette(true);
      setSlashQuery(lastWord.slice(1));
    } else {
      setShowSlashPalette(false);
    }
  };

  const handleSelectCommand = (command: string, templateText?: string) => {
    setText((prev) => {
      const parts = prev.split(/\s+/);
      parts.pop();
      return (parts.length > 0 ? parts.join(' ') + ' ' : '') + (templateText || command) + ' ';
    });
    setShowSlashPalette(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleSubmit = () => {
    if ((!text.trim() && attachedFiles.length === 0) || isRunning) return;
    onSendMessage(text.trim(), attachedFiles);
    setText('');
    setAttachedFiles([]);
    setShowSlashPalette(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAttachedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeFile = (idx: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const quickPrompts = [
    { label: 'Competitor Research', prompt: '/research Compare Muuto and HAY circular warranties' },
    { label: 'Architecture Diagram', prompt: '/diagram Create multi-rail payment fallback flowchart' },
    { label: 'Interactive Preview', prompt: '/preview Build an interactive margin calculator UI component' },
    { label: 'QA Verification', prompt: '/qa Audit Scandinavian positioning brief citations' }
  ];

  return (
    <div id="composer-container" className="relative p-3 md:p-4 bg-transparent max-w-4xl mx-auto w-full">
      {/* Floating Slash Command Palette */}
      <SlashCommandPalette
        isOpen={showSlashPalette}
        query={slashQuery}
        onSelectCommand={handleSelectCommand}
        onClose={() => setShowSlashPalette(false)}
        skills={skills}
        agents={agents}
        connectors={connectors}
      />

      {/* Main Composer Box */}
      <div className="relative bg-white border border-stone-300 rounded-2xl shadow-md focus-within:border-stone-900 focus-within:ring-2 focus-within:ring-stone-900/10 transition-all p-3 space-y-2">
        {/* Attachment Previews */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1 pb-2 border-b border-stone-100">
            {attachedFiles.map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 bg-stone-100 border border-stone-200 rounded-lg px-2.5 py-1 text-xs text-stone-700"
              >
                <FileText size={13} className="text-stone-500" />
                <span className="truncate max-w-[140px] font-medium">{file.name}</span>
                <span className="text-[10px] text-stone-400">({(file.size / 1024).toFixed(0)} KB)</span>
                <button
                  onClick={() => removeFile(i)}
                  className="p-0.5 hover:text-red-600 rounded"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Input */}
        <textarea
          id="composer-input"
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask Lattice or type '/' for skills, subagents, diagrams, and tools..."
          rows={1}
          disabled={isRunning}
          className="w-full bg-transparent text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none resize-none min-h-[44px] max-h-[200px] leading-relaxed"
        />

        {/* Bottom Bar: Action Buttons & Run Controls */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="flex items-center gap-1.5">
            {/* File Upload Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              className="hidden"
            />
            <button
              id="attach-file-btn"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              title="Attach files (PDF, Markdown, Specs, Images)"
            >
              <Paperclip size={16} />
            </button>

            {/* Quick Slash Palette Trigger */}
            <button
              id="slash-trigger-btn"
              type="button"
              onClick={() => {
                setShowSlashPalette(!showSlashPalette);
                setSlashQuery('');
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors font-mono text-xs"
              title="Browse / commands"
            >
              <Sparkles size={14} className="text-orange-700" />
              <span>/</span>
            </button>

            {/* Simulated Voice Input */}
            <button
              id="voice-toggle-btn"
              type="button"
              onClick={() => setIsRecording(!isRecording)}
              className={`p-1.5 rounded-lg transition-colors ${
                isRecording ? 'bg-red-100 text-red-700 animate-pulse' : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
              }`}
              title={isRecording ? 'Listening...' : 'Voice Dictation'}
            >
              <Mic size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-stone-400 hidden sm:inline font-mono">
              Press Enter to send
            </span>

            {isRunning ? (
              <button
                id="cancel-run-btn"
                onClick={onCancelRun}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-xs transition-colors shadow-xs"
              >
                <StopCircle size={14} />
                <span>Cancel Run</span>
              </button>
            ) : (
              <button
                id="send-message-btn"
                onClick={handleSubmit}
                disabled={!text.trim() && attachedFiles.length === 0}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-stone-900 hover:bg-orange-700 disabled:opacity-30 disabled:hover:bg-stone-900 text-white transition-colors shadow-xs"
                title="Send Prompt"
              >
                <ArrowUp size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      {!text && !isRunning && (
        <div className="flex flex-wrap gap-1.5 pt-2 justify-center">
          {quickPrompts.map((item, i) => (
            <button
              key={i}
              onClick={() => setText(item.prompt)}
              className="text-[11px] font-medium text-stone-600 bg-white/70 hover:bg-white border border-stone-200/80 hover:border-stone-300 rounded-full px-3 py-1 transition-colors shadow-2xs"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
