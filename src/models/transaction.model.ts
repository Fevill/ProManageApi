export interface Transaction {
    id: number;
    date: Date;
    amount: number;
    description: string;
    is_forecast: boolean;
    company_id: number;
    fiscal_year_id: number;
    created_at: Date;
    updated_at: Date;
}
