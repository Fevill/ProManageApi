export interface Transaction {
    id: number;
    date: Date;
    amount: number;
    description: string;
    company_id: number;
    fiscal_year_id: number;
    created_at: Date;
    updated_at: Date;
}

export interface FinancialSummary {
    total_income: number;
    total_expenses: number;
    net_income: number;
}

export interface DashboardData {
    recentTransactions: Transaction[];
    financialSummary: FinancialSummary;
}
