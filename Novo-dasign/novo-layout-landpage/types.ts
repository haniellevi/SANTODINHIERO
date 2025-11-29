import React from 'react';

export interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export type TransactionType = 'income' | 'expense' | 'tithe' | 'investment' | 'misc';

export interface MockTransaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
}

export interface DashboardProps {
  onBack: () => void;
}