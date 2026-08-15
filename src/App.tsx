import React, { useState, useEffect, FormEvent } from 'react';
import { NavigationRail, NavView } from './components/NavigationRail';
import { Header } from './components/Header';
import { ConversationView } from './components/ConversationView';
import { Composer } from './components/Composer';
import { ArtifactCanvas } from './components/ArtifactCanvas';
import { ProjectOverview } from './components/ProjectOverview';
import { SourceManager } from './components/SourceManager';
import { ConnectorRegistry } from './components/ConnectorRegistry';
import { AgentDirectory } from './components/AgentDirectory';
import { SkillDirectory } from './components/SkillDirectory';
import { ScheduledTaskManager } from './components/ScheduledTaskManager';
import { MemoryManager } from './components/MemoryManager';
import { SettingsModal } from './components/SettingsModal';
import { DelegationInspector } from './components/DelegationInspector';
import { MobileTabBar } from './components/MobileTabBar';
import { latticeStore } from './lib/store';
import { agentEngine } from './lib/agentEngine';
import {
  Project,
  Conversation,
  Message,
  Artifact,
  ProjectSource,
  AgentDefinition,
  SkillDefinition,
  RemoteMcpConnector,
  ScheduledTask,
  MemoryItem,
  UserProfile,
  AuditEvent,
  SubagentTask,
  Citation,
  MemoryMode
} from './types';
import { Search, Plus, Layers, X } from 'lucide-react';

export default function App() {
  // Store reactive state
  const [user, setUser] = useState<UserProfile>(latticeStore.getUser());
  const [projects, setProjects] = useState<Project[]>(latticeStore.getProjects());
  const [conversations, setConversations] = useState<Conversation[]>(latticeStore.getConversations());
  const [artifacts, setArtifacts] = useState<Artifact[]>(latticeStore.getArtifacts());
  const [sources, setSources] = useState<ProjectSource[]>(latticeStore.getSources());
  const [agents, setAgents] = useState<AgentDefinition[]>(latticeStore.getAgents());
  const [skills, setSkills] = useState<SkillDefinition[]>(latticeStore.getSkills());
  const [connectors, setConnectors] = useState<RemoteMcpConnector[]>(latticeStore.getConnectors());
  const [schedules, setSchedules] = useState<ScheduledTask[]>(latticeStore.getSchedules());
  const [memories, setMemories] = useState<MemoryItem[]>(latticeStore.getMemories());
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(latticeStore.getAuditLogs());

  // UI state
  const [currentView, setCurrentView] = useState<NavView>('chat');
  const [activeProjectId, setActiveProjectId] = useState<string | undefined>(projects[0]?.id);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(conversations[0]?.id);
  const [activeArtifactId, setActiveArtifactId] = useState<string | undefined>(artifacts[0]?.id);
  const [isArtifactPanelOpen, setIsArtifactPanelOpen] = useState(true);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectedSubagentTask, setInspectedSubagentTask] = useState<SubagentTask | null>(null);

  // Active run state
  const [isRunning, setIsRunning] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('agent_main_default');
  const [activeMemoryMode, setActiveMemoryMode] = useState<MemoryMode>('project_only');

  // New Project modal state
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectMemoryMode, setNewProjectMemoryMode] = useState<MemoryMode>('project_only');

  // Subscribe to store updates
  useEffect(() => {
    const unsub = latticeStore.subscribe(() => {
      setUser(latticeStore.getUser());
      setProjects(latticeStore.getProjects());
      setConversations(latticeStore.getConversations());
      setArtifacts(latticeStore.getArtifacts());
      setSources(latticeStore.getSources());
      setAgents(latticeStore.getAgents());
      setSkills(latticeStore.getSkills());
      setConnectors(latticeStore.getConnectors());
      setSchedules(latticeStore.getSchedules());
      setMemories(latticeStore.getMemories());
      setAuditLogs(latticeStore.getAuditLogs());
    });
    return unsub;
  }, []);

  const activeProject = projects.find((p) => p.id === activeProjectId);
  const activeConversation = conversations.find((c) => c.id === activeConversationId);
  const activeArtifact = artifacts.find((a) => a.id === activeArtifactId) || artifacts[0];
  const messages = latticeStore.getMessages(activeConversationId);
  const currentProjectSources = activeProjectId ? sources.filter((s) => s.projectId === activeProjectId) : [];

  // Handle New Conversation
  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: 'conv_' + Math.random().toString(36).substring(2, 9),
      title: 'New Conversation',
      scope: activeProjectId ? 'project' : 'standalone',
      projectId: activeProjectId,
      agentId: selectedAgentId,
      memoryMode: activeMemoryMode,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    latticeStore.saveConversation(newConv);
    setActiveConversationId(newConv.id);
  };

  // Handle User Message Sending & Agent Execution Loop
  const handleSendMessage = async (content: string, attachedFiles?: File[]) => {
    let currentConvId = activeConversationId;
    if (!currentConvId) {
      const newConv: Conversation = {
        id: 'conv_' + Math.random().toString(36).substring(2, 9),
        title: content.length > 30 ? content.substring(0, 28) + '...' : content,
        scope: activeProjectId ? 'project' : 'standalone',
        projectId: activeProjectId,
        agentId: selectedAgentId,
        memoryMode: activeMemoryMode,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      latticeStore.saveConversation(newConv);
      currentConvId = newConv.id;
      setActiveConversationId(newConv.id);
    }

    // Auto-Title standalone conversation after first meaningful exchange
    const existingMessages = latticeStore.getMessages(currentConvId);
    if (existingMessages.length === 0 && activeConversation) {
      const autoTitle = content.length > 34 ? content.substring(0, 32) + '...' : content;
      latticeStore.saveConversation({ ...activeConversation, title: autoTitle });
    }

    // Create User Message
    const userMsg: Message = {
      id: 'msg_' + Math.random().toString(36).substring(2, 9),
      conversationId: currentConvId,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
      attachments: attachedFiles?.map((f) => ({
        id: 'att_' + Math.random().toString(36).substring(2, 7),
        name: f.name,
        size: f.size,
        mimeType: f.type || 'text/plain'
      }))
    };
    latticeStore.addMessage(userMsg);

    // Create Initial Assistant Placeholder Message
    const assistantMsgId = 'msg_' + Math.random().toString(36).substring(2, 9);
    const assistantMsg: Message = {
      id: assistantMsgId,
      conversationId: currentConvId,
      role: 'assistant',
      turnType: 'plan',
      content: 'Initiating Lattice Parent Orchestrator planning phase...',
      createdAt: new Date().toISOString()
    };
    latticeStore.addMessage(assistantMsg);
    setIsRunning(true);

    try {
      await agentEngine.executeRun(
        content,
        currentConvId,
        activeProjectId,
        activeMemoryMode,
        {
          onPlanCreated: (plan) => {
            latticeStore.updateMessage(assistantMsgId, {
              turnType: 'plan',
              plan,
              content: 'Execution plan formulated. Delegating to specialist subagents...'
            });
          },
          onSubagentProgress: (task) => {
            const current = latticeStore.getMessages(currentConvId).find((m) => m.id === assistantMsgId);
            const currentSubagents = current?.subagents || [];
            const idx = currentSubagents.findIndex((s) => s.taskId === task.taskId);
            let updatedSubagents = [...currentSubagents];
            if (idx >= 0) {
              updatedSubagents[idx] = task;
            } else {
              updatedSubagents.push(task);
            }
            latticeStore.updateMessage(assistantMsgId, {
              turnType: 'tool_progress',
              subagents: updatedSubagents
            });
          },
          onApprovalRequired: (approvalRequest) => {
            latticeStore.updateMessage(assistantMsgId, {
              turnType: 'approval_required',
              approvalRequest,
              content: 'Execution paused. Awaiting explicit human confirmation for consequential tool action.'
            });
            setIsRunning(false);
          },
          onBlockedContinuation: (continuationPacket) => {
            latticeStore.updateMessage(assistantMsgId, {
              turnType: 'blocked_run',
              continuationPacket,
              content: 'Run paused: A required asset or generator is currently unavailable.'
            });
            setIsRunning(false);
          },
          onArtifactCreated: (artifact) => {
            setActiveArtifactId(artifact.id);
            setIsArtifactPanelOpen(true);
            const current = latticeStore.getMessages(currentConvId).find((m) => m.id === assistantMsgId);
            const currentArtIds = current?.artifactIds || [];
            latticeStore.updateMessage(assistantMsgId, {
              artifactIds: [...currentArtIds, artifact.id]
            });
          },
          onComplete: (summary, citations, artifactIds) => {
            latticeStore.updateMessage(assistantMsgId, {
              turnType: 'completion_summary',
              content: summary,
              citations,
              artifactIds
            });
            setIsRunning(false);
          }
        }
      );
    } catch (err: any) {
      console.warn('Agent run error:', err);
      latticeStore.updateMessage(assistantMsgId, {
        turnType: 'blocked_run',
        content: `Run encountered an issue: ${err?.message || 'Unknown error'}. You can retry or adjust parameters.`
      });
      setIsRunning(false);
    }
  };

  // Handle Tool Approvals
  const handleApproveTool = (approvalId: string) => {
    // Mark approval as approved in messages
    const currentMsgs = latticeStore.getMessages(activeConversationId);
    const targetMsg = currentMsgs.find((m) => m.approvalRequest?.id === approvalId);
    if (targetMsg && targetMsg.approvalRequest) {
      latticeStore.updateMessage(targetMsg.id, {
        approvalRequest: { ...targetMsg.approvalRequest, status: 'approved', resolvedAt: new Date().toISOString() },
        content: targetMsg.content + '\n\n**Tool Approved & Executed:** Transaction completed with audit record #aud_drive_success.'
      });
    }
  };

  const handleRejectTool = (approvalId: string, reason?: string) => {
    const currentMsgs = latticeStore.getMessages(activeConversationId);
    const targetMsg = currentMsgs.find((m) => m.approvalRequest?.id === approvalId);
    if (targetMsg && targetMsg.approvalRequest) {
      latticeStore.updateMessage(targetMsg.id, {
        approvalRequest: { ...targetMsg.approvalRequest, status: 'rejected', rejectionReason: reason, resolvedAt: new Date().toISOString() },
        content: targetMsg.content + `\n\n**Tool Action Rejected:** The external write was cancelled by user policy.`
      });
    }
  };

  const handleResumeBlockedRun = (reqId: string) => {
    alert(`Continuation packet ${reqId} received asset. Resuming Phase 3 subagent synthesis...`);
    handleSendMessage('Resume Phase 3 synthesis with provided hero asset.');
  };

  // Handle Project Creation
  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const newProj: Project = {
      id: 'proj_' + Math.random().toString(36).substring(2, 9),
      name: newProjectName.trim(),
      description: newProjectDesc.trim() || 'New strategic workspace.',
      status: 'active',
      instructions: 'Maintain professional, citation-grounded outputs.',
      memoryMode: newProjectMemoryMode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      allowedToolIds: ['tool_exa_search', 'tool_render_mermaid'],
      members: [{ id: user.id, displayName: user.displayName, role: 'owner' }]
    };

    latticeStore.saveProject(newProj);
    setActiveProjectId(newProj.id);
    setIsNewProjectModalOpen(false);
    setNewProjectName('');
    setNewProjectDesc('');
    setCurrentView('projects');
  };

  // Convert conversation to draft skill
  const handleConvertConversationToSkill = (convId: string) => {
    const conv = latticeStore.getConversation(convId);
    if (!conv) return;

    const newSkill: SkillDefinition = {
      id: 'skill_' + Math.random().toString(36).substring(2, 9),
      name: `${conv.title} Workflow`,
      commandTrigger: `/${conv.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 18)}`,
      description: `Synthesized skill drafted from conversation "${conv.title}".`,
      instructions: `Execute the strategic multi-step process defined in ${conv.title}.`,
      requiredCapabilities: ['prompt_synthesis'],
      allowedToolIds: ['tool_exa_search'],
      outputFormat: 'Structured Brief',
      risk: 'low',
      version: '1.0.0',
      enabled: true,
      author: user.displayName
    };

    latticeStore.saveSkill(newSkill);
    setCurrentView('agents_skills');
    alert(`Draft skill "${newSkill.name}" created and added to Skill Directory.`);
  };

  // Export all data
  const handleExportAllData = () => {
    const backup = {
      user,
      projects,
      conversations,
      messages: latticeStore.getMessages(),
      artifacts,
      sources,
      agents,
      skills,
      connectors,
      schedules,
      memories,
      auditLogs,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lattice_workspace_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="lattice-app-root" className="h-screen w-screen flex bg-stone-100 text-stone-900 overflow-hidden font-sans antialiased">
      {/* 1. Left Collapsible Navigation Rail */}
      <NavigationRail
        currentView={currentView}
        onSelectView={setCurrentView}
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={(pId) => {
          setActiveProjectId(pId);
          setCurrentView('projects');
        }}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={(cId) => {
          setActiveConversationId(cId);
          setCurrentView('chat');
        }}
        onNewConversation={handleNewConversation}
        onNewProject={() => setIsNewProjectModalOpen(true)}
        onDeleteConversation={(cId) => latticeStore.deleteConversation(cId)}
        onRenameConversation={(cId, newTitle) => {
          const conv = latticeStore.getConversation(cId);
          if (conv) latticeStore.saveConversation({ ...conv, title: newTitle });
        }}
        onMoveToProject={(cId, pId) => {
          const conv = latticeStore.getConversation(cId);
          if (conv) {
            latticeStore.saveConversation({ ...conv, projectId: pId, scope: 'project' });
            setActiveProjectId(pId);
          }
        }}
        onConvertConversationToSkill={handleConvertConversationToSkill}
        user={user}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isCollapsed={isNavCollapsed}
        onToggleCollapse={() => setIsNavCollapsed(!isNavCollapsed)}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* 2. Main Work & View Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 bg-stone-50">
        {/* Context Top Header */}
        <Header
          activeProject={activeProject}
          activeConversation={activeConversation}
          agents={agents}
          selectedAgentId={selectedAgentId}
          onSelectAgent={setSelectedAgentId}
          memoryMode={activeMemoryMode}
          onChangeMemoryMode={setActiveMemoryMode}
          isArtifactPanelOpen={isArtifactPanelOpen}
          onToggleArtifactPanel={() => setIsArtifactPanelOpen(!isArtifactPanelOpen)}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        {/* Central Dynamic View Switching */}
        <main className="flex-1 flex overflow-hidden min-w-0 pb-14 md:pb-0">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
            {currentView === 'chat' && (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                <ConversationView
                  messages={messages}
                  isRunning={isRunning}
                  onOpenArtifact={(artId) => {
                    setActiveArtifactId(artId);
                    setIsArtifactPanelOpen(true);
                  }}
                  onApproveTool={handleApproveTool}
                  onRejectTool={handleRejectTool}
                  onResumeBlockedRun={handleResumeBlockedRun}
                  onInspectSubagent={(task) => setInspectedSubagentTask(task)}
                />
                <Composer
                  onSendMessage={handleSendMessage}
                  isRunning={isRunning}
                  onCancelRun={() => agentEngine.cancelActiveRun()}
                  skills={skills}
                  agents={agents}
                  connectors={connectors}
                  projectSources={currentProjectSources}
                />
              </div>
            )}

            {currentView === 'projects' && activeProject && (
              <ProjectOverview
                project={activeProject}
                sources={sources.filter((s) => s.projectId === activeProject.id)}
                artifacts={artifacts.filter((a) => a.projectId === activeProject.id)}
                conversations={conversations.filter((c) => c.projectId === activeProject.id)}
                onUpdateProject={(up) => latticeStore.saveProject(up)}
                onDeleteProject={(pId) => {
                  latticeStore.deleteProject(pId);
                  setActiveProjectId(projects[0]?.id);
                }}
                onSelectConversation={(cId) => {
                  setActiveConversationId(cId);
                  setCurrentView('chat');
                }}
                onOpenArtifact={(artId) => {
                  setActiveArtifactId(artId);
                  setIsArtifactPanelOpen(true);
                }}
                onUploadSource={() => setCurrentView('sources')}
                onNewChatInProject={handleNewConversation}
              />
            )}

            {currentView === 'artifacts' && (
              <div className="flex-1 overflow-y-auto p-4 md:p-6 max-w-5xl mx-auto w-full space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h1 className="text-xl font-bold text-stone-900">Artifact Gallery</h1>
                    <p className="text-xs text-stone-500">Durable versioned deliverables synthesized by Lattice specialist subagents.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {artifacts.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => {
                        setActiveArtifactId(art.id);
                        setIsArtifactPanelOpen(true);
                      }}
                      className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3 cursor-pointer hover:border-orange-300 transition-colors flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-orange-50 text-orange-800 font-semibold uppercase">
                          {art.type.replace('_', ' ')}
                        </span>
                        <h4 className="font-bold text-xs text-stone-900 truncate">{art.title}</h4>
                        <p className="text-[11px] text-stone-500 line-clamp-2">{art.description}</p>
                      </div>
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] font-mono text-stone-400">
                        <span>v{art.currentVersion} ({art.versions.length} edits)</span>
                        <span>{new Date(art.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentView === 'sources' && (
              <SourceManager
                sources={sources}
                projects={projects}
                onUploadSource={(name, content, pId) => {
                  const newSrc: ProjectSource = {
                    id: 'src_' + Math.random().toString(36).substring(2, 9),
                    name,
                    projectId: pId,
                    type: name.endsWith('.pdf') ? 'pdf' : name.endsWith('.md') ? 'markdown' : 'document',
                    sizeBytes: content.length,
                    checksum: 'sha256:' + Math.random().toString(36).substring(2, 12),
                    extractionQuality: 'high',
                    extractedText: content,
                    tokenCount: Math.round(content.length / 4),
                    uploadedAt: new Date().toISOString(),
                    visibility: 'project_members'
                  };
                  latticeStore.addSource(newSrc);
                }}
                onDeleteSource={(sId) => latticeStore.deleteSource(sId)}
              />
            )}

            {currentView === 'connections' && (
              <ConnectorRegistry
                connectors={connectors}
                onSaveConnector={(conn) => latticeStore.saveConnector(conn)}
                onDeleteConnector={(cId) => latticeStore.deleteConnector(cId)}
              />
            )}

            {currentView === 'agents_skills' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <AgentDirectory
                  agents={agents}
                  onSaveAgent={(ag) => latticeStore.saveAgent(ag)}
                />
              </div>
            )}

            {currentView === 'schedules' && (
              <ScheduledTaskManager
                schedules={schedules}
                projects={projects}
                onSaveSchedule={(sch) => latticeStore.saveSchedule(sch)}
                onRunScheduleNow={(schId) => {
                  const sch = schedules.find((s) => s.id === schId);
                  if (sch) handleSendMessage(sch.prompt);
                }}
              />
            )}

            {currentView === 'memory' && (
              <MemoryManager
                memories={memories}
                user={user}
                projects={projects}
                onToggleGlobalMemory={() => latticeStore.updateUser({ globalMemoryEnabled: !user.globalMemoryEnabled })}
                onSaveMemory={(mem) => latticeStore.saveMemory(mem)}
                onDeleteMemory={(mId) => latticeStore.deleteMemory(mId)}
                onClearAllMemories={() => latticeStore.clearAllMemories()}
              />
            )}
          </div>

          {/* 3. Right Contextual Artifact Canvas Panel - Responsive for Mobile vs Tablet/Desktop */}
          {isArtifactPanelOpen && activeArtifact && (
            <div
              id="artifact-canvas-wrapper"
              className="fixed inset-0 z-40 md:static md:z-auto w-full md:w-[380px] lg:w-[460px] xl:w-[540px] h-full shrink-0 bg-white"
            >
              <ArtifactCanvas
                artifact={activeArtifact}
                onClose={() => setIsArtifactPanelOpen(false)}
                onSaveVersion={(artId, newContent, changeSummary) => {
                  const art = artifacts.find((a) => a.id === artId);
                  if (art) {
                    const newVer = art.currentVersion + 1;
                    const updated: Artifact = {
                      ...art,
                      currentVersion: newVer,
                      updatedAt: new Date().toISOString(),
                      versions: [
                        ...art.versions,
                        {
                          version: newVer,
                          content: newContent,
                          changeSummary,
                          createdAt: new Date().toISOString()
                        }
                      ]
                    };
                    latticeStore.saveArtifact(updated);
                  }
                }}
                onPromptRevision={(prompt, art) => {
                  handleSendMessage(`Revise artifact "${art.title}": ${prompt}`);
                }}
                onSaveToProjectSources={(art) => {
                  const newSrc: ProjectSource = {
                    id: 'src_' + Math.random().toString(36).substring(2, 9),
                    name: `${art.title.replace(/\s+/g, '_')}.md`,
                    projectId: activeProjectId,
                    type: 'markdown',
                    sizeBytes: art.versions[art.versions.length - 1].content.length,
                    checksum: 'sha256:' + Math.random().toString(36).substring(2, 10),
                    extractionQuality: 'high',
                    extractedText: art.versions[art.versions.length - 1].content,
                    tokenCount: Math.round(art.versions[art.versions.length - 1].content.length / 4),
                    uploadedAt: new Date().toISOString(),
                    visibility: 'project_members'
                  };
                  latticeStore.addSource(newSrc);
                  alert(`Artifact "${art.title}" indexed as Project Knowledge Source.`);
                }}
              />
            </div>
          )}
        </main>

        {/* 4. Dedicated Mobile Bottom Tab Bar (Phone Experience) */}
        <MobileTabBar
          currentView={currentView}
          onSelectView={setCurrentView}
          onOpenMobileMenu={() => setIsMobileNavOpen(true)}
          artifactsCount={artifacts.length}
        />
      </div>

      {/* Global Quick Search Modal (Cmd+K) */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-white border border-stone-200 rounded-2xl max-w-lg w-full p-4 space-y-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="Search across conversations, projects, artifacts, sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-900"
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1 text-xs">
              {artifacts
                .filter((a) => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      setActiveArtifactId(a.id);
                      setIsArtifactPanelOpen(true);
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-stone-100 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Layers size={14} className="text-orange-700" />
                      <span className="font-medium text-stone-900">{a.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-stone-400">Artifact</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {isNewProjectModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsNewProjectModalOpen(false)}
        >
          <div
            className="bg-white border border-stone-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-stone-900">Create New Project Workspace</h3>
              <button onClick={() => setIsNewProjectModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. Nordic Sustainable Furniture"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  placeholder="Briefly state project mission and scope..."
                  rows={2}
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">Memory Isolation Mode</label>
                <select
                  value={newProjectMemoryMode}
                  onChange={(e: any) => setNewProjectMemoryMode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:outline-none"
                >
                  <option value="project_only">Project-Only (Strictly Isolated)</option>
                  <option value="global">Allow Global Memory</option>
                  <option value="temporary_off">No Memory</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-3 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newProjectName.trim()}
                  className="px-4 py-2 bg-stone-900 hover:bg-orange-700 text-white rounded-xl font-semibold disabled:opacity-40"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subagent Task Inspector Modal */}
      {inspectedSubagentTask && (
        <DelegationInspector
          task={inspectedSubagentTask}
          onClose={() => setInspectedSubagentTask(null)}
          onPromoteToArtifact={(task) => {
            const promoted: Artifact = {
              id: 'art_' + Math.random().toString(36).substring(2, 9),
              title: `${task.role.replace('_', ' ').toUpperCase()} Promoted Deliverable`,
              description: `Promoted subagent task output: ${task.goal}`,
              type: 'markdown',
              currentVersion: 1,
              projectId: activeProjectId,
              conversationId: activeConversationId || 'standalone',
              status: 'rendered',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              tags: ['Promoted', task.role.toUpperCase()],
              versions: [
                {
                  version: 1,
                  content: `# ${task.role.replace('_', ' ').toUpperCase()} Output\n\n${JSON.stringify(task.outputPayload || task.inputPayload, null, 2)}`,
                  changeSummary: 'Promoted from subagent inspection',
                  createdAt: new Date().toISOString()
                }
              ]
            };
            latticeStore.saveArtifact(promoted);
            setActiveArtifactId(promoted.id);
            setIsArtifactPanelOpen(true);
            setInspectedSubagentTask(null);
          }}
        />
      )}

      {/* Workspace Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onUpdateUser={(up) => latticeStore.updateUser(up)}
        auditLogs={auditLogs}
        onExportAllData={handleExportAllData}
      />
    </div>
  );
}
