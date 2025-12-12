from fastapi import FastAPI, File, UploadFile, HTTPException, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from typing import Optional
import tempfile
import os
import time
from sentinel_engine import process_financial_workbook, get_gemini_response, create_reallocated_excel, get_continuous_analysis
from ai_interactive_excel_processor import process_excel_with_ai_interaction
from auth_service import register_user, login_user, logout_user, get_user_info, validate_session
from config import CORS_ORIGINS

app = FastAPI(title="Aura - Autonomous Treasury Analyst", version="1.0.0")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class QueryRequest(BaseModel):
    query: str
    persona: str
    context: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str

class LoginRequest(BaseModel):
    email: str
    password: str

class LogoutRequest(BaseModel):
    session_token: str

class ExcelRequirementsRequest(BaseModel):
    file_id: str
    requirements: dict

class ExcelAnalysisRequest(BaseModel):
    file_id: str

class AIExcelConversationRequest(BaseModel):
    file_id: str
    user_response: str
    conversation_step: int = 1

# Store uploaded files temporarily
uploaded_files = {}

# Global data store for processed financial data
processed_financial_data = {}

@app.get("/")
async def root():
    return {"message": "Aura - Autonomous Treasury Analyst API is running"}

@app.post("/auth/register")
async def register(request: RegisterRequest):
    """Register a new user"""
    try:
        result = register_user(request.email, request.password, request.name)
        if result["success"]:
            return JSONResponse(content=result, status_code=201)
        else:
            return JSONResponse(content=result, status_code=400)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration error: {str(e)}")

@app.post("/auth/login")
async def login(request: LoginRequest):
    """Login user and return session token"""
    try:
        result = login_user(request.email, request.password)
        if result["success"]:
            return JSONResponse(content=result)
        else:
            return JSONResponse(content=result, status_code=401)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login error: {str(e)}")

@app.post("/auth/logout")
async def logout(request: LogoutRequest):
    """Logout user and invalidate session"""
    try:
        result = logout_user(request.session_token)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Logout error: {str(e)}")

@app.get("/auth/user")
async def get_user(authorization: Optional[str] = Header(None)):
    """Get user information from session token"""
    try:
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="No valid authorization token")
        
        session_token = authorization.replace("Bearer ", "")
        user_info = get_user_info(session_token)
        
        if not user_info:
            raise HTTPException(status_code=401, detail="Invalid or expired session")
        
        return JSONResponse(content={"success": True, "user": user_info})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting user info: {str(e)}")

@app.post("/uploadfile/")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload endpoint that accepts Excel files and returns KPI dashboard data
    """
    try:
        # Validate file type
        if not file.filename.endswith('.xlsx'):
            raise HTTPException(status_code=400, detail="Only .xlsx files are supported")
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx') as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        # Ensure file is closed before processing
        time.sleep(0.1)
        
        try:
            # Process the financial workbook
            result = process_financial_workbook(tmp_file_path)
            
            # Store the processed data globally for all chatbots to access
            file_id = f"file_{int(time.time())}"
            uploaded_files[file_id] = tmp_file_path
            processed_financial_data[file_id] = result
            
            print(f"📊 Stored processed data for file {file_id}")
            print(f"📊 Data keys: {list(result.keys())}")
            if 'current_metrics' in result:
                print(f"📊 Current metrics: {list(result['current_metrics'].keys())}")
            
            return JSONResponse(content=result)
        
        finally:
            # Don't clean up the file immediately - keep it for chatbot access
            pass
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.post("/query/")
async def handle_query(request: Request):
    """
    Handle AI queries from frontend with optional image upload
    """
    try:
        # Get content type to determine how to parse the request
        content_type = request.headers.get("content-type", "")
        
        if "application/json" in content_type:
            # Handle JSON data
            try:
                request_data = await request.json()
                query = request_data.get('query', '')
                persona = request_data.get('persona', 'CFO')
                context = request_data.get('context', '{}')
                image = None
            except Exception as e:
                print(f"Error parsing JSON request: {e}")
                return JSONResponse(content={"response": "Error parsing JSON request"}, status_code=400)
        else:
            # Handle form data (with potential image)
            try:
                form_data = await request.form()
                query = form_data.get('query', '')
                persona = form_data.get('persona', 'CFO')
                context = form_data.get('context', '{}')
                image = form_data.get('image')
            except Exception as e:
                print(f"Error parsing form request: {e}")
                return JSONResponse(content={"response": "Error parsing form request"}, status_code=400)
        
        # Parse context if it's a JSON string
        if isinstance(context, str):
            try:
                import json
                context = json.loads(context)
            except json.JSONDecodeError:
                # If parsing fails, use as string
                pass
        
        # Get the latest processed financial data for context
        latest_financial_data = None
        if processed_financial_data:
            try:
                # Get the most recent processed data
                latest_file_id = max(processed_financial_data.keys(), key=lambda k: int(k.split('_')[1]) if '_' in k else 0)
                latest_financial_data = processed_financial_data[latest_file_id]
                print(f"📊 Using processed financial data for {persona} response")
                print(f"📊 Available data keys: {list(latest_financial_data.keys())}")
                
                # Debug: Print actual financial metrics
                if 'current_metrics' in latest_financial_data:
                    current_metrics = latest_financial_data['current_metrics']
                    print(f"📊 Current metrics structure: {list(current_metrics.keys())}")
                    for metric_name, metric_data in current_metrics.items():
                        if isinstance(metric_data, dict):
                            print(f"📊 {metric_name}: {list(metric_data.keys())}")
                            for key, value in metric_data.items():
                                if isinstance(value, (int, float)) and value != 0:
                                    print(f"📊 {metric_name}.{key}: {value}")
                
            except Exception as e:
                print(f"Error getting processed financial data: {e}")
        
        # Combine context with processed financial data
        if latest_financial_data:
            if isinstance(context, dict):
                context['processed_financial_data'] = latest_financial_data
                context['dashboard_data'] = latest_financial_data  # For backward compatibility
            else:
                context = {
                    'processed_financial_data': latest_financial_data,
                    'dashboard_data': latest_financial_data,  # For backward compatibility
                    'original_context': context
                }
        
        # Handle image if provided
        image_description = ""
        if image and hasattr(image, 'filename') and image.filename:
            try:
                image_description = f" [User uploaded an image: {image.filename}]"
                print(f"📸 Image received: {image.filename}")
            except Exception as e:
                print(f"Image processing error: {e}")
        
        # Combine query with image description
        full_query = query + image_description
        
        response = get_gemini_response(full_query, context, persona)
        return JSONResponse(content={"response": response})
    except Exception as e:
        print(f"Query error: {e}")
        return JSONResponse(content={"response": f"Error processing query: {str(e)}"}, status_code=500)

@app.post("/analyze-excel/")
async def analyze_excel_for_modifications(file: UploadFile = File(...)):
    """
    Analyze Excel file and start AI conversation
    """
    try:
        # Save uploaded file temporarily
        file_id = f"file_{int(time.time())}"
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx')
        temp_file.close()
        
        with open(temp_file.name, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        uploaded_files[file_id] = temp_file.name
        
        # Analyze the Excel file with AI
        result = process_excel_with_ai_interaction(temp_file.name)
        
        return JSONResponse(content={
            "file_id": file_id,
            "analysis": result
        })
        
    except Exception as e:
        print(f"Excel analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Error analyzing Excel: {str(e)}")

@app.post("/ai-excel-conversation/")
async def ai_excel_conversation(request: AIExcelConversationRequest):
    """
    Continue AI conversation for Excel processing using Gemini API
    """
    try:
        if request.file_id not in uploaded_files:
            raise HTTPException(status_code=404, detail="File not found")
        
        filepath = uploaded_files[request.file_id]
        
        # Get the processed financial data for context
        latest_financial_data = None
        if processed_financial_data:
            try:
                latest_file_id = max(processed_financial_data.keys(), key=lambda k: int(k.split('_')[1]) if '_' in k else 0)
                latest_financial_data = processed_financial_data[latest_file_id]
                print(f"📊 Using processed financial data for Excel conversation")
            except Exception as e:
                print(f"Error getting processed financial data: {e}")
        
        # Create context for Gemini API
        context = {
            'processed_financial_data': latest_financial_data,
            'user_request': request.user_response,
            'conversation_step': request.conversation_step,
            'file_path': filepath
        }
        
        # Use Gemini API for Excel analysis
        gemini_response = get_gemini_response(
            f"Excel Processing Request: {request.user_response}. Analyze the Excel file and provide specific recommendations for modifications.",
            context,
            "Excel Assistant"
        )
        
        # Process user response with AI
        result = process_excel_with_ai_interaction(
            filepath, 
            request.user_response, 
            request.conversation_step
        )
        
        # Enhance result with Gemini analysis
        if result.get('status') == 'continue_conversation':
            result['ai_question'] = gemini_response
        elif result.get('status') == 'success':
            result['gemini_analysis'] = gemini_response
        
        if result['status'] == 'success' and 'output_file' in result:
            # Store the output file path
            output_file_id = f"{request.file_id}_output"
            uploaded_files[output_file_id] = result['output_file']
            result['download_file_id'] = output_file_id
        
        return JSONResponse(content=result)
        
    except Exception as e:
        print(f"AI conversation error: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing conversation: {str(e)}")

@app.post("/process-excel-requirements/")
async def process_excel_requirements(request: ExcelRequirementsRequest):
    """
    Process Excel file based on user requirements (legacy endpoint)
    """
    try:
        if request.file_id not in uploaded_files:
            raise HTTPException(status_code=404, detail="File not found")
        
        filepath = uploaded_files[request.file_id]
        
        # Process the Excel file with requirements
        result = process_excel_interactively(filepath, request.requirements)
        
        if result['status'] == 'success':
            # Store the output file path
            uploaded_files[f"{request.file_id}_output"] = result['output_file']
            result['download_file_id'] = f"{request.file_id}_output"
        
        return JSONResponse(content=result)
        
    except Exception as e:
        print(f"Excel processing error: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing Excel: {str(e)}")

class GenerateProcessedExcelRequest(BaseModel):
    filename: str
    modifications: list

@app.post("/generate-processed-excel/")
async def generate_processed_excel(request: GenerateProcessedExcelRequest):
    """
    Generate a processed Excel file with new columns added alongside existing ones
    """
    try:
        # Find the most recently uploaded file
        if not uploaded_files:
            raise HTTPException(status_code=404, detail="No uploaded file found")
        
        # Get the most recent file
        latest_file_id = max(uploaded_files.keys(), key=lambda k: int(k.split('_')[1]) if '_' in k else 0)
        filepath = uploaded_files[latest_file_id]
        
        if not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail="Uploaded file no longer exists")
        
        # Get the processed financial data for reference
        latest_financial_data = processed_financial_data.get(latest_file_id, {})
        current_metrics = latest_financial_data.get('current_metrics', {})
        
        print(f"📊 Using processed financial data for Excel generation")
        print(f"📊 Available metrics: {list(current_metrics.keys())}")
        
        # Load the actual uploaded file data
        import pandas as pd
        import numpy as np
        from datetime import datetime, timedelta
        
        # Load the actual Excel file
        excel_file = pd.ExcelFile(filepath)
        sheets_data = {}
        
        for sheet_name in excel_file.sheet_names:
            df = pd.read_excel(filepath, sheet_name=sheet_name)
            sheets_data[sheet_name] = df
        
        # Process each sheet and add new columns
        processed_sheets = {}
        
        for sheet_name, df in sheets_data.items():
            processed_df = df.copy()
            
            # Add new calculated columns based on the modifications requested
            modifications = request.modifications
            
            if 'profit' in str(modifications).lower():
                # Add profit-related columns using actual data
                amount_cols = [col for col in df.columns if any(word in col.lower() for word in ['amount', 'price', 'value', 'cost'])]
                if amount_cols:
                    amount_col = amount_cols[0]
                    # Use actual revenue data if available
                    if 'revenue' in current_metrics:
                        revenue_data = current_metrics['revenue']
                        avg_margin = revenue_data.get('net_income', 0) / revenue_data.get('total_revenue', 1) if revenue_data.get('total_revenue', 0) > 0 else 0.15
                    else:
                        avg_margin = 0.15
                    
                    processed_df['Profit_Margin'] = processed_df[amount_col] * avg_margin
                    processed_df['Net_Profit'] = processed_df[amount_col] - (processed_df[amount_col] * (1 - avg_margin))
            
            if 'monthly' in str(modifications).lower():
                # Add monthly analysis columns
                date_cols = [col for col in df.columns if 'date' in col.lower()]
                if date_cols:
                    date_col = date_cols[0]
                    processed_df['Month'] = pd.to_datetime(processed_df[date_col]).dt.month
                    processed_df['Month_Name'] = pd.to_datetime(processed_df[date_col]).dt.strftime('%B')
                    processed_df['Year'] = pd.to_datetime(processed_df[date_col]).dt.year
                    
                    # Add monthly totals
                    amount_cols = [col for col in df.columns if any(word in col.lower() for word in ['amount', 'price', 'value'])]
                    if amount_cols:
                        amount_col = amount_cols[0]
                        processed_df['Monthly_Total'] = processed_df.groupby(['Year', 'Month'])[amount_col].transform('sum')
            
            if 'category' in str(modifications).lower():
                # Add category analysis columns
                category_cols = [col for col in df.columns if any(word in col.lower() for word in ['category', 'type', 'status'])]
                if category_cols:
                    category_col = category_cols[0]
                    processed_df['Category_Count'] = processed_df.groupby(category_col)[category_col].transform('count')
                    processed_df['Category_Percentage'] = (processed_df['Category_Count'] / len(processed_df) * 100).round(2)
            
            if 'roi' in str(modifications).lower():
                # Add ROI calculations using actual marketing data
                spend_cols = [col for col in df.columns if any(word in col.lower() for word in ['spend', 'cost', 'investment'])]
                acquisition_cols = [col for col in df.columns if any(word in col.lower() for word in ['acquisition', 'conversion', 'lead'])]
                
                if spend_cols and acquisition_cols:
                    spend_col = spend_cols[0]
                    acquisition_col = acquisition_cols[0]
                    
                    # Use actual CAC if available
                    if 'marketing' in current_metrics:
                        marketing_data = current_metrics['marketing']
                        actual_cac = marketing_data.get('cost_per_acquisition', 0)
                        if actual_cac > 0:
                            processed_df['Cost_Per_Acquisition'] = actual_cac
                            processed_df['ROI'] = (processed_df[acquisition_col] * 100) / processed_df[spend_col]
                        else:
                            processed_df['ROI'] = (processed_df[acquisition_col] * 100) / processed_df[spend_col]
                            processed_df['Cost_Per_Acquisition'] = processed_df[spend_col] / processed_df[acquisition_col]
                    else:
                        processed_df['ROI'] = (processed_df[acquisition_col] * 100) / processed_df[spend_col]
                        processed_df['Cost_Per_Acquisition'] = processed_df[spend_col] / processed_df[acquisition_col]
                    
                    processed_df['Efficiency_Score'] = processed_df['ROI'] / processed_df['Cost_Per_Acquisition'] * 100
            
            if 'growth' in str(modifications).lower():
                # Add growth calculations using actual growth rates
                date_cols = [col for col in df.columns if 'date' in col.lower()]
                amount_cols = [col for col in df.columns if any(word in col.lower() for word in ['amount', 'price', 'value'])]
                
                if date_cols and amount_cols:
                    date_col = date_cols[0]
                    amount_col = amount_cols[0]
                    processed_df = processed_df.sort_values(date_col)
                    processed_df['Growth_Rate'] = processed_df[amount_col].pct_change() * 100
                    processed_df['Cumulative_Growth'] = processed_df[amount_col].cumsum()
                    
                    # Add actual growth rate from processed data
                    if 'revenue' in current_metrics:
                        revenue_growth = current_metrics['revenue'].get('revenue_growth_rate', 0) * 100
                        processed_df['Actual_Growth_Rate'] = revenue_growth
            
            # Add general calculated columns
            numeric_cols = processed_df.select_dtypes(include=[np.number]).columns
            if len(numeric_cols) > 1:
                processed_df['Row_Total'] = processed_df[numeric_cols].sum(axis=1)
                processed_df['Row_Average'] = processed_df[numeric_cols].mean(axis=1)
            
            processed_sheets[sheet_name] = processed_df
        
        # Create DataFrames from processed sheets
        transactions_df = processed_sheets.get('Transactions', pd.DataFrame())
        campaign_df = processed_sheets.get('Campaign_Data', pd.DataFrame())
        targets_df = processed_sheets.get('Targets', pd.DataFrame())
        
        # Create temporary file
        file_id = f"processed_{int(time.time())}"
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx')
        temp_file.close()
        
        # Write to Excel with multiple sheets using processed data
        with pd.ExcelWriter(temp_file.name, engine='openpyxl') as writer:
            for sheet_name, df in processed_sheets.items():
                df.to_excel(writer, sheet_name=sheet_name, index=False)
            
            # Add a summary sheet with actual calculated metrics
            if not transactions_df.empty or not campaign_df.empty:
                summary_data = {
                    'Metric': [],
                    'Value': [],
                    'Source': []
                }
                
                # Add actual calculated values from processed data
                if 'revenue' in current_metrics:
                    revenue_data = current_metrics['revenue']
                    summary_data['Metric'].extend(['Total Revenue (Calculated)', 'Total Expenses (Calculated)', 'Net Income (Calculated)', 'Revenue Growth Rate (%)'])
                    summary_data['Value'].extend([
                        revenue_data.get('total_revenue', 0),
                        revenue_data.get('total_expenses', 0),
                        revenue_data.get('net_income', 0),
                        revenue_data.get('revenue_growth_rate', 0) * 100
                    ])
                    summary_data['Source'].extend(['AI Analysis', 'AI Analysis', 'AI Analysis', 'AI Analysis'])
                
                if 'marketing' in current_metrics:
                    marketing_data = current_metrics['marketing']
                    summary_data['Metric'].extend(['Total Marketing Spend (Calculated)', 'Total Acquisitions (Calculated)', 'Cost Per Acquisition (Calculated)', 'Spend Efficiency (Calculated)'])
                    summary_data['Value'].extend([
                        marketing_data.get('total_spend', 0),
                        marketing_data.get('total_acquisitions', 0),
                        marketing_data.get('cost_per_acquisition', 0),
                        marketing_data.get('spend_efficiency', 0)
                    ])
                    summary_data['Source'].extend(['AI Analysis', 'AI Analysis', 'AI Analysis', 'AI Analysis'])
                
                if 'cash_flow' in current_metrics:
                    cash_flow_data = current_metrics['cash_flow']
                    summary_data['Metric'].extend(['Monthly Cash Flow (Calculated)', 'Cash Flow Trend (%)', 'Burn Rate (Calculated)'])
                    summary_data['Value'].extend([
                        cash_flow_data.get('monthly_average', 0),
                        cash_flow_data.get('cash_flow_trend', 0) * 100,
                        cash_flow_data.get('burn_rate', 0)
                    ])
                    summary_data['Source'].extend(['AI Analysis', 'AI Analysis', 'AI Analysis'])
                
                # Add basic file metrics
                if not transactions_df.empty:
                    amount_cols = [col for col in transactions_df.columns if any(word in col.lower() for word in ['amount', 'price', 'value'])]
                    if amount_cols:
                        summary_data['Metric'].extend(['Total Transactions (File)', 'Average Transaction (File)'])
                        summary_data['Value'].extend([
                            len(transactions_df),
                            transactions_df[amount_cols[0]].mean()
                        ])
                        summary_data['Source'].extend(['File Data', 'File Data'])
                
                if summary_data['Metric']:
                    summary_df = pd.DataFrame(summary_data)
                    summary_df.to_excel(writer, sheet_name='AI_Calculated_Summary', index=False)
        
        # Store the file
        uploaded_files[file_id] = temp_file.name
        
        return JSONResponse(content={
            "success": True,
            "file_id": file_id,
            "message": "Excel file processed successfully with AI-calculated columns added",
            "modifications_applied": request.modifications,
            "new_columns_added": [
                "Profit_Margin", "Net_Profit", "Month", "Month_Name", "Monthly_Total",
                "Category_Count", "Category_Percentage", "ROI", "Cost_Per_Acquisition",
                "Efficiency_Score", "Growth_Rate", "Cumulative_Growth", "Actual_Growth_Rate", "Row_Total", "Row_Average"
            ],
            "ai_calculated_metrics": current_metrics
        })
        
    except Exception as e:
        print(f"Error generating processed Excel: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating processed Excel: {str(e)}")

@app.get("/download-processed-excel/{file_id}")
async def download_processed_excel(file_id: str):
    """
    Download the processed Excel file
    """
    try:
        # Handle mock file ID by generating a file on demand
        if file_id == 'mock_file_id':
            # Generate a sample processed Excel file
            import pandas as pd
            import numpy as np
            
            # Create sample data with new columns
            transactions_data = {
                'Date': pd.date_range(start='2024-01-01', periods=100, freq='D'),
                'Description': [f'Transaction {i}' for i in range(100)],
                'Category': np.random.choice(['Revenue', 'Expense', 'Investment'], 100),
                'Amount': np.random.uniform(-5000, 10000, 100),
                'Account': np.random.choice(['Cash', 'Bank', 'Credit'], 100),
                # New calculated columns
                'Profit_Margin': np.random.uniform(0.1, 0.3, 100),
                'Net_Profit': np.random.uniform(-1000, 2000, 100),
                'Month': pd.date_range(start='2024-01-01', periods=100, freq='D').month,
                'Month_Name': pd.date_range(start='2024-01-01', periods=100, freq='D').strftime('%B'),
                'Category_Percentage': np.random.uniform(0, 100, 100),
                'Growth_Rate': np.random.uniform(-10, 20, 100)
            }
            
            campaign_data = {
                'Date': pd.date_range(start='2024-01-01', periods=100, freq='D'),
                'Campaign_ID': [f'CAMP_{i:03d}' for i in range(100)],
                'Channel': np.random.choice(['Online', 'Offline', 'Social'], 100),
                'Spend': np.random.uniform(100, 2000, 100),
                'Acquisitions': np.random.randint(1, 100, 100),
                # New calculated columns
                'ROI': np.random.uniform(1.5, 5.0, 100),
                'Cost_Per_Acquisition': np.random.uniform(50, 200, 100),
                'Efficiency_Score': np.random.uniform(60, 95, 100)
            }
            
            targets_data = {
                'Metric_Name': ['Revenue Target', 'CAC Target', 'ROI Target', 'Growth Rate'],
                'Value': [500000, 100, 2.5, 0.15]
            }
            
            # Create temporary file
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx')
            temp_file.close()
            
            # Write to Excel
            with pd.ExcelWriter(temp_file.name, engine='openpyxl') as writer:
                pd.DataFrame(transactions_data).to_excel(writer, sheet_name='Transactions', index=False)
                pd.DataFrame(campaign_data).to_excel(writer, sheet_name='Campaign_Data', index=False)
                pd.DataFrame(targets_data).to_excel(writer, sheet_name='Targets', index=False)
            
            filepath = temp_file.name
            filename = "processed_excel_with_new_columns.xlsx"
        else:
            if file_id not in uploaded_files:
                raise HTTPException(status_code=404, detail="File not found")
            
            filepath = uploaded_files[file_id]
            
            if not os.path.exists(filepath):
                raise HTTPException(status_code=404, detail="File no longer exists")
            
            filename = f"processed_excel_{file_id}.xlsx"
        
        return FileResponse(
            path=filepath,
            filename=filename,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except Exception as e:
        print(f"Download error: {e}")
        raise HTTPException(status_code=500, detail=f"Error downloading file: {str(e)}")

@app.post("/download-excel/")
async def download_reallocated_excel(file: UploadFile = File(...)):
    """
    Create and download reallocated Excel file
    """
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx') as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        try:
            # Process the file to get data
            result = process_financial_workbook(tmp_file_path)
            
            # Create reallocated Excel
            output_path = create_reallocated_excel(result, tmp_file_path)
            
            # Read the created file
            with open(output_path, 'rb') as f:
                file_content = f.read()
            
            # Clean up files
            os.unlink(tmp_file_path)
            os.unlink(output_path)
            
            return JSONResponse(
                content={"success": True, "message": "Reallocated Excel created successfully"},
                headers={"Content-Disposition": "attachment; filename=reallocated_budget.xlsx"}
            )
            
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_file_path):
                os.unlink(tmp_file_path)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating reallocated Excel: {str(e)}")

@app.post("/continuous-analysis/")
async def get_continuous_analysis_endpoint(file: UploadFile = File(...)):
    """
    Get continuous analysis from CFO and CEO
    """
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx') as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        try:
            # Process the file to get data
            result = process_financial_workbook(tmp_file_path)
            
            # Get continuous analysis
            analysis = get_continuous_analysis(result)
            
            return JSONResponse(content={
                "success": True,
                "analysis": analysis,
                "data": result
            })
            
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_file_path):
                os.unlink(tmp_file_path)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting continuous analysis: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
