/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BreedingTask, SystemAlert, ChatMessage, MetricCardData } from './types';

export const INITIAL_METRICS: MetricCardData[] = [
  {
    id: 'active_experiments',
    title: '活跃实验',
    value: '128',
    change: '+12%',
    isPositive: true,
    sparklinePath: 'M0,35 Q20,30 40,32 T80,20 T120,25 T160,10 T200,15',
    strokeColor: '#006b22',
  },
  {
    id: 'germplasm_resources',
    title: '种质资源总量',
    value: '4,592',
    change: '+45',
    isPositive: true,
    sparklinePath: 'M0,38 L40,35 L80,30 L120,20 L160,15 L200,5',
    strokeColor: '#006b22',
  },
  {
    id: 'breeding_success_rate',
    title: '育种成功率',
    value: '68.5%',
    change: '-2.1%',
    isPositive: false,
    sparklinePath: 'M0,10 Q50,5 100,20 T200,30',
    strokeColor: '#be4e72',
  },
  {
    id: 'analyzed_genomes',
    title: '已分析基因组',
    value: '2.4M',
    change: '+0.3M',
    isPositive: true,
    sparklinePath: 'M0,35 L20,32 L40,30 L60,28 L80,20 L100,22 L140,15 L180,10 L200,5',
    strokeColor: '#006b22',
  },
];

export const INITIAL_TASKS: BreedingTask[] = [
  {
    id: 'TASK-20240321-01',
    name: '玉米产量预测模型 V2',
    progress: 85,
    status: 'RUNNING',
    expectedTime: '2h 15m',
  },
  {
    id: 'TASK-20240321-04',
    name: '水稻抗逆性基因对比',
    progress: 100,
    status: 'COMPLETED',
    expectedTime: '--',
  },
  {
    id: 'TASK-20240320-12',
    name: '全基因组选择预测 (GS)',
    progress: 42,
    status: 'RUNNING',
    expectedTime: '5h 45m',
  },
  {
    id: 'TASK-20240320-15',
    name: '大豆表型自动识别分析',
    progress: 12,
    status: 'FAILED',
    expectedTime: '--',
  },
];

export const INITIAL_ALERTS: SystemAlert[] = [
  {
    id: 'alert-node-load',
    title: '计算节点负载过高',
    description: 'Node-04 当前 CPU 使用率 98%，可能影响 GS 任务预测进度。',
    level: 'warning',
    time: '2 分钟前',
  },
  {
    id: 'alert-soybean-failed',
    title: '数据集成异常',
    description: '大豆表型识别任务由于图片读取权限问题已中断。',
    level: 'error',
    time: '15 分钟前',
  },
];

export const DEFAULT_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    senderName: 'AI 助手',
    time: '09:12 AM',
    text: '您好。正在为您同步当前的育种数据分析进度。目前系统正在处理 **A07 品系** 的全基因组重测序数据，初步筛选结果显示，该品种在耐热性基因座 QHT-3b 上具有显著的遗传优势。',
  },
  {
    id: 'msg-2',
    sender: 'user',
    senderName: '张博士',
    time: '09:15 AM',
    text: '请问 A07 的抗虫性评估报告生成了吗？另外，帮我确认一下 A09 品种的基因筛选状态。',
  },
  {
    id: 'msg-3',
    sender: 'ai',
    senderName: 'AI 助手',
    time: '09:16 AM',
    text: '好的，正在为您查询。以下是相关任务的最新状态：',
    statusItems: [
      {
        id: 'status-item-1',
        title: 'A07 抗虫性评估报告',
        status: 'completed',
        progress: 100,
      },
      {
        id: 'status-item-2',
        title: 'A09 基因筛选任务',
        status: 'processing',
        progress: 85,
        progressMsg: '任务进度更新：品种 A09 基因筛选完成 85%',
      },
      {
        id: 'status-item-3',
        title: '测序原始数据上传 (Batch 04)',
        status: 'failed',
        progress: 0,
      },
    ],
  },
];

export const SAMPLE_FILES = [
  { name: 'maize_seq_batch02_2026.fa', type: 'Fasta Sequence', size: '142 MB', date: '2026-06-08' },
  { name: 'rice_phenotype_imaging_h9.zip', type: 'Phenotypic Images Archive', size: '894 MB', date: '2026-06-09' },
  { name: 'wheat_drought_dreb1a_markers.csv', type: 'Marker Indicators Matrix', size: '1.2 MB', date: '2026-06-10' },
  { name: 'soybean_germplasm_v4_mapping.gff', type: 'Genomic Annotation Mapping', size: '24 MB', date: '2026-06-11' },
];

export const HISTORICAL_LOGS = [
  { title: '2026年春季春播作物表现及抗性大底盘分析', date: '2026-05-12', researcher: '张博士', type: '表现分析' },
  { title: '水稻杂交不育基因 locus-Sa 敲除复盘评测报告', date: '2026-05-24', researcher: '管理员', type: '分子编辑报告' },
  { title: '大麦多倍体分化及其在抗碱胁迫环境中的优势聚类', date: '2026-06-01', researcher: '李研究员', type: '演化分析' },
  { title: '小麦高密度66K芯片特异优势基因座基因杂交预测记录', date: '2026-06-05', researcher: '张博士', type: '杂交方案' },
];
