#!/usr/bin/env python3
"""
AI-Powered Interactive Excel Processor
Uses Gemini AI to ask intelligent questions and process Excel files
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import requests
from config import GEMINI_API_KEY, GEMINI_API_URL
import tempfile
import os

class AIInteractiveExcelProcessor:
    def __init__(self):
        self.api_key = GEMINI_API_KEY
        self.api_url = GEMINI_API_URL
        self.user_requirements = {}
        self.original_data = {}
        self.conversation_history = []
        
    def analyze_excel_with_ai(self, filepath: str) -> dict:
        """
        Use AI to analyze Excel and start intelligent conversation
        """
        try:
            # Load the Excel file
            excel_file = pd.ExcelFile(filepath)
            sheets_data = {}
            
            for sheet_name in excel_file.sheet_names:
                df = pd.read_excel(filepath, sheet_name=sheet_name)
                sheets_data[sheet_name] = {
                    'data': df,
                    'columns': list(df.columns),
                    'rows': len(df),
                    'sample_data': df.head(3).to_dict('records')
                }
            
            self.original_data = sheets_data
            
            # Use AI to analyze and generate first question
            first_question = self._generate_ai_question(sheets_data, "initial_analysis")
            
            return {
                'status': 'success',
                'file_info': {
                    'filename': os.path.basename(filepath),
                    'sheets': list(sheets_data.keys()),
                    'total_rows': sum(sheet['rows'] for sheet in sheets_data.values())
                },
                'ai_question': first_question,
                'data_summary': self._create_data_summary(sheets_data),
                'conversation_step': 1
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Error analyzing Excel: {str(e)}'
            }
    
    def _generate_ai_question(self, sheets_data: dict, context: str) -> str:
        """
        Use Gemini AI to generate intelligent questions
        """
        try:
            # Prepare data summary for AI
            data_summary = self._create_data_summary(sheets_data)
            
            prompt = f"""
            You are an AI Excel processing assistant. Analyze this Excel file data and ask ONE intelligent question to understand what the user wants to do with their data.

            EXCEL FILE DATA:
            {json.dumps(data_summary, indent=2)}

            CONTEXT: {context}

            CONVERSATION HISTORY:
            {json.dumps(self.conversation_history, indent=2)}

            Based on the data structure and content, ask ONE specific, intelligent question that will help you understand exactly what the user wants to do. Be specific about:
            1. Which columns/sheets they want to modify
            2. What type of calculations or transformations they need
            3. What the end result should look like
            4. Any specific business requirements

            Examples of good questions:
            - "I see you have sales data with columns for Date, Product, Quantity, and Price. Do you want me to add a 'Total Revenue' column (Quantity × Price) and create a summary by product?"
            - "Your data has customer information and purchase history. Would you like me to calculate customer lifetime value, segment customers by purchase frequency, or create a different analysis?"
            - "I notice you have financial data with income and expenses. Do you want me to calculate profit margins, create monthly summaries, or add budget vs actual comparisons?"

            Ask ONE specific question that shows you understand their data and offers concrete options.
            - "I notice you have multiple sheets. Would you prefer a consolidated view or separate analysis for each sheet?"

            Return ONLY the question, nothing else.
            """
            
            response = self._call_gemini_api(prompt)
            
            # Add to conversation history
            self.conversation_history.append({
                'type': 'ai_question',
                'content': response,
                'timestamp': datetime.now().isoformat()
            })
            
            return response
            
        except Exception as e:
            print(f"Error generating AI question: {e}")
            return "I've analyzed your Excel file. What would you like me to help you with?"
    
    def process_ai_response(self, user_response: str, filepath: str) -> dict:
        """
        Process user response and generate next question or process requirements
        """
        try:
            # Add user response to conversation history
            self.conversation_history.append({
                'type': 'user_response',
                'content': user_response,
                'timestamp': datetime.now().isoformat()
            })
            
            # Use AI to understand user intent and decide next action
            intent_analysis = self._analyze_user_intent(user_response)
            
            if intent_analysis['action'] == 'ask_follow_up':
                # Generate follow-up question
                next_question = self._generate_ai_question(self.original_data, f"follow_up: {user_response}")
                return {
                    'status': 'continue_conversation',
                    'ai_question': next_question,
                    'conversation_step': len(self.conversation_history) + 1
                }
            
            elif intent_analysis['action'] == 'process_requirements':
                # Process the Excel based on understood requirements
                requirements = intent_analysis['requirements']
                result = self._process_excel_with_requirements(filepath, requirements)
                return result
            
            else:
                # Default: ask for clarification
                clarification_question = self._generate_ai_question(self.original_data, f"clarification_needed: {user_response}")
                return {
                    'status': 'continue_conversation',
                    'ai_question': clarification_question,
                    'conversation_step': len(self.conversation_history) + 1
                }
                
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Error processing response: {str(e)}'
            }
    
    def _analyze_user_intent(self, user_response: str) -> dict:
        """
        Use AI to analyze user intent and extract requirements
        """
        try:
            prompt = f"""
            Analyze this user response and determine what they want to do with their Excel data.

            USER RESPONSE: "{user_response}"

            CONVERSATION HISTORY:
            {json.dumps(self.conversation_history, indent=2)}

            EXCEL DATA SUMMARY:
            {json.dumps(self._create_data_summary(self.original_data), indent=2)}

            Determine:
            1. ACTION: "ask_follow_up" (need more info) or "process_requirements" (ready to process)
            2. REQUIREMENTS: If action is "process_requirements", extract specific requirements

            Return JSON format:
            {{
                "action": "ask_follow_up" or "process_requirements",
                "requirements": {{
                    "output_format": "description",
                    "modifications": ["list of modifications"],
                    "calculations": ["list of calculations"],
                    "filters": ["list of filters"],
                    "formatting": "description"
                }},
                "confidence": 0.8
            }}

            If action is "ask_follow_up", requirements can be empty.
            """
            
            response = self._call_gemini_api(prompt)
            
            # Try to parse JSON response
            try:
                analysis = json.loads(response)
                return analysis
            except json.JSONDecodeError:
                # Fallback: ask for more information
                return {
                    'action': 'ask_follow_up',
                    'requirements': {},
                    'confidence': 0.5
                }
                
        except Exception as e:
            print(f"Error analyzing intent: {e}")
            return {
                'action': 'ask_follow_up',
                'requirements': {},
                'confidence': 0.3
            }
    
    def _process_excel_with_requirements(self, filepath: str, requirements: dict) -> dict:
        """
        Process Excel file based on AI-extracted requirements
        """
        try:
            # Process each sheet based on requirements
            modified_sheets = {}
            
            for sheet_name, sheet_info in self.original_data.items():
                modified_df = self._apply_ai_modifications(sheet_name, sheet_info['data'], requirements)
                modified_sheets[sheet_name] = modified_df
            
            # Generate output file
            output_filepath = self._create_output_file(modified_sheets, requirements)
            
            return {
                'status': 'success',
                'output_file': output_filepath,
                'modifications_applied': self._get_modifications_summary(requirements),
                'file_info': {
                    'original_rows': sum(sheet['rows'] for sheet in self.original_data.values()),
                    'modified_rows': sum(len(df) for df in modified_sheets.values()),
                    'sheets_processed': len(modified_sheets)
                },
                'conversation_summary': self._create_conversation_summary()
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Error processing Excel: {str(e)}'
            }
    
    def _apply_ai_modifications(self, sheet_name: str, df: pd.DataFrame, requirements: dict) -> pd.DataFrame:
        """
        Apply modifications based on AI-understood requirements
        """
        modified_df = df.copy()
        
        modifications = requirements.get('modifications', [])
        calculations = requirements.get('calculations', [])
        filters = requirements.get('filters', [])
        
        # Apply filters
        for filter_type in filters:
            if 'date' in filter_type.lower():
                modified_df = self._apply_date_filter(modified_df)
            elif 'amount' in filter_type.lower():
                modified_df = self._apply_amount_filter(modified_df)
            elif 'category' in filter_type.lower():
                modified_df = self._apply_category_filter(modified_df)
        
        # Apply calculations
        for calc_type in calculations:
            if 'total' in calc_type.lower():
                modified_df = self._add_totals(modified_df)
            elif 'percentage' in calc_type.lower():
                modified_df = self._add_percentages(modified_df)
            elif 'average' in calc_type.lower():
                modified_df = self._add_averages(modified_df)
            elif 'growth' in calc_type.lower():
                modified_df = self._add_growth_rates(modified_df)
        
        # Apply modifications
        for mod_type in modifications:
            if 'sort' in mod_type.lower():
                modified_df = self._apply_sorting(modified_df)
            elif 'duplicate' in mod_type.lower():
                modified_df = modified_df.drop_duplicates()
            elif 'consolidate' in mod_type.lower():
                modified_df = self._consolidate_data(modified_df)
        
        return modified_df
    
    def _apply_date_filter(self, df: pd.DataFrame) -> pd.DataFrame:
        """Apply date filtering"""
        date_cols = [col for col in df.columns if 'date' in col.lower()]
        if date_cols and pd.api.types.is_datetime64_any_dtype(df[date_cols[0]]):
            cutoff_date = datetime.now() - timedelta(days=30)
            return df[df[date_cols[0]] >= cutoff_date]
        return df
    
    def _apply_amount_filter(self, df: pd.DataFrame) -> pd.DataFrame:
        """Apply amount filtering"""
        amount_cols = [col for col in df.columns if any(word in col.lower() for word in ['amount', 'price', 'cost'])]
        if amount_cols:
            return df[df[amount_cols[0]] > 0]
        return df
    
    def _apply_category_filter(self, df: pd.DataFrame) -> pd.DataFrame:
        """Apply category filtering"""
        category_cols = [col for col in df.columns if any(word in col.lower() for word in ['category', 'type', 'status'])]
        if category_cols:
            return df[df[category_cols[0]].notna()]
        return df
    
    def _add_totals(self, df: pd.DataFrame) -> pd.DataFrame:
        """Add total calculations"""
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) > 1:
            df['Row_Total'] = df[numeric_cols].sum(axis=1)
        return df
    
    def _add_percentages(self, df: pd.DataFrame) -> pd.DataFrame:
        """Add percentage calculations"""
        amount_cols = [col for col in df.columns if 'amount' in col.lower()]
        if amount_cols:
            total_amount = df[amount_cols[0]].sum()
            df['Amount_Percentage'] = (df[amount_cols[0]] / total_amount * 100).round(2)
        return df
    
    def _add_averages(self, df: pd.DataFrame) -> pd.DataFrame:
        """Add average calculations"""
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) > 0:
            df['Average_Value'] = df[numeric_cols].mean(axis=1)
        return df
    
    def _add_growth_rates(self, df: pd.DataFrame) -> pd.DataFrame:
        """Add growth rate calculations"""
        date_cols = [col for col in df.columns if 'date' in col.lower()]
        amount_cols = [col for col in df.columns if 'amount' in col.lower()]
        
        if date_cols and amount_cols:
            df = df.sort_values(date_cols[0])
            df['Growth_Rate'] = df[amount_cols[0]].pct_change() * 100
        return df
    
    def _apply_sorting(self, df: pd.DataFrame) -> pd.DataFrame:
        """Apply intelligent sorting"""
        date_cols = [col for col in df.columns if 'date' in col.lower()]
        if date_cols:
            return df.sort_values(date_cols[0], ascending=False)
        
        amount_cols = [col for col in df.columns if 'amount' in col.lower()]
        if amount_cols:
            return df.sort_values(amount_cols[0], ascending=False)
        
        return df
    
    def _consolidate_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Consolidate data intelligently"""
        # Group by common columns and sum numeric columns
        group_cols = []
        for col in df.columns:
            if df[col].dtype == 'object' and df[col].nunique() < len(df) * 0.5:
                group_cols.append(col)
        
        if group_cols:
            numeric_cols = df.select_dtypes(include=[np.number]).columns
            return df.groupby(group_cols)[numeric_cols].sum().reset_index()
        
        return df
    
    def _create_output_file(self, modified_sheets: dict, requirements: dict) -> str:
        """Create output Excel file"""
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx')
        temp_file.close()
        
        with pd.ExcelWriter(temp_file.name, engine='openpyxl') as writer:
            for sheet_name, df in modified_sheets.items():
                df.to_excel(writer, sheet_name=sheet_name, index=False)
        
        return temp_file.name
    
    def _get_modifications_summary(self, requirements: dict) -> list:
        """Get summary of modifications applied"""
        modifications = []
        
        if requirements.get('modifications'):
            modifications.append(f"Data modifications: {', '.join(requirements['modifications'])}")
        
        if requirements.get('calculations'):
            modifications.append(f"Calculations: {', '.join(requirements['calculations'])}")
        
        if requirements.get('filters'):
            modifications.append(f"Filters applied: {', '.join(requirements['filters'])}")
        
        return modifications
    
    def _create_data_summary(self, sheets_data: dict) -> dict:
        """Create data summary for AI"""
        summary = {
            'total_sheets': len(sheets_data),
            'total_rows': sum(sheet['rows'] for sheet in sheets_data.values()),
            'sheets_info': {}
        }
        
        for sheet_name, sheet_info in sheets_data.items():
            summary['sheets_info'][sheet_name] = {
                'rows': sheet_info['rows'],
                'columns': len(sheet_info['columns']),
                'column_names': sheet_info['columns'],
                'sample_data': sheet_info['sample_data']
            }
        
        return summary
    
    def _create_conversation_summary(self) -> str:
        """Create summary of the conversation"""
        summary = "Conversation Summary:\n"
        for i, entry in enumerate(self.conversation_history, 1):
            if entry['type'] == 'ai_question':
                summary += f"{i}. AI: {entry['content']}\n"
            else:
                summary += f"{i}. User: {entry['content']}\n"
        return summary
    
    def _call_gemini_api(self, prompt: str) -> str:
        """Call Gemini API"""
        try:
            headers = {
                'Content-Type': 'application/json',
            }
            
            data = {
                'contents': [{
                    'parts': [{'text': prompt}]
                }],
                'generationConfig': {
                    'temperature': 0.7,
                    'maxOutputTokens': 500,
                }
            }
            
            response = requests.post(
                f"{self.api_url}?key={self.api_key}",
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                if 'candidates' in result and len(result['candidates']) > 0:
                    return result['candidates'][0]['content']['parts'][0]['text']
            
            return "I need more information to help you with your Excel file."
            
        except Exception as e:
            print(f"Gemini API error: {e}")
            return "I need more information to help you with your Excel file."

# Main function for integration
def process_excel_with_ai_interaction(filepath: str, user_response: str = None, conversation_step: int = 1) -> dict:
    """
    Main function for AI-powered Excel processing
    """
    processor = AIInteractiveExcelProcessor()
    
    if user_response is None:
        # First call - analyze and ask first question
        return processor.analyze_excel_with_ai(filepath)
    else:
        # Subsequent calls - process user response
        return processor.process_ai_response(user_response, filepath)
