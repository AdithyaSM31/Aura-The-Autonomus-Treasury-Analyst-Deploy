#!/usr/bin/env python3
"""
Intelligent Financial Analyzer
A flexible, AI-powered financial analysis system that calculates current values
and predicts future financial scenarios for any timeframe.
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
import json
from config import GEMINI_API_KEY, GEMINI_API_URL
import requests

class IntelligentFinancialAnalyzer:
    """
    An intelligent financial analyzer that:
    1. Calculates current financial metrics from data
    2. Identifies patterns and trends
    3. Predicts future scenarios for any timeframe
    4. Uses AI for intelligent analysis and recommendations
    """
    
    def __init__(self):
        self.api_key = GEMINI_API_KEY
        self.api_url = GEMINI_API_URL
        
    def analyze_financial_data(self, transactions_df: pd.DataFrame, 
                             campaigns_df: pd.DataFrame, 
                             targets_df: pd.DataFrame,
                             file_info: dict = None) -> Dict[str, Any]:
        """
        Main analysis function that provides comprehensive financial insights
        """
        try:
            # Step 1: Calculate current financial metrics
            current_metrics = self._calculate_current_metrics(transactions_df, campaigns_df, targets_df)
            
            # Step 2: Identify patterns and trends
            patterns = self._identify_patterns(transactions_df, campaigns_df, targets_df)
            
            # Step 3: Generate AI-powered insights
            ai_insights = self._generate_ai_insights(transactions_df, campaigns_df, targets_df, current_metrics, patterns)
            
            # Step 4: Create prediction scenarios
            predictions = self._create_prediction_scenarios(current_metrics, patterns, ai_insights)
            
            return {
                "current_metrics": current_metrics,
                "patterns": patterns,
                "ai_insights": ai_insights,
                "predictions": predictions,
                "file_info": file_info or {},
                "analysis_timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"Error in financial analysis: {e}")
            return self._create_fallback_analysis(transactions_df, campaigns_df, targets_df)
    
    def _calculate_current_metrics(self, transactions_df: pd.DataFrame, 
                                 campaigns_df: pd.DataFrame, 
                                 targets_df: pd.DataFrame) -> Dict[str, Any]:
        """
        Calculate current financial metrics from the data
        """
        metrics = {}
        
        # Revenue Analysis
        if 'Amount' in transactions_df.columns:
            positive_amounts = transactions_df[transactions_df['Amount'] > 0]['Amount']
            negative_amounts = transactions_df[transactions_df['Amount'] < 0]['Amount']
            
            # Handle NaN values
            total_revenue = float(positive_amounts.sum()) if not positive_amounts.empty else 0.0
            total_expenses = float(abs(negative_amounts.sum())) if not negative_amounts.empty else 0.0
            net_income = total_revenue - total_expenses
            avg_transaction_value = float(positive_amounts.mean()) if not positive_amounts.empty and not positive_amounts.mean() != positive_amounts.mean() else 0.0
            transaction_count = len(transactions_df)
            revenue_growth_rate = self._calculate_growth_rate(positive_amounts)
            
            metrics['revenue'] = {
                'total_revenue': total_revenue,
                'total_expenses': total_expenses,
                'net_income': net_income,
                'avg_transaction_value': avg_transaction_value,
                'transaction_count': transaction_count,
                'revenue_growth_rate': revenue_growth_rate
            }
        
        # Cash Flow Analysis
        if 'Date' in transactions_df.columns and 'Amount' in transactions_df.columns:
            metrics['cash_flow'] = self._analyze_cash_flow(transactions_df)
        
        # Marketing Analysis
        if 'Spend' in campaigns_df.columns and 'Acquisitions' in campaigns_df.columns:
            total_spend = float(campaigns_df['Spend'].sum()) if not campaigns_df['Spend'].empty else 0.0
            total_acquisitions = float(campaigns_df['Acquisitions'].sum()) if not campaigns_df['Acquisitions'].empty else 0.0
            
            # Calculate CAC safely
            if total_acquisitions > 0:
                cost_per_acquisition = total_spend / total_acquisitions
            else:
                cost_per_acquisition = 0.0
            
            acquisition_growth_rate = self._calculate_growth_rate(campaigns_df['Acquisitions'])
            spend_efficiency = self._calculate_spend_efficiency(campaigns_df, transactions_df)
            
            metrics['marketing'] = {
                'total_spend': total_spend,
                'total_acquisitions': total_acquisitions,
                'cost_per_acquisition': cost_per_acquisition,
                'acquisition_growth_rate': acquisition_growth_rate,
                'spend_efficiency': spend_efficiency
            }
        
        # Performance Metrics
        metrics['performance'] = self._calculate_performance_metrics(transactions_df, campaigns_df, targets_df)
        
        return metrics
    
    def _analyze_cash_flow(self, transactions_df: pd.DataFrame) -> Dict[str, Any]:
        """
        Analyze cash flow patterns
        """
        try:
            # Convert date column to datetime
            transactions_df['Date'] = pd.to_datetime(transactions_df['Date'])
            
            # Group by month for trend analysis
            monthly_cashflow = transactions_df.groupby(transactions_df['Date'].dt.to_period('M'))['Amount'].sum()
            
            # Calculate cash flow metrics with NaN handling
            monthly_mean = monthly_cashflow.mean()
            monthly_std = monthly_cashflow.std()
            negative_months = monthly_cashflow[monthly_cashflow < 0]
            negative_mean = negative_months.mean() if not negative_months.empty else 0
            
            cash_flow = {
                'monthly_average': float(monthly_mean) if not pd.isna(monthly_mean) else 0.0,
                'monthly_volatility': float(monthly_std) if not pd.isna(monthly_std) else 0.0,
                'positive_months': int((monthly_cashflow > 0).sum()),
                'negative_months': int((monthly_cashflow < 0).sum()),
                'cash_flow_trend': self._calculate_trend(monthly_cashflow.values),
                'burn_rate': float(abs(negative_mean)) if not pd.isna(negative_mean) else 0.0
            }
            
            return cash_flow
            
        except Exception as e:
            print(f"Error in cash flow analysis: {e}")
            return {'monthly_average': 0.0, 'monthly_volatility': 0.0, 'cash_flow_trend': 0.0, 'burn_rate': 0.0}
    
    def _identify_patterns(self, transactions_df: pd.DataFrame, 
                          campaigns_df: pd.DataFrame, 
                          targets_df: pd.DataFrame) -> Dict[str, Any]:
        """
        Identify patterns and trends in the data
        """
        patterns = {}
        
        # Transaction patterns
        if 'Date' in transactions_df.columns and 'Amount' in transactions_df.columns:
            patterns['transaction_patterns'] = self._analyze_transaction_patterns(transactions_df)
        
        # Campaign patterns
        if 'Timestamp' in campaigns_df.columns and 'Spend' in campaigns_df.columns:
            patterns['campaign_patterns'] = self._analyze_campaign_patterns(campaigns_df)
        
        # Seasonal patterns
        patterns['seasonality'] = self._detect_seasonality(transactions_df, campaigns_df)
        
        return patterns
    
    def _analyze_transaction_patterns(self, transactions_df: pd.DataFrame) -> Dict[str, Any]:
        """
        Analyze transaction patterns
        """
        try:
            transactions_df['Date'] = pd.to_datetime(transactions_df['Date'])
            
            # Daily patterns
            daily_amounts = transactions_df.groupby(transactions_df['Date'].dt.dayofweek)['Amount'].mean()
            
            # Monthly patterns
            monthly_amounts = transactions_df.groupby(transactions_df['Date'].dt.month)['Amount'].mean()
            
            # Calculate transaction frequency safely
            date_range = (transactions_df['Date'].max() - transactions_df['Date'].min()).days + 1
            transaction_frequency = len(transactions_df) / date_range if date_range > 0 else 0
            
            # Calculate amount volatility safely
            amount_std = transactions_df['Amount'].std()
            amount_volatility = float(amount_std) if not pd.isna(amount_std) else 0.0
            
            return {
                'best_day_of_week': int(daily_amounts.idxmax()) if not daily_amounts.empty else 0,
                'worst_day_of_week': int(daily_amounts.idxmin()) if not daily_amounts.empty else 0,
                'best_month': int(monthly_amounts.idxmax()) if not monthly_amounts.empty else 0,
                'worst_month': int(monthly_amounts.idxmin()) if not monthly_amounts.empty else 0,
                'transaction_frequency': float(transaction_frequency) if not pd.isna(transaction_frequency) else 0.0,
                'amount_volatility': amount_volatility
            }
        except Exception as e:
            print(f"Error analyzing transaction patterns: {e}")
            return {}
    
    def _analyze_campaign_patterns(self, campaigns_df: pd.DataFrame) -> Dict[str, Any]:
        """
        Analyze campaign performance patterns
        """
        try:
            campaigns_df['Timestamp'] = pd.to_datetime(campaigns_df['Timestamp'])
            
            # Channel performance
            if 'Channel' in campaigns_df.columns:
                channel_performance = campaigns_df.groupby('Channel').agg({
                    'Spend': 'sum',
                    'Acquisitions': 'sum'
                })
                # Calculate CPA safely
                channel_performance['CPA'] = channel_performance['Spend'] / channel_performance['Acquisitions'].replace(0, 1)
                
                best_channel = channel_performance['CPA'].idxmin() if not channel_performance.empty else "Unknown"
                worst_channel = channel_performance['CPA'].idxmax() if not channel_performance.empty else "Unknown"
            else:
                best_channel = worst_channel = "Unknown"
            
            # Calculate campaign frequency safely
            date_range = (campaigns_df['Timestamp'].max() - campaigns_df['Timestamp'].min()).days + 1
            campaign_frequency = len(campaigns_df) / date_range if date_range > 0 else 0
            
            return {
                'best_channel': best_channel,
                'worst_channel': worst_channel,
                'campaign_frequency': float(campaign_frequency) if not pd.isna(campaign_frequency) else 0.0,
                'spend_trend': self._calculate_trend(campaigns_df['Spend'].values),
                'acquisition_trend': self._calculate_trend(campaigns_df['Acquisitions'].values)
            }
        except Exception as e:
            print(f"Error analyzing campaign patterns: {e}")
            return {}
    
    def _detect_seasonality(self, transactions_df: pd.DataFrame, campaigns_df: pd.DataFrame) -> Dict[str, Any]:
        """
        Detect seasonal patterns in the data
        """
        seasonality = {}
        
        try:
            if 'Date' in transactions_df.columns:
                transactions_df['Date'] = pd.to_datetime(transactions_df['Date'])
                monthly_revenue = transactions_df.groupby(transactions_df['Date'].dt.month)['Amount'].sum()
                
                if not monthly_revenue.empty:
                    # Calculate seasonality index safely
                    avg_monthly = monthly_revenue.mean()
                    if not pd.isna(avg_monthly) and avg_monthly != 0:
                        seasonality_index = monthly_revenue / avg_monthly
                        
                        seasonality['peak_month'] = int(seasonality_index.idxmax()) if not seasonality_index.empty else 0
                        seasonality['low_month'] = int(seasonality_index.idxmin()) if not seasonality_index.empty else 0
                        
                        seasonality_std = seasonality_index.std()
                        seasonality['seasonality_strength'] = float(seasonality_std) if not pd.isna(seasonality_std) else 0.0
                    else:
                        seasonality['peak_month'] = 0
                        seasonality['low_month'] = 0
                        seasonality['seasonality_strength'] = 0.0
                else:
                    seasonality['peak_month'] = 0
                    seasonality['low_month'] = 0
                    seasonality['seasonality_strength'] = 0.0
                
        except Exception as e:
            print(f"Error detecting seasonality: {e}")
            seasonality['peak_month'] = 0
            seasonality['low_month'] = 0
            seasonality['seasonality_strength'] = 0.0
        
        return seasonality
    
    def _create_prediction_scenarios(self, current_metrics: Dict, 
                                   patterns: Dict, 
                                   ai_insights: Dict) -> Dict[str, Any]:
        """
        Create prediction scenarios for different timeframes
        """
        predictions = {}
        
        # Define timeframes
        timeframes = {
            '30_days': 30,
            '45_days': 45,
            '3_months': 90,
            '6_months': 180,
            '1_year': 365
        }
        
        for timeframe_name, days in timeframes.items():
            predictions[timeframe_name] = self._predict_for_timeframe(
                current_metrics, patterns, ai_insights, days
            )
        
        return predictions
    
    def _predict_for_timeframe(self, current_metrics: Dict, 
                             patterns: Dict, 
                             ai_insights: Dict, 
                             days: int) -> Dict[str, Any]:
        """
        Predict financial metrics for a specific timeframe
        """
        prediction = {}
        
        # Revenue prediction
        if 'revenue' in current_metrics:
            revenue_growth = current_metrics['revenue'].get('revenue_growth_rate', 0)
            current_revenue = current_metrics['revenue']['total_revenue']
            
            # Project revenue based on growth rate
            projected_revenue = current_revenue * (1 + revenue_growth) ** (days / 30)
            prediction['projected_revenue'] = float(projected_revenue)
            prediction['revenue_growth'] = float((projected_revenue - current_revenue) / current_revenue * 100)
        
        # Cash flow prediction
        if 'cash_flow' in current_metrics:
            monthly_avg = current_metrics['cash_flow'].get('monthly_average', 0)
            trend = current_metrics['cash_flow'].get('cash_flow_trend', 0)
            
            # Project cash flow considering trend
            projected_cashflow = monthly_avg * (days / 30) * (1 + trend)
            prediction['projected_cash_flow'] = float(projected_cashflow)
            prediction['cash_flow_trend'] = float(trend * 100)
        
        # Marketing prediction
        if 'marketing' in current_metrics:
            current_cpa = current_metrics['marketing']['cost_per_acquisition']
            acquisition_growth = current_metrics['marketing'].get('acquisition_growth_rate', 0)
            
            # Project acquisitions and spend
            projected_acquisitions = current_metrics['marketing']['total_acquisitions'] * (1 + acquisition_growth) ** (days / 30)
            projected_spend = projected_acquisitions * current_cpa
            
            prediction['projected_acquisitions'] = float(projected_acquisitions)
            prediction['projected_marketing_spend'] = float(projected_spend)
            prediction['projected_cpa'] = float(current_cpa)
        
        # Risk assessment
        prediction['risk_level'] = self._assess_risk(current_metrics, patterns, days)
        
        return prediction
    
    def _assess_risk(self, current_metrics: Dict, patterns: Dict, days: int) -> str:
        """
        Assess financial risk for the prediction timeframe
        """
        risk_factors = []
        
        # Cash flow risk
        if 'cash_flow' in current_metrics:
            if current_metrics['cash_flow']['monthly_average'] < 0:
                risk_factors.append('negative_cash_flow')
            if current_metrics['cash_flow']['monthly_volatility'] > current_metrics['cash_flow']['monthly_average']:
                risk_factors.append('high_volatility')
        
        # Revenue risk
        if 'revenue' in current_metrics:
            if current_metrics['revenue']['revenue_growth_rate'] < -0.1:
                risk_factors.append('declining_revenue')
        
        # Marketing risk
        if 'marketing' in current_metrics:
            if current_metrics['marketing']['cost_per_acquisition'] > 100:
                risk_factors.append('high_cpa')
        
        # Determine overall risk level
        if len(risk_factors) >= 3:
            return 'high'
        elif len(risk_factors) >= 1:
            return 'medium'
        else:
            return 'low'
    
    def _generate_ai_insights(self, transactions_df: pd.DataFrame, 
                            campaigns_df: pd.DataFrame, 
                            targets_df: pd.DataFrame,
                            current_metrics: Dict, 
                            patterns: Dict) -> Dict[str, Any]:
        """
        Generate AI-powered insights using Gemini
        """
        try:
            # Prepare data summary for AI analysis
            data_summary = {
                'current_metrics': current_metrics,
                'patterns': patterns,
                'data_summary': {
                    'transaction_count': len(transactions_df),
                    'campaign_count': len(campaigns_df),
                    'target_count': len(targets_df),
                    'date_range': self._get_date_range(transactions_df, campaigns_df)
                }
            }
            
            prompt = f"""
            You are a senior financial analyst. Analyze this financial data and provide BRIEF strategic insights.
            
            DATA SUMMARY:
            {json.dumps(data_summary, indent=2)}
            
            Provide CONCISE insights (2-3 lines maximum per section):
            1. Key financial strengths and weaknesses
            2. Growth opportunities  
            3. Risk factors to monitor
            4. Strategic recommendations for the next 6 months
            5. Cash flow optimization opportunities
            
            Return a JSON response with:
            {{
                "strengths": ["strength1", "strength2"],
                "weaknesses": ["weakness1", "weakness2"], 
                "opportunities": ["opportunity1", "opportunity2"],
                "risks": ["risk1", "risk2"],
                "recommendations": ["recommendation1", "recommendation2"],
                "executive_summary": "Brief 2-3 line executive summary"
            }}
            
            IMPORTANT: Keep each insight to maximum 2-3 lines. Be direct and actionable.
            """
            
            response = self._call_gemini_api(prompt)
            
            try:
                insights = json.loads(response)
                return insights
            except:
                return self._create_fallback_insights(current_metrics, patterns)
                
        except Exception as e:
            print(f"Error generating AI insights: {e}")
            return self._create_fallback_insights(current_metrics, patterns)
    
    def _call_gemini_api(self, prompt: str) -> str:
        """
        Call Groq API for AI analysis with enhanced error handling
        """
        try:
            if not self.api_key or self.api_key == "YOUR_GEMINI_API_KEY_HERE":
                print("⚠️ No Groq API key configured in intelligent analyzer")
                return "AI analysis unavailable - no API key"
            
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {self.api_key}'
            }
            
            data = {
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": "You are an intelligent financial analyst providing comprehensive financial analysis."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.7,
                "max_tokens": 800
            }
            
            print("🤖 Calling Groq API for intelligent financial analysis...")
            response = requests.post(
                self.api_url,
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                if 'choices' in result and len(result['choices']) > 0:
                    print("✅ Groq API analysis completed")
                    return result['choices'][0]['message']['content']
            
            print(f"⚠️ Groq API error {response.status_code} in intelligent analyzer")
            return "AI analysis unavailable - API error"
            
        except Exception as e:
            print(f"⚠️ Groq API exception in intelligent analyzer: {e}")
            return "AI analysis unavailable - connection error"
    
    # Helper methods
    def _calculate_growth_rate(self, series: pd.Series) -> float:
        """Calculate growth rate from a time series"""
        try:
            if len(series) < 2:
                return 0.0
            
            # Handle NaN values
            series_clean = series.dropna()
            if len(series_clean) < 2:
                return 0.0
            
            # Simple linear growth rate
            first_half = series_clean.iloc[:len(series_clean)//2].mean()
            second_half = series_clean.iloc[len(series_clean)//2:].mean()
            
            if first_half == 0 or pd.isna(first_half) or pd.isna(second_half):
                return 0.0
            
            growth_rate = (second_half - first_half) / first_half
            return float(growth_rate) if not pd.isna(growth_rate) and growth_rate != float('inf') else 0.0
        except:
            return 0.0
    
    def _calculate_trend(self, values: np.ndarray) -> float:
        """Calculate trend from a series of values"""
        try:
            if len(values) < 2:
                return 0.0
            
            # Handle NaN values
            values_clean = values[~np.isnan(values)]
            if len(values_clean) < 2:
                return 0.0
            
            # Simple linear trend
            x = np.arange(len(values_clean))
            slope = np.polyfit(x, values_clean, 1)[0]
            mean_value = np.mean(values_clean)
            return float(slope / mean_value) if mean_value != 0 and not np.isnan(slope) and slope != float('inf') else 0.0
        except:
            return 0.0
    
    def _calculate_spend_efficiency(self, campaigns_df: pd.DataFrame, transactions_df: pd.DataFrame) -> float:
        """Calculate marketing spend efficiency"""
        try:
            total_spend = float(campaigns_df['Spend'].sum()) if not campaigns_df['Spend'].empty else 0.0
            positive_amounts = transactions_df[transactions_df['Amount'] > 0]['Amount']
            total_revenue = float(positive_amounts.sum()) if not positive_amounts.empty else 0.0
            
            if total_spend == 0:
                return 0.0
            
            efficiency = total_revenue / total_spend
            return float(efficiency) if not pd.isna(efficiency) and efficiency != float('inf') else 0.0
        except:
            return 0.0
    
    def _calculate_performance_metrics(self, transactions_df: pd.DataFrame, 
                                    campaigns_df: pd.DataFrame, 
                                    targets_df: pd.DataFrame) -> Dict[str, Any]:
        """Calculate overall performance metrics"""
        metrics = {}
        
        # Transaction success rate
        if 'Amount' in transactions_df.columns:
            successful_transactions = len(transactions_df[transactions_df['Amount'] != 0])
            total_transactions = len(transactions_df)
            success_rate = float(successful_transactions / total_transactions) if total_transactions > 0 else 0.0
            metrics['transaction_success_rate'] = success_rate if not pd.isna(success_rate) else 0.0
        
        # Customer acquisition efficiency
        if 'Spend' in campaigns_df.columns and 'Acquisitions' in campaigns_df.columns:
            total_spend = float(campaigns_df['Spend'].sum()) if not campaigns_df['Spend'].empty else 0.0
            total_acquisitions = float(campaigns_df['Acquisitions'].sum()) if not campaigns_df['Acquisitions'].empty else 0.0
            efficiency = float(total_acquisitions / total_spend) if total_spend > 0 else 0.0
            metrics['acquisition_efficiency'] = efficiency if not pd.isna(efficiency) else 0.0
        
        return metrics
    
    def _get_date_range(self, transactions_df: pd.DataFrame, campaigns_df: pd.DataFrame) -> str:
        """Get date range of the data"""
        try:
            dates = []
            if 'Date' in transactions_df.columns:
                dates.extend(transactions_df['Date'].tolist())
            if 'Timestamp' in campaigns_df.columns:
                dates.extend(campaigns_df['Timestamp'].tolist())
            
            if dates:
                min_date = min(dates)
                max_date = max(dates)
                return f"{min_date} to {max_date}"
            return "Unknown"
        except:
            return "Unknown"
    
    def _create_fallback_insights(self, current_metrics: Dict, patterns: Dict) -> Dict[str, Any]:
        """Create fallback insights when AI is unavailable"""
        return {
            "strengths": [
                "Revenue data available for analysis",
                "Transaction patterns identified"
            ],
            "weaknesses": [
                "Limited historical trend data",
                "Need more comprehensive metrics"
            ],
            "opportunities": [
                "Growth potential in current metrics",
                "Optimization opportunities identified"
            ],
            "risks": [
                "Monitor cash flow volatility",
                "Track expense growth patterns"
            ],
            "recommendations": [
                "Continue data collection for better insights",
                "Implement regular financial monitoring"
            ],
            "executive_summary": "Financial analysis completed with available data. Key metrics show potential for growth optimization."
        }
    
    def _create_fallback_analysis(self, transactions_df: pd.DataFrame, 
                                campaigns_df: pd.DataFrame, 
                                targets_df: pd.DataFrame) -> Dict[str, Any]:
        """Create fallback analysis when main analysis fails"""
        return {
            "current_analysis": {"error": "Analysis failed"},
            "patterns": {},
            "ai_insights": {"executive_summary": "Analysis unavailable"},
            "predictions": {},
            "file_info": {},
            "analysis_timestamp": datetime.now().isoformat()
        }

# Main function for integration
def analyze_financial_data_intelligent(transactions_df: pd.DataFrame, 
                                     campaigns_df: pd.DataFrame, 
                                     targets_df: pd.DataFrame,
                                     file_info: dict = None) -> Dict[str, Any]:
    """
    Main function to analyze financial data intelligently
    """
    analyzer = IntelligentFinancialAnalyzer()
    return analyzer.analyze_financial_data(transactions_df, campaigns_df, targets_df, file_info)
