import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism-tomorrow.css'; 
import { Download, Copy, Code2, MonitorPlay, Check, LayoutGrid } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DEFAULT_SVG = `<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8B5CF6" />
      <stop offset="100%" stop-color="#EC4899" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background Shape -->
  <rect x="50" y="50" width="300" height="300" rx="40" fill="url(#gradient)" />
  
  <!-- Decorative Dots -->
  <g fill="white" opacity="0.4">
    <circle cx="80" cy="80" r="4" />
    <circle cx="320" cy="80" r="4" />
    <circle cx="80" cy="320" r="4" />
    <circle cx="320" cy="320" r="4" />
  </g>

  <!-- Central Graphic -->
  <path 
    d="M 140 180 
       L 260 180 
       L 200 260 Z" 
    fill="white" 
    opacity="0.95"
    filter="url(#glow)"
  />
  <circle cx="200" cy="140" r="30" fill="white" filter="url(#glow)" />
</svg>`;

export default function App() {
  const [code, setCode] = useState(DEFAULT_SVG);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'graphic.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-zinc-300 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50 bg-[#0c0c0c] shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-500/10 rounded-lg">
            <LayoutGrid className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h1 className="text-sm font-medium text-zinc-100 uppercase tracking-wide">SVG Code Playground</h1>
            <p className="text-xs text-zinc-500">amr project and env toiri koro</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors border border-zinc-800 rounded-md hover:text-zinc-100 hover:bg-zinc-800/50"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            Copy Code
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-medium text-white transition-colors bg-pink-600 border border-pink-500/50 rounded-md hover:bg-pink-500 shadow-lg shadow-pink-500/20"
          >
            <Download className="w-4 h-4" />
            Download SVG
          </button>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Editor Pane */}
        <section className="flex flex-col border-r border-zinc-800/50 relative h-full">
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/50 bg-[#0f0f0f] shrink-0">
            <span className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
              <Code2 className="w-3.5 h-3.5" />
              Code Editor
            </span>
          </div>
          <div className="flex-1 overflow-auto bg-[#0a0a0a]">
            {/* Setting height to 100% wrapper */}
            <div className="p-4 font-mono text-[13px] leading-relaxed h-full">
              <Editor
                value={code}
                onValueChange={code => setCode(code)}
                highlight={code => highlight(code, languages.markup, 'markup')}
                padding={16}
                textareaClassName="focus:outline-none"
                style={{
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: 'transparent',
                  minHeight: '100%',
                }}
              />
            </div>
          </div>
        </section>

        {/* Preview Pane */}
        <section className="flex flex-col relative h-full bg-zinc-900 border-t lg:border-t-0 border-zinc-800/50">
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/50 bg-[#0f0f0f] shrink-0 z-10 w-full relative">
            <span className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
              <MonitorPlay className="w-3.5 h-3.5" />
              Live Preview
            </span>
          </div>
          
          <div className="flex-1 relative checkerboard-dark overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center p-8 overflow-auto">
              {/* Direct injection of SVG to render it safely inside the applet */}
              <div 
                className="max-w-full drop-shadow-2xl transition-all flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: code }} 
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
