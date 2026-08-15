import { useState } from 'react';
import {
  User,
  Bot,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  FileText,
  ExternalLink,
  ShieldCheck,
  RotateCw,
  Copy,
  Sparkles,
  Info,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  UploadCloud,
  Check,
  BrainCircuit
} from 'lucide-react';
import {
  Message,
  PlanStep,
  SubagentTask,
  ToolApprovalRequest,
  ToolContinuationPacket,
  Citation,
  Artifact
} from '../types';

interface ConversationViewProps {
  messages: Message[];
  isRunning: boolean;
  onOpenArtifact: (artifactId: string) => void;
  onApproveTool: (approvalId: string) => void;
  onRejectTool: (approvalId: string, reason?: string) => void;
  onResumeBlockedRun: (packetId: string, uploadedFile?: File) => void;
  onInspectSubagent?: (task: SubagentTask) => void;
  onSelectCitation?: (citation: Citation) => void;
}

export function ConversationView({
  messages,
  isRunning,
  onOpenArtifact,
  onApproveTool,
  onRejectTool,
  onResumeBlockedRun,
  onInspectSubagent,
  onSelectCitation
}: ConversationViewProps) {
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingApprovalId, setRejectingApprovalId] = useState<string | null>(null);

  const handleCopy = (msg: Message) => {
    navigator.clipboard.writeText(msg.content);
    setCopiedMsgId(msg.id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  return (
    <div id="conversation-stream" className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-4xl mx-auto w-full">
      {messages.length === 0 ? (
        <div id="conversation-empty-state" className="h-full flex flex-col items-center justify-center text-center p-8 text-stone-500 space-y-4 my-auto">
          <div className="w-12 h-12 rounded-2xl bg-stone-200/80 flex items-center justify-center text-stone-700">
            <BrainCircuit size={24} />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-base font-semibold text-stone-900">Lattice Agentic Workbench</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Start a standalone goal or select a project. Lattice will formulate a plan, delegate to specialist subagents, and render durable artifacts with grounded citations.
            </p>
          </div>
        </div>
      ) : (
        messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              id={`message-${msg.id}`}
              className={`flex gap-3 md:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {/* Assistant Avatar */}
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-stone-900 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Bot size={16} />
                </div>
              )}

              {/* Message Box */}
              <div
                className={`max-w-2xl w-full rounded-2xl p-4 md:p-5 space-y-4 text-xs md:text-sm leading-relaxed transition-all shadow-xs ${
                  isUser
                    ? 'bg-stone-900 text-white rounded-tr-xs'
                    : 'bg-white border border-stone-200 text-stone-900 rounded-tl-xs'
                }`}
              >
                {/* User Content */}
                {isUser && (
                  <div className="space-y-2">
                    <p className="whitespace-pre-wrap font-normal text-stone-100">{msg.content}</p>
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.attachments.map((att, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-stone-800 border border-stone-700 rounded text-[11px] text-stone-300 font-mono"
                          >
                            📎 {att.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Assistant Content & Structured Turn Renderers */}
                {!isUser && (
                  <div className="space-y-4">
                    {/* Header Pill */}
                    {msg.turnType && (
                      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                        <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-orange-700">
                          {msg.turnType.replace('_', ' ')}
                        </span>
                        <button
                          onClick={() => handleCopy(msg)}
                          className="text-stone-400 hover:text-stone-700 p-1 rounded transition-colors"
                          title="Copy text"
                        >
                          {copiedMsgId === msg.id ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                        </button>
                      </div>
                    )}

                    {/* Main Narrative Text */}
                    {msg.content && (
                      <div className="prose prose-stone prose-sm max-w-none text-stone-800 leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </div>
                    )}

                    {/* Plan Card */}
                    {msg.plan && (
                      <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Layers size={15} className="text-stone-700" />
                            <span className="font-semibold text-xs text-stone-900">Execution Plan</span>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-stone-200 text-stone-700 rounded-full">
                            {msg.plan.delegationMode.toUpperCase()}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {msg.plan.steps.map((step, idx) => (
                            <div
                              key={step.stepId}
                              className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 transition-colors ${
                                step.status === 'completed'
                                  ? 'bg-white border-stone-200 text-stone-800'
                                  : step.status === 'running'
                                  ? 'bg-orange-50/70 border-orange-200 text-orange-950 font-medium'
                                  : step.status === 'blocked'
                                  ? 'bg-red-50 border-red-200 text-red-900'
                                  : 'bg-stone-100/50 border-stone-200 text-stone-500'
                              }`}
                            >
                              <div className="mt-0.5 shrink-0">
                                {step.status === 'completed' ? (
                                  <CheckCircle2 size={14} className="text-emerald-700" />
                                ) : step.status === 'running' ? (
                                  <div className="w-3.5 h-3.5 rounded-full border-2 border-orange-700 border-t-transparent animate-spin" />
                                ) : step.status === 'blocked' ? (
                                  <AlertTriangle size={14} className="text-red-700" />
                                ) : (
                                  <Clock size={14} className="text-stone-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">
                                    Step {idx + 1}: {step.objective}
                                  </span>
                                  <span className="text-[10px] font-mono text-stone-500 uppercase ml-2">
                                    {step.assignedRole.replace('_', ' ')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Subagents Delegation Badges */}
                    {msg.subagents && msg.subagents.length > 0 && (
                      <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
                          <span>Specialist Subagents Dispatched</span>
                          <span className="text-[10px] font-mono text-stone-500">
                            {msg.subagents.filter((s) => s.status === 'completed').length}/{msg.subagents.length} Completed
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.subagents.map((sub) => (
                            <div
                              key={sub.taskId}
                              onClick={() => onInspectSubagent && onInspectSubagent(sub)}
                              className="p-2.5 bg-white border border-stone-200 rounded-lg text-xs space-y-1.5 hover:border-stone-400 transition-colors cursor-pointer"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-stone-900 capitalize">
                                  {sub.role.replace('_', ' ')}
                                </span>
                                <span
                                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                                    sub.status === 'completed'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : sub.status === 'running'
                                      ? 'bg-orange-100 text-orange-800'
                                      : 'bg-stone-200 text-stone-700'
                                  }`}
                                >
                                  {sub.status}
                                </span>
                              </div>
                              <p className="text-[11px] text-stone-500 truncate">{sub.goal}</p>
                              <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                                <span>{sub.tokensUsed} tokens</span>
                                <span>Conf: {(sub.confidence * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tool Approval Card */}
                    {msg.approvalRequest && msg.approvalRequest.status === 'pending' && (
                      <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 space-y-3 shadow-sm">
                        <div className="flex items-start gap-2.5">
                          <ShieldAlert size={20} className="text-amber-800 shrink-0 mt-0.5" />
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-xs text-amber-950 uppercase tracking-wide">
                                Consequential Tool Approval Required
                              </h4>
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-600 text-white uppercase">
                                {msg.approvalRequest.risk} Risk
                              </span>
                            </div>
                            <p className="text-xs text-amber-900 leading-relaxed font-medium">
                              {msg.approvalRequest.summary}
                            </p>
                          </div>
                        </div>

                        <div className="bg-white/80 border border-amber-200 rounded-lg p-2.5 text-[11px] font-mono space-y-1 text-stone-700">
                          <div><strong className="text-stone-900">Destination:</strong> {msg.approvalRequest.destinationSystem}</div>
                          <div><strong className="text-stone-900">Tool:</strong> {msg.approvalRequest.toolName}</div>
                          <div><strong className="text-stone-900">Connector:</strong> {msg.approvalRequest.connectorName}</div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => onApproveTool(msg.approvalRequest!.id)}
                            className="flex-1 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                          >
                            Approve & Execute
                          </button>
                          <button
                            onClick={() => setRejectingApprovalId(msg.approvalRequest!.id)}
                            className="px-4 py-2 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-lg text-xs font-medium transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Blocked Run Continuation Packet (`TOOL-REQ`) */}
                    {msg.continuationPacket && (
                      <div className="bg-red-50/70 border border-red-200 rounded-xl p-4 space-y-3">
                        <div className="flex items-start gap-2.5">
                          <AlertTriangle size={18} className="text-red-700 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-bold">
                                {msg.continuationPacket.reqId}
                              </span>
                              <h4 className="font-semibold text-xs text-red-950">
                                {msg.continuationPacket.title}
                              </h4>
                            </div>
                            <p className="text-xs text-red-900 leading-relaxed">
                              {msg.continuationPacket.reason}
                            </p>
                          </div>
                        </div>

                        {msg.continuationPacket.manualUploadSpec && (
                          <div className="bg-white border border-red-200/80 rounded-lg p-3 text-xs space-y-2">
                            <div className="font-semibold text-stone-900">Upload Specification:</div>
                            <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600">
                              <div><strong>File:</strong> {msg.continuationPacket.manualUploadSpec.filename}</div>
                              <div><strong>Dimensions:</strong> {msg.continuationPacket.manualUploadSpec.dimensions}</div>
                            </div>
                            <button
                              onClick={() => onResumeBlockedRun(msg.continuationPacket!.reqId)}
                              className="w-full mt-2 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                              <UploadCloud size={14} />
                              <span>Upload Asset & Resume Run</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Grounded Citations Bar */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="pt-2 border-t border-stone-100 space-y-1.5">
                        <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                          Grounded Citations ({msg.citations.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.citations.map((cit) => (
                            <button
                              key={cit.id}
                              onClick={() => {
                                setActiveCitation(cit);
                                if (onSelectCitation) onSelectCitation(cit);
                              }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg text-xs text-stone-700 transition-colors"
                              title={cit.snippet}
                            >
                              <FileText size={12} className="text-stone-500" />
                              <span className="truncate max-w-[160px] font-medium">{cit.title}</span>
                              <span className="text-[10px] text-stone-400 font-mono">
                                {(cit.relevanceScore * 100).toFixed(0)}%
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Generated Artifacts Quick Links */}
                    {msg.artifactIds && msg.artifactIds.length > 0 && (
                      <div className="pt-1 flex flex-wrap gap-2">
                        {msg.artifactIds.map((artId) => (
                          <button
                            key={artId}
                            onClick={() => onOpenArtifact(artId)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl text-xs font-semibold text-orange-950 transition-colors shadow-2xs"
                          >
                            <Layers size={14} className="text-orange-700" />
                            <span>Open Artifact in Canvas</span>
                            <ArrowRight size={12} className="text-orange-700" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-stone-800 text-stone-200 flex items-center justify-center shrink-0 mt-0.5 text-xs font-semibold shadow-2xs">
                  FC
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Active Citation Modal Drawer */}
      {activeCitation && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setActiveCitation(null)}
        >
          <div
            className="bg-white border border-stone-200 rounded-2xl max-w-md w-full p-5 space-y-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-orange-700 font-semibold">
                Verified Source Provenance
              </span>
              <span className="text-xs font-mono text-stone-500">
                Score: {(activeCitation.relevanceScore * 100).toFixed(0)}%
              </span>
            </div>
            <h4 className="text-sm font-semibold text-stone-900">{activeCitation.title}</h4>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 leading-relaxed italic">
              "{activeCitation.snippet}"
            </div>
            <button
              onClick={() => setActiveCitation(null)}
              className="w-full py-2 bg-stone-900 text-white rounded-xl text-xs font-medium"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
