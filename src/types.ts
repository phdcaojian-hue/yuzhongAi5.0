/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActiveView = 'dashboard' | 'chat' | 'history' | 'files' | 'settings';

export interface BreedingTask {
  id: string;
  name: string;
  progress: number;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED';
  expectedTime: string;
}

export interface SystemAlert {
  id: string;
  title: string;
  description: string;
  level: 'warning' | 'error' | 'info';
  time: string;
}

export interface StatusItem {
  id: string;
  title: string;
  status: 'completed' | 'processing' | 'failed';
  progress?: number;
  progressMsg?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  senderName: string;
  time: string;
  text: string;
  statusItems?: StatusItem[];
}

export interface MetricCardData {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  sparklinePath: string;
  strokeColor: string;
}
