/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  MessageSquare,
  History,
  FolderOpen,
  Settings,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Database,
  TrendingUp,
  TrendingDown,
  Microscope,
  FileText,
  UploadCloud,
  X,
  Send,
  Paperclip,
  Mic,
  Camera,
  Smile,
  Info,
  Bell,
  HelpCircle,
  UserCircle,
  Trash2,
  Play,
  Folder,
  Sliders,
  Sparkles,
  RefreshCw,
  Cpu,
  Brain
} from 'lucide-react';

import { ActiveView, BreedingTask, SystemAlert, ChatMessage, StatusItem } from './types';
import {
  INITIAL_METRICS,
  INITIAL_TASKS,
  INITIAL_ALERTS,
  DEFAULT_CHAT_MESSAGES,
  SAMPLE_FILES,
  HISTORICAL_LOGS,
} from './data';

export default function App() {
  // Views and Navigation
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [tasks, setTasks] = useState<BreedingTask[]>(INITIAL_TASKS);
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(DEFAULT_CHAT_MESSAGES);
  const [filesList, setFilesList] = useState(SAMPLE_FILES);
  
  // Search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom dialogs & modals
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  // Chat inputs
  const [chatInputText, setChatInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Settings view details
  const [aiTemperature, setAiTemperature] = useState(0.7);
  const [currentModel, setCurrentModel] = useState('gemini-3.5-flash');
  const [scientificAssistanceChecked, setScientificAssistanceChecked] = useState(true);

  // New task form fields
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskCrop, setNewTaskCrop] = useState('玉米');
  const [newTaskDuration, setNewTaskDuration] = useState('3h 30m');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll in Chat View
  useEffect(() => {
    if (activeView === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeView]);

  // Dynamic Progress Tracking Simulation
  // Progress increments every 6 seconds to bring the dashboard dynamically to life
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.status === 'RUNNING') {
            const nextProgress = task.progress + Math.floor(Math.random() * 4) + 1;
            if (nextProgress >= 100) {
              return {
                ...task,
                progress: 100,
                status: 'COMPLETED',
                expectedTime: '--',
              };
            }
            return {
              ...task,
              progress: nextProgress,
            };
          }
          return task;
        })
      );
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Handler to stop/cancel a task
  const handleCancelTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'FAILED', expectedTime: '--' } : t));
  };

  // Handler to rerun a task
  const handleRerunTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'RUNNING', progress: 5, expectedTime: '4h 20m' } : t));
  };

  // Handler to create a task via modal
  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    const newTask: BreedingTask = {
      id: `TASK-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
      name: `${newTaskCrop} - ${newTaskName}`,
      progress: 5,
      status: 'RUNNING',
      expectedTime: newTaskDuration || '2h 45m',
    };

    setTasks(prev => [newTask, ...prev]);
    setIsNewTaskModalOpen(false);
    setNewTaskName('');
    
    // Add info log
    const newAlert: SystemAlert = {
      id: `alert-${Date.now()}`,
      title: '后台育种计算已启动',
      description: `针对[${newTaskCrop}]的分析任务 "${newTaskName}" 正在运行高通量对齐...`,
      level: 'info',
      time: '刚刚',
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  // Dismiss a live warning alert
  const handleDismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  // Handle active file uploading simulation
  const handleTriggerSimulatedUpload = (category: 'seq' | 'img') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = () => {
      const mockName = category === 'seq' ? 'raw_genome_batch09_uploaded.fa' : 'phenotype_growth_t20_camera.png';
      const mockSize = category === 'seq' ? '294 MB' : '18 MB';
      const newFileObj = {
        name: mockName,
        type: category === 'seq' ? 'High-Throughput FASTA' : 'Phenotypic Image Capture',
        size: mockSize,
        date: new Date().toISOString().split('T')[0]
      };
      
      setFilesList(prev => [newFileObj, ...prev]);

      // Automatically launch task
      const linkTask: BreedingTask = {
        id: `TASK-UP-${Math.floor(Math.random() * 900 + 100)}`,
        name: `序列比对分析 - ${mockName}`,
        progress: 15,
        status: 'RUNNING',
        expectedTime: '1h 50m',
      };
      setTasks(prev => [linkTask, ...prev]);

      // If we are in Chat mode, report to chat
      if (activeView === 'chat') {
        const uploadAlertMsg: ChatMessage = {
          id: `msg-up-${Date.now()}`,
          sender: 'ai',
          senderName: 'AI 助手',
          time: '刚刚',
          text: `📊 **自动育种任务挂载成功！** 检测到您上传了文件 \`${mockName}\` (${mockSize})，系统已自动创建测序处理作业 \`${linkTask.id}\` 并调拨计算资源。当前任务对齐进度 15%。`,
        };
        setChatMessages(prev => [...prev, uploadAlertMsg]);
      } else {
        alert(`文件 "${mockName}" 已上传。已在驾驶舱创建对应的全基因组提取作业！`);
      }
    };
    input.click();
  };

  // Live message submissions (interfacing to actual Express server proxy and Gemini API)
  const handleSendChatMessage = async () => {
    if (!chatInputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-msg-${Date.now()}`,
      sender: 'user',
      senderName: '张博士',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      text: chatInputText,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      const data = await response.json();
      setIsTyping(false);

      const aiReply: ChatMessage = {
        id: `ai-msg-${Date.now()}`,
        sender: 'ai',
        senderName: 'AI 助手',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        text: data.text || '分析出错，请稍后重试。',
      };

      setChatMessages((prev) => [...prev, aiReply]);

      // If AI answer mentions generating reports or completed, we can dynamically add a task
      if (chatInputText.toLowerCase().includes('a07') || chatInputText.includes('报告')) {
        // Toggle completed report view simulation or add tasks
      }

    } catch (err) {
      setIsTyping(false);
      const errorMsg: ChatMessage = {
        id: `error-msg-${Date.now()}`,
        sender: 'ai',
        senderName: 'AI 助手',
        time: '刚刚',
        text: '❌ **网络或API连接故障。** 请在 **设置 > 密钥** 检查服务器上的 API 密钥设定是否就合。目前可以使用预置模拟数据集进行无缝演示或继续研究。',
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    }
  };

  // Helper filter to support user searching
  const filteredTasks = tasks.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full bg-slate-100 font-sans text-slate-800 antialiased overflow-hidden select-none">
      
      {/* SideNavBar (Shared Navigation Component) */}
      <aside className="w-[280px] h-full bg-brand-slate flex flex-col shrink-0 border-r border-[#3f4a3d]/30 z-30 shadow-xl">
        {/* Banner/Header */}
        <div className="p-6 pb-4 border-b border-emerald-990/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/40">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-sans font-bold text-xl text-white tracking-tight leading-none">Breeding AI</h1>
              <p className="text-emerald-400 text-xs font-semibold mt-1">v2.4 • 系统正常运行</p>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto chat-scrollbar">
          <div className="text-[10px] uppercase font-bold text-slate-400/70 tracking-widest px-3 mb-2">主控面板</div>
          
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeView === 'dashboard'
                ? 'bg-emerald-800/40 text-emerald-300 border-l-4 border-emerald-500 shadow-inner'
                : 'text-slate-300 hover:bg-slate-800/40 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>育种驾驶舱</span>
          </button>

          <button
            onClick={() => setActiveView('chat')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeView === 'chat'
                ? 'bg-emerald-800/40 text-emerald-300 border-l-4 border-emerald-500 shadow-inner'
                : 'text-slate-300 hover:bg-slate-800/40 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span className="flex-1 text-left">智能对话</span>
            <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">LIVE</span>
          </button>

          <button
            onClick={() => setActiveView('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeView === 'history'
                ? 'bg-emerald-800/40 text-emerald-300 border-l-4 border-emerald-500 shadow-inner'
                : 'text-slate-300 hover:bg-slate-800/40 hover:text-white'
            }`}
          >
            <History className="w-4 h-4 shrink-0" />
            <span>历史记录</span>
          </button>

          <button
            onClick={() => setActiveView('files')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeView === 'files'
                ? 'bg-emerald-800/40 text-emerald-300 border-l-4 border-emerald-500 shadow-inner'
                : 'text-slate-300 hover:bg-slate-800/40 hover:text-white'
            }`}
          >
            <FolderOpen className="w-4 h-4 shrink-0" />
            <span>文件中心</span>
          </button>

          <button
            onClick={() => setActiveView('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeView === 'settings'
                ? 'bg-emerald-800/40 text-emerald-300 border-l-4 border-emerald-500 shadow-inner'
                : 'text-slate-300 hover:bg-slate-800/40 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>参数设置</span>
          </button>

          {/* Context Specific Panel inside Left rail from Mockup */}
          <div className="pt-6 border-t border-slate-700/40 mt-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-3">最近运行的任务</p>
            <div className="space-y-1.5 px-1">
              <div 
                onClick={() => { setActiveView('dashboard'); setSearchQuery('玉米'); }}
                className="p-2.5 rounded-lg bg-emerald-900/15 border border-slate-700/30 hover:bg-emerald-950/25 transition-all text-left cursor-pointer"
              >
                <div className="text-xs font-semibold text-slate-100 truncate">玉米产量预测</div>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-emerald-400">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span>计算活跃运行</span>
                </div>
              </div>

              <div 
                onClick={() => { setActiveView('dashboard'); setSearchQuery('水稻'); }}
                className="p-2.5 rounded-lg bg-slate-800/20 border border-slate-700/10 hover:bg-slate-800/40 transition-all text-left cursor-pointer"
              >
                <div className="text-xs font-semibold text-slate-300 truncate">水稻基因对比</div>
                <div className="text-[10px] text-slate-400 mt-1">2小时前更新</div>
              </div>

              <div 
                onClick={() => { setActiveView('dashboard'); setSearchQuery('小麦'); }}
                className="p-2.5 rounded-lg bg-slate-800/20 border border-slate-700/10 hover:bg-slate-800/40 transition-all text-left cursor-pointer"
              >
                <div className="text-xs font-semibold text-slate-300 truncate">小麦抗旱基因分析</div>
                <div className="text-[10px] text-emerald-500 mt-1">已成功归档</div>
              </div>
            </div>
          </div>
        </nav>

        {/* Action Button: New analysis */}
        <div className="p-4 border-t border-slate-700/40 space-y-4">
          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-4 font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-150 transform active:scale-[0.98] shadow-md shadow-emerald-900/20 cursor-pointer text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>新建分析</span>
          </button>

          {/* User profile footer */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-700/30">
            <div className="w-9 h-9 rounded-full bg-emerald-950/40 overflow-hidden flex items-center justify-center border border-slate-600">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiepEPo5dZFr_QN46IIxGwmo06IsQOgwHELwDbJrsQ7z-lWj01yecpKVWe4V179d_s99820zmoIuaYoOl_HkGcZ2-_Qa4-Oe6vmVWKB3GFSCVSH1xQy4HE7VZckUojXN_0K0-TnYNzO3m5X41Mr8lFs8la5srw9jewL4d3G-8RnnbKknIgvbL4_CFSkuFY6v9K5-ho0aljSGyQjNB2TicscuydklbjBPbWaYewGer9p4la44xsUWyAFeELkKvoDhk8W7E-Wey7NV0"
                alt="Profile"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 truncate">
              <p className="text-xs font-bold text-white leading-tight truncate">管理员 (张教授)</p>
              <p className="text-[10px] text-slate-400 mt-0.5">高级学术分子育种研究员</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-[#f5f5f5] overflow-hidden">
        
        {/* TopNavBar Component */}
        <header className="h-16 w-full bg-white border-b border-slate-200 flex justify-between items-center px-6 shrink-0 shadow-sm z-20">
          <div className="flex items-center gap-4">
            <h2 className="font-sans text-lg font-bold text-slate-800 tracking-tight">
              {activeView === 'dashboard' && '育种智能驾驶舱'}
              {activeView === 'chat' && '育种AI学术助手'}
              {activeView === 'history' && '历史育种日志'}
              {activeView === 'files' && '高通量多维文件中心'}
              {activeView === 'settings' && 'AI 模型参数设定'}
            </h2>
            <div className="h-4 w-[1px] bg-slate-300"></div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              {activeView === 'dashboard' ? 'Breeding Dashboard' : 'AI Analysis Hub'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Search filter text input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450 w-4 h-4" />
              <input
                type="text"
                placeholder="搜索任务或基因座..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-slate-100 border border-slate-300 rounded-full text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white w-64 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => {
                  const alertMsg = "农业智能育种系统 v2.4 对接全基因重测序数据库, 搭载高吞吐、多倍体特异聚类算子。";
                  alert(alertMsg);
                }}
                className="hover:bg-slate-100 rounded-full p-2 text-slate-500 transition-colors cursor-pointer"
                title="应用信息"
              >
                <Info className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => {
                  alert("近期同步数据正常：共4个活跃任务，Node-04 正常调配计算核心。");
                }}
                className="hover:bg-slate-100 rounded-full p-2 text-slate-500 transition-colors relative cursor-pointer"
                title="系统通知"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <button 
                onClick={() => {
                  setActiveView('settings');
                }}
                className="hover:bg-slate-100 rounded-full p-2 text-slate-500 transition-colors cursor-pointer"
                title="帮助手册"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Screen Contents */}
        <div className="flex-1 w-full overflow-y-auto chat-scrollbar p-6">
          <AnimatePresence mode="wait">
            
            {/* 1. Dashboard View (驾驶舱) */}
            {activeView === 'dashboard' && (
              <motion.div
                key="dashboard-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 max-w-[1400px] mx-auto w-full"
              >
                {/* Core Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {INITIAL_METRICS.map((metric) => (
                    <div
                      key={metric.id}
                      className="bg-white border border-slate-200 p-5 rounded-xl hover:border-emerald-600 transition-all duration-300 shadow-sm flex flex-col group relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-semibold text-slate-500">{metric.title}</span>
                        <div className={`p-1.5 rounded-lg ${metric.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {metric.id === 'active_experiments' && <Microscope className="w-4 h-4" />}
                          {metric.id === 'germplasm_resources' && <Database className="w-4 h-4" />}
                          {metric.id === 'breeding_success_rate' && <CheckCircle2 className="w-4 h-4" />}
                          {metric.id === 'analyzed_genomes' && <Cpu className="w-4 h-4" />}
                        </div>
                      </div>
                      
                      <div className="flex items-end gap-2 mb-2 z-10">
                        <span className="font-sans font-bold text-3xl text-slate-900 tracking-tight">{metric.value}</span>
                        <span className={`text-xs font-bold mb-1 flex items-center gap-0.5 ${metric.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {metric.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                          {metric.change}
                        </span>
                      </div>

                      {/* SVG Mini Sparklines mirroring Mockup */}
                      <div className="h-10 mt-auto w-full pt-1">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 200 40">
                          <path
                            d={metric.sparklinePath}
                            fill="none"
                            stroke={metric.strokeColor}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                          />
                          <circle cx="200" cy={metric.id === 'breeding_success_rate' ? 30 : 15} fill={metric.strokeColor} r="3" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Main section: Tasks list + Alerts details */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Ongoing tasks */}
                  <div className="xl:col-span-8 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-sans font-bold text-base text-slate-800 flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-emerald-600" />
                        <span>正在进行的繁育任务</span>
                      </h3>
                      <button 
                        onClick={() => setIsNewTaskModalOpen(true)}
                        className="text-emerald-600 hover:text-emerald-700 text-xs font-bold flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        快速挂载任务 <Plus className="w-4.5 h-4.5" />
                      </button>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">任务名称 & ID</th>
                              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">分析进度</th>
                              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">运行状态</th>
                              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">预计耗时</th>
                              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">管理操作</th>
                            </tr>
                          </thead>
                          
                          <tbody className="divide-y divide-slate-100 font-sans">
                            {filteredTasks.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="text-center py-8 text-xs text-slate-400 font-medium">
                                  没有找到匹配的育种作业。单击上方“快速挂载任务”开始。
                                </td>
                              </tr>
                            ) : (
                              filteredTasks.map((task) => (
                                <tr key={task.id} className="hover:bg-emerald-50/20 transition-colors group">
                                  <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                      <span className="text-sm font-bold text-slate-800">{task.name}</span>
                                      <span className="text-xs text-slate-400 mt-1 font-mono tracking-wider">ID: {task.id}</span>
                                    </div>
                                  </td>
                                  
                                  <td className="px-6 py-4">
                                    <div className="w-44">
                                      <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-xs font-bold text-slate-700">{task.progress}%</span>
                                      </div>
                                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                        <div
                                          className={`h-full rounded-full transition-all duration-500 ${
                                            task.status === 'FAILED' ? 'bg-red-500' : 'bg-emerald-600'
                                          }`}
                                          style={{ width: `${task.progress}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  </td>
                                  
                                  <td className="px-6 py-4">
                                    <span
                                      className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider inline-flex items-center gap-1.5 ${
                                        task.status === 'RUNNING'
                                          ? 'text-sky-600 bg-sky-55/60 border border-sky-100'
                                          : task.status === 'COMPLETED'
                                          ? 'text-emerald-600 bg-emerald-55/60 border border-emerald-100'
                                          : 'text-rose-600 bg-rose-55/60 border border-rose-100'
                                      }`}
                                    >
                                      {task.status === 'RUNNING' && <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping"></span>}
                                      {task.status === 'COMPLETED' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                                      {task.status === 'FAILED' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>}
                                      {task.status === 'RUNNING' ? '分析中' : task.status === 'COMPLETED' ? '已完成' : '已终止'}
                                    </span>
                                  </td>
                                  
                                  <td className="px-6 py-4 text-xs font-semibold text-slate-500 font-mono">
                                    {task.expectedTime}
                                  </td>
                                  
                                  <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                      {task.status === 'RUNNING' ? (
                                        <button
                                          onClick={() => handleCancelTask(task.id)}
                                          className="p-1 px-2 hover:bg-rose-50 text-rose-600 rounded text-xs font-bold border border-rose-200 cursor-pointer"
                                          title="中止计算作业"
                                        >
                                          中止
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => handleRerunTask(task.id)}
                                          className="p-1 px-2 hover:bg-emerald-50 text-emerald-600 rounded text-xs font-bold border border-emerald-200 cursor-pointer"
                                          title="重新调配计算"
                                        >
                                          重算
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Health and warnings widget */}
                  <div className="xl:col-span-4 space-y-4">
                    <h3 className="font-sans font-bold text-base text-slate-800 flex items-center gap-2">
                      <AlertTriangle className="w-4 text-emerald-600" />
                      <span>系统状态与预警监控</span>
                    </h3>

                    {/* Alert cards with transitions */}
                    <div className="space-y-3">
                      <AnimatePresence>
                        {alerts.map((alert) => (
                          <motion.div
                            key={alert.id}
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className={`p-4 rounded-xl border flex gap-3 relative overflow-hidden shadow-sm ${
                              alert.level === 'error'
                                ? 'bg-rose-50 border-rose-200 text-rose-950'
                                : alert.level === 'warning'
                                ? 'bg-[#FFF9E6] border-[#FFE082] text-amber-950 animate-pulse'
                                : 'bg-sky-50 border-sky-200 text-sky-950'
                            }`}
                          >
                            <div className="shrink-0 mt-0.5">
                              {alert.level === 'error' && <XCircle className="w-5 h-5 text-rose-600" />}
                              {alert.level === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                              {alert.level === 'info' && <CheckCircle2 className="w-5 h-5 text-sky-600" />}
                            </div>

                            <div className="flex-1 pr-4">
                              <p className="text-xs font-bold leading-tight">{alert.title}</p>
                              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{alert.description}</p>
                              <span className="text-[10px] font-bold text-slate-400 block mt-2">{alert.time}</span>
                            </div>

                            <button
                              onClick={() => handleDismissAlert(alert.id)}
                              className="absolute top-3 right-3 text-slate-450 hover:text-slate-700 hover:bg-slate-200/40 p-1 rounded transition-colors"
                              title="忽略警告"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Overall System Health Progress widgets */}
                    <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">系统算力与存储一览</p>
                      
                      <div className="space-y-3.5">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-600">基因数据集存储集群</span>
                            <span className="font-bold text-slate-800">82%</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="bg-emerald-600 h-full rounded-full" style={{ width: '82%' }}></div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-600">核心计算资源节点</span>
                            <span className="font-bold text-amber-600">91%</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full rounded-full" style={{ width: '91%' }}></div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-600">API 重测序解析响应</span>
                            <span className="font-bold text-emerald-600">124ms</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '30%' }}></div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">在线研究员人数</p>
                          <p className="text-xl font-black text-slate-800 tracking-tight mt-0.5">12 人</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">活跃测序算力引擎</p>
                          <p className="text-xl font-black text-slate-800 tracking-tight mt-0.5">04 组</p>
                        </div>
                      </div>
                    </div>

                    {/* Scientific Summary leaf photo block from the Mockup */}
                    <div 
                      onClick={() => setIsReportModalOpen(true)}
                      className="relative rounded-xl overflow-hidden h-40 group cursor-pointer shadow-md border border-slate-200"
                    >
                      <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB138a3GEdpO5o_XzzbL8kTI8ygc7lvLmreHp6MOrGQXX0IrEsOi8eh7ZScqP-hgrtyZuio1NLkdz0dfklscmskXNWeN72IEiMtgNstxAzeIscHUg5V1neUHsjGlgLsUOiwVfuKj-VOzwhMOefp6rio91BTLPFrfquFm2Rz2MrDB5UaP6PU1MUNqTn8M0o_7NrgQolWD9gN3oAlxi01NrdEO_YmlZoM_HIk011-VCvoWsWK_yS3lkRlhzXGfJTJFtfTslxmt2pyvc8"
                        alt="Macro soybean leaf showing complex vein structure"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-transparent p-4 flex flex-col justify-end">
                        <p className="text-white text-xs font-bold">查看最新高密度育种分析报告</p>
                        <p className="text-emerald-400 text-[10px] mt-0.5">2026年春季作物基因改良研究总结 &rarr;</p>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. Interactive Chat View (对话) */}
            {activeView === 'chat' && (
              <motion.div
                key="chat-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col h-[calc(100vh-120px)] max-w-[900px] mx-auto w-full bg-white border border-slate-250 rounded-xl overflow-hidden shadow-lg relative"
              >
                {/* Chat Stream Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 border-b border-slate-100 chat-scrollbar flex flex-col">
                  
                  {/* Timeline Badge indicating active date */}
                  <div className="flex justify-center my-2 shrink-0">
                    <span className="px-3.5 py-1 bg-slate-200/70 border border-slate-300 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Today, Oct 24
                    </span>
                  </div>

                  {/* Messages flow */}
                  <div className="flex-1 space-y-6">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 items-start ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center shadow-sm border ${
                          msg.sender === 'user' ? 'bg-slate-800 border-slate-900' : 'bg-emerald-600 border-emerald-700'
                        }`}>
                          {msg.sender === 'user' ? (
                            <UserCircle className="w-5 h-5 text-white" />
                          ) : (
                            <Brain className="w-5 h-5 text-white" />
                          )}
                        </div>

                        {/* Speech Bubble */}
                        <div className={`flex flex-col max-w-[75%] gap-1 ${msg.sender === 'user' ? 'items-end' : ''}`}>
                          <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-slate-800 text-white rounded-tr-none'
                              : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                          }`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            
                            {/* Nested Status Items embedded inside Chat Stream, mirroring design mockups */}
                            {msg.statusItems && msg.statusItems.length > 0 && (
                              <div className="mt-4 space-y-3 pt-3 border-t border-slate-100">
                                {msg.statusItems.map((item) => (
                                  <div
                                    key={item.id}
                                    className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl flex flex-col"
                                  >
                                    <div className="flex items-center justify-between mb-1.5">
                                      <div className="flex items-center gap-2.5">
                                        {item.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                                        {item.status === 'processing' && <RefreshCw className="w-4 h-4 text-sky-500 animate-spin" />}
                                        {item.status === 'failed' && <XCircle className="w-4 h-4 text-rose-500" />}
                                        <span className="text-xs font-bold text-slate-850">{item.title}</span>
                                      </div>
                                      
                                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${
                                        item.status === 'completed'
                                          ? 'text-emerald-700 bg-emerald-50'
                                          : item.status === 'processing'
                                          ? 'text-sky-700 bg-sky-50'
                                          : 'text-rose-700 bg-rose-50'
                                      }`}>
                                        {item.status === 'completed' ? '已完成' : item.status === 'processing' ? '处理中' : '失败'}
                                      </span>
                                    </div>

                                    {/* Action message indicator inside bubble status block */}
                                    {item.progressMsg && (
                                      <div className="space-y-1 mt-1">
                                        <div className="flex justify-between text-[10px] text-slate-500">
                                          <span>{item.progressMsg}</span>
                                          <span className="font-bold">{item.progress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                          <div className="bg-sky-500 h-full rounded-full transition-all" style={{ width: `${item.progress}%` }}></div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {/* Subtext info */}
                          <span className="text-[10px] text-slate-400 font-bold px-1 mt-0.5">
                            {msg.senderName} • {msg.time}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Loader typing indicator */}
                    {isTyping && (
                      <div className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 shrink-0 flex items-center justify-center border border-emerald-700 shadow-sm animate-pulse">
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col max-w-[75%] gap-1">
                          <div className="px-4 py-2.5 rounded-2xl bg-white text-slate-500 border border-slate-200 rounded-tl-none text-xs font-semibold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            <span>正在进行多层次组学及基因型预测数据校阅...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </div>

                {/* Chat input controls toolbar */}
                <div className="p-4 bg-white shrink-0 border-t border-slate-200">
                  <div className="flex items-center gap-1.5 mb-3 px-1">
                    <button
                      onClick={() => handleTriggerSimulatedUpload('seq')}
                      className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-emerald-700 rounded-lg transition-colors cursor-pointer"
                      title="上传作物重测序基因组(Batch/CSV/Fasta)"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => {
                        alert("微音传感器已启动：正在对语意作物对比参数实施高通量过滤。你可以用正常的文字描述开展快速分析。");
                      }}
                      className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-emerald-700 rounded-lg transition-colors cursor-pointer"
                      title="开启科学话筒翻译"
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => handleTriggerSimulatedUpload('img')}
                      className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-emerald-700 rounded-lg transition-colors cursor-pointer"
                      title="上传表型田间叶片与根系图像"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => {
                        alert("学术标注及图例菜单开启，你可以直接选用核心突变子、大豆、小麦或环境指示标签。");
                      }}
                      className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-emerald-700 rounded-lg transition-colors cursor-pointer"
                      title="插入基因与突变标记符号"
                    >
                      <Smile className="w-5 h-5" />
                    </button>

                    <div className="ml-auto flex items-center gap-1.5 select-none">
                      <span className="text-[10px] bg-slate-100 text-slate-500 font-bold border border-slate-200 px-2 py-0.5 rounded">
                        模型: {currentModel}
                      </span>
                    </div>
                  </div>

                  {/* Core Form Area */}
                  <div className="relative">
                    <textarea
                      value={chatInputText}
                      onChange={(e) => setChatInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendChatMessage();
                        }
                      }}
                      placeholder="发送科研指令或提交重测序分析，如：'请评估 A07 在耐高温性上的显著表达座'"
                      rows={2}
                      className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl py-3 pl-4 pr-24 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none text-sm text-slate-800 transition-all resize-none font-sans"
                    ></textarea>
                    
                    <div className="absolute right-3.5 bottom-3">
                      <button
                        onClick={handleSendChatMessage}
                        disabled={!chatInputText.trim()}
                        className={`px-5 py-2 rounded-lg font-bold text-xs transition-all duration-150 flex items-center gap-1.5 border cursor-pointer ${
                          chatInputText.trim()
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-transparent'
                            : 'bg-slate-100 text-slate-450 border-slate-200'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>发送</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-center text-[10px] text-slate-400 mt-3 font-semibold">
                    Powered by Agri-Breeding AI Engine • Precision Agriculture for Global Sustainability
                  </p>
                </div>
              </motion.div>
            )}

            {/* 3. History View (历史记录) */}
            {activeView === 'history' && (
              <motion.div
                key="history-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 max-w-[1000px] mx-auto w-full"
              >
                <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h3 className="font-sans font-bold text-base text-slate-800">历史分子育种日志及方案</h3>
                    <span className="text-xs text-slate-400 font-medium">共 4 份历史方案档案</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {HISTORICAL_LOGS.map((log, index) => (
                      <div key={index} className="py-4 hover:bg-slate-50/50 p-2 rounded-lg transition-colors flex justify-between items-start gap-3">
                        <div className="space-y-1">
                          <p className="font-bold text-sm text-slate-800 hover:text-emerald-700 cursor-pointer">{log.title}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold">
                            <span>主导人: {log.researcher}</span>
                            <span>归档分类: {log.type}</span>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <span className="text-[10px] font-mono font-bold bg-slate-150 px-2 py-0.5 rounded text-slate-500 block">
                            {log.date}
                          </span>
                          <button 
                            onClick={() => {
                              alert(`正在下载 "${log.title}" 的高通量图谱与完整归档包以供离线使用...`);
                            }} 
                            className="text-[11px] text-emerald-600 font-bold hover:underline cursor-pointer block mt-1"
                          >
                            调阅方案 &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. Files View (文件) */}
            {activeView === 'files' && (
              <motion.div
                key="files-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 max-w-[1100px] mx-auto w-full"
              >
                {/* Visual file drag drop grid simulation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* File upload block 1 */}
                  <div
                    onClick={() => handleTriggerSimulatedUpload('seq')}
                    className="border-2 border-dashed border-slate-300 hover:border-emerald-500 p-6 rounded-xl flex flex-col items-center justify-center bg-white text-center cursor-pointer transition-all hover:shadow-md h-40"
                  >
                    <UploadCloud className="w-8 h-8 text-slate-400 mb-2 group-hover:text-emerald-600" />
                    <p className="text-xs font-bold text-slate-700">导入高通量测序基因组</p>
                    <p className="text-[10px] text-slate-400 mt-1">支持 FASTA / GFF / CSV 格式数据集</p>
                  </div>

                  {/* File upload block 2 */}
                  <div
                    onClick={() => handleTriggerSimulatedUpload('img')}
                    className="border-2 border-dashed border-slate-300 hover:border-emerald-500 p-6 rounded-xl flex flex-col items-center justify-center bg-white text-center cursor-pointer transition-all hover:shadow-md h-40"
                  >
                    <Microscope className="w-8 h-8 text-slate-400 mb-2" />
                    <p className="text-xs font-bold text-slate-700">导入作物叶绿素或相片表型集</p>
                    <p className="text-[10px] text-slate-400 mt-1">支持多维遥感高分辨率 JPG / PNG / ZIP</p>
                  </div>

                  <div className="bg-emerald-600 text-white p-6 rounded-xl shadow-md h-40 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm">多倍体自动对齐算子</h4>
                      <p className="text-[10px] text-emerald-100 mt-1 leading-relaxed">
                        基于高分辨单体基因表达预测。导入重测序大分子集时，系统会默认进行突变标记分类并挂载计算核心。
                      </p>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-700 border border-emerald-500 px-2 py-1 rounded w-fit">
                      v2.4 Core Online
                    </span>
                  </div>

                </div>

                {/* Local files list */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center px-6">
                    <span className="text-xs font-bold text-slate-500">文件资产库</span>
                    <span className="text-xs text-slate-400 font-semibold">共 {filesList.length} 个本地测序样本</span>
                  </div>

                  <div className="divide-y divide-slate-150">
                    {filesList.map((file, index) => (
                      <div key={index} className="p-4 px-6 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4 text-xs font-sans">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                            {file.name.endsWith('.fa') ? <Database className="w-4 h-4 text-emerald-600" /> : <FileText className="w-4 h-4 text-sky-500" />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{file.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{file.type} • {file.size}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-[11px] text-slate-450 font-mono">{file.date}</span>
                          <button
                            onClick={() => {
                              // Auto start job matching this file
                              const linkTask2: BreedingTask = {
                                id: `TASK-UP-${Math.floor(Math.random() * 900 + 100)}`,
                                name: `全深度突变比对 - ${file.name}`,
                                progress: 5,
                                status: 'RUNNING',
                                expectedTime: '3h 10m',
                              };
                              setTasks(prev => [linkTask2, ...prev]);
                              setActiveView('dashboard');
                              alert(`已基于本地资产「${file.name}」自动拉起计算流水线！请在驾驶舱查看详情。`);
                            }}
                            className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline cursor-pointer"
                          >
                            计算对齐 &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. Settings View (设置) */}
            {activeView === 'settings' && (
              <motion.div
                key="settings-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 max-w-[850px] mx-auto w-full"
              >
                {/* Config credentials alert block */}
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex gap-3 text-amber-950 text-xs">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1 leading-relaxed">
                    <p className="font-bold">平台 API 安全密匙与权限管理</p>
                    <p>
                      如果当前聊天反应受阻或缺少回答深度，请将您的真实 <strong>GEMINI_API_KEY</strong> 密匙填写至 AI Studio 的 <strong>Settings &gt; Secrets</strong> 参数控制面板。
                    </p>
                    <p className="font-semibold text-amber-900">
                      *当前系统检测已正常。即便未配置真实 API 密钥，助手也将自适应切换为「高级单体作物离线重测序仿真对策」，确保所有展示与逻辑功能完好无损。
                    </p>
                  </div>
                </div>

                {/* Config properties card */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
                  <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-emerald-600" />
                      <span>作物分子编辑 AI 模型配制</span>
                    </h3>
                  </div>

                  <div className="space-y-4">
                    
                    {/* Model Select */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 block">学术分析引擎选用</label>
                      <select
                        value={currentModel}
                        onChange={(e) => setCurrentModel(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-700 font-semibold focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="gemini-3.5-flash">Gemini 3.5 Flash (推荐：标准表现及高频简报)</option>
                        <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (高阶复杂型多单倍体及QTL定位分析)</option>
                      </select>
                      <span className="text-[10px] text-slate-400 block font-medium">Flash 模型支持在 1-2 秒内获取多维抗性反馈，Pro 模型针对庞大微突变表现更准确。</span>
                    </div>

                    {/* Temperature Range slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-600">模型发散灵敏度 (Temperature)</span>
                        <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">{aiTemperature}</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1.2"
                        step="0.05"
                        value={aiTemperature}
                        onChange={(e) => setAiTemperature(parseFloat(e.target.value))}
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                        <span>绝对精确 (适用于测序比对)</span>
                        <span>高创意性 (杂交育种联想)</span>
                      </div>
                    </div>

                    {/* Scientific feedback switch */}
                    <div className="flex items-center justify-between py-2 border-t border-slate-100">
                      <div>
                        <p className="text-xs font-bold text-slate-750">自动关联基因标记数据库 (GFF/NCBI)</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">如果检测到突变标识（如 QHT-3b），AI 助手会自动展开遗传功能区聚类研究。</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={scientificAssistanceChecked}
                        onChange={(e) => setScientificAssistanceChecked(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                      />
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* MODAL 1: CREATE NEW TASK DIALOG (新建析模态弹窗) */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white border border-slate-200 rounded-2xl w-full max-w-[480px] shadow-2xl overflow-hidden font-sans"
          >
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Microscope className="w-5 h-5 text-emerald-600" />
                <span>快速挂载作物测序/分析任务</span>
              </h4>
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTaskSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 block">主功能任务名称 *</label>
                <input
                  type="text"
                  required
                  placeholder="如：耐盐突变体高密度重分布对齐"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-750 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 block">目标作物大类</label>
                  <select
                    value={newTaskCrop}
                    onChange={(e) => setNewTaskCrop(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-750 focus:ring-1 focus:ring-emerald-500 font-semibold"
                  >
                    <option value="玉米">玉米 (Maize)</option>
                    <option value="水稻">水稻 (Rice)</option>
                    <option value="小麦">小麦 (Wheat)</option>
                    <option value="大豆">大豆 (Soybean)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 block">预计算耗时 (分派核心)</label>
                  <input
                    type="text"
                    placeholder="如：2h 45m"
                    value={newTaskDuration}
                    onChange={(e) => setNewTaskDuration(e.target.value)}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-750 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed font-semibold">
                ⚠️ **算力拨备提示：** 创建后，系统后台将自动检索 NCBI / GFF3 遗传学定位，智能关联本季核心测序矩阵算力。
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-lg cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md shadow-emerald-900/10 cursor-pointer"
                >
                  开始测序分析
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL 2: HIGH-RESOLUTION SUMMARY REPORT INSPECTOR (最新作物成果总结报告弹窗) */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white border border-slate-200 rounded-2xl w-full max-w-[650px] shadow-2xl overflow-hidden font-sans"
          >
            <div className="p-5 border-b border-slate-100 bg-[#f6fbf0] flex justify-between items-center px-6">
              <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>2026年春季作物基因改良研究总结（学术解说）</span>
              </h4>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[460px] overflow-y-auto chat-scrollbar font-sans text-xs text-slate-700 leading-relaxed">
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
                <p className="font-bold text-slate-800 text-sm">🌾 主科研突破领域 - 表现型与单倍体对齐</p>
                <p>
                  本季繁育实验大底盘深度归档了 M3 代以及 M4 自交群体种子大约 **14,592 粒**。基于多重PCR深度对齐，成功在小麦
                  <strong>-DREB1A</strong> 启动突变座检测出高响应的转录增强因子。在本季酷潮和极端抗旱（22天无土壤供水）测试中，该突变克隆对比常规对照组 (CK)，其叶面水势值显著保全达约 **68.5%**。
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-850">1. 玉米主产量突变聚类 (V2) 建模分析汇总</p>
                <p>
                  基因聚类模型采用的是全新的单体突变遗传连锁，通过 66K 液体芯片在我国黄淮海夏播区开展了多点测试。我们校阅得出性状变异回归方程，主分 PC1 特异对齐与茎粗、胚乳灌浆重呈高达 **12%** 的极显相关联。
                </p>
                
                <p className="font-bold text-slate-855">2. 大豆根系及固氮功能表型影像回放</p>
                <p>
                  利用微透摄影高分辨捕捉，已顺利剔除大豆非特异侵染变异。固氮效率在分子辅助突变锁定下调拨完成。由于部分高负荷Node-04算力在全基因选择期间出现波动，本作业正积极挂载对齐。
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-slate-450 border border-slate-200 font-mono text-[10px]">
                研究归档识别编码: APB-G2026-REPORT-V3 • 农业智能育种系统学术委员会
              </div>
            </div>

            <div className="p-4 bg-slate-55 border-t border-slate-100 flex justify-between items-center px-6">
              <span className="text-[10px] text-slate-400 font-semibold">最后修订时间: {new Date().toLocaleDateString('zh-CN')}</span>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg cursor-pointer shadow"
              >
                关闭阅读
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
