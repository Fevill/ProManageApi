export interface Transaction {
    id: number;
    date: Date;
    amount: number;
    debit_account_id: number;
    credit_account_id: number;
    description: string;
    reference?: string;
    company_id: number;
    fiscal_year_id: number;
    is_forecast: boolean;
    created_at: Date;
    updated_at: Date;
}
