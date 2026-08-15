import {
  X,
  Bot,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCw,
  Layers,
  FileText,
  Sparkles
} from 'lucide-react';
import { SubagentTask } from '../types';

interface DelegationInspectorProps {
  task: SubagentTask | null;
  onClose: () => void;
  onPromoteToArtifact?: (task: SubagentTask) => void;
}

export function DelegationInspector({
  task,
  onClose,
  onPromoteToArtifact
}: DelegationInspectorProps) {
  if (!task) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-stone-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-stone-900 text-white flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900 capitalize">
                {task.role.replace('_', ' ')} Subagent Task
              </h3>
              <p className="text-[10px] font-mono text-stone-400">ID: {task.taskId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1 scrollbar-thin">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Goal / Objective</label>
            <p className="font-medium text-stone-900 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              {task.goal}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
              <span className="text-[10px] text-stone-400 uppercase font-semibold">Token Budget</span>
              <div className="font-mono text-xs text-stone-800 mt-0.5">
                {task.tokensUsed} / {task.tokenBudget} used
              </div>
            </div>
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
              <span className="text-[10px] text-stone-400 uppercase font-semibold">Confidence Score</span>
              <div className="font-mono text-xs text-emerald-700 font-semibold mt-0.5">
                {(task.confidence * 100).toFixed(0)}% Verified
              </div>
            </div>
          </div>

          {/* Input & Output Payloads */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Input Payload</label>
            <pre className="p-3 bg-stone-900 text-stone-200 rounded-xl font-mono text-[11px] overflow-x-auto">
              {JSON.stringify(task.inputPayload, null, 2)}
            </pre>
          </div>

          {task.outputPayload && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Synthesized Output</label>
              <pre className="p-3 bg-stone-900 text-emerald-300 rounded-xl font-mono text-[11px] overflow-x-auto">
                {JSON.stringify(task.outputPayload, null, 2)}
              </pre>
            </div>
          )}

          {task.citations && task.citations.length > 0 && (
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Source Provenance</label>
              <div className="flex flex-wrap gap-1">
                {task.citations.map((cit, i) => (
                  <span key={i} className="px-2 py-0.5 bg-stone-100 border border-stone-200 rounded text-[11px] text-stone-700">
                    {cit}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          {onPromoteToArtifact && (
            <button
              onClick={() => onPromoteToArtifact(task)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-950 rounded-xl text-xs font-semibold border border-orange-200 transition-colors"
            >
              <Layers size={13} className="text-orange-700" />
              <span>Promote to Artifact</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 text-white rounded-xl text-xs font-medium hover:bg-stone-800 ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
