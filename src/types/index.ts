export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export enum RiskLevel {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high'
}

export enum InvestmentType {
  STOCKS = 'stocks',
  BONDS = 'bonds',
  MUTUAL_FUNDS = 'mutual_funds',
  FIXED_DEPOSITS = 'fixed_deposits',
  REAL_ESTATE = 'real_estate'
}

export interface User {
  id: string;
  first_name: string;
  last_name?: string;
  email: string;
  role: UserRole;
  risk_appetite: RiskLevel;
  balance: number;
  created_at?: string;
  updated_at?: string;
}

export interface InvestmentProduct {
  id: string;
  name: string;
  investment_type: InvestmentType;
  tenure_months: number;
  annual_yield: number;
  risk_level: RiskLevel;
  min_investment: number;
  max_investment?: number;
  description?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserInvestment {
  id: string;
  user_id: string;
  product_id: string;
  amount_invested: number;
  purchase_date: string;
  expected_return: number;
  current_value: number;
  product: InvestmentProduct;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string, riskLevel: RiskLevel) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

export interface PortfolioSummary {
  totalInvested: number;
  currentValue: number;
  totalReturns: number;
  returnsPercentage: number;
  activeInvestments: number;
}