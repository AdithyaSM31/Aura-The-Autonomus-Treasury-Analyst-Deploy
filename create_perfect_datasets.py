import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

def create_perfect_datasets():
    """
    Create 10 perfect datasets with 500 entries each that work perfectly with analytics graphs
    """
    
    # Set random seed for reproducibility
    np.random.seed(42)
    random.seed(42)
    
    datasets = []
    
    # Dataset 1: E-commerce Company
    ecommerce_data = create_ecommerce_dataset()
    datasets.append(('dataset_1_ecommerce.xlsx', ecommerce_data))
    
    # Dataset 2: SaaS Startup
    saas_data = create_saas_dataset()
    datasets.append(('dataset_2_saas.xlsx', saas_data))
    
    # Dataset 3: Consulting Firm
    consulting_data = create_consulting_dataset()
    datasets.append(('dataset_3_consulting.xlsx', consulting_data))
    
    # Dataset 4: Manufacturing Company
    manufacturing_data = create_manufacturing_dataset()
    datasets.append(('dataset_4_manufacturing.xlsx', manufacturing_data))
    
    # Dataset 5: Healthcare Provider
    healthcare_data = create_healthcare_dataset()
    datasets.append(('dataset_5_healthcare.xlsx', healthcare_data))
    
    # Dataset 6: Real Estate Agency
    realestate_data = create_realestate_dataset()
    datasets.append(('dataset_6_realestate.xlsx', realestate_data))
    
    # Dataset 7: Food & Beverage
    foodbeverage_data = create_foodbeverage_dataset()
    datasets.append(('dataset_7_foodbeverage.xlsx', foodbeverage_data))
    
    # Dataset 8: Technology Services
    techservices_data = create_techservices_dataset()
    datasets.append(('dataset_8_techservices.xlsx', techservices_data))
    
    # Dataset 9: Financial Services
    financial_data = create_financial_dataset()
    datasets.append(('dataset_9_financial.xlsx', financial_data))
    
    # Dataset 10: Education Technology
    edtech_data = create_edtech_dataset()
    datasets.append(('dataset_10_edtech.xlsx', edtech_data))
    
    return datasets

def create_ecommerce_dataset():
    """E-commerce company with high transaction volume and marketing campaigns"""
    # Transactions (500 entries)
    transactions = []
    base_date = datetime.now() - timedelta(days=365)
    
    for i in range(500):
        date = base_date + timedelta(days=i)
        amount = np.random.normal(150, 50)  # Average $150 per transaction
        category = np.random.choice(['Sales', 'Refunds', 'Shipping', 'Fees'], p=[0.7, 0.1, 0.15, 0.05])
        description = f"{category} transaction #{i+1}"
        
        transactions.append({
            'Date': date.strftime('%Y-%m-%d'),
            'Description': description,
            'Category': category,
            'Amount': round(amount, 2)
        })
    
    # Campaigns (500 entries)
    campaigns = []
    channels = ['Google Ads', 'Facebook', 'Instagram', 'Email', 'Affiliate']
    
    for i in range(500):
        timestamp = base_date + timedelta(days=i)
        channel = np.random.choice(channels)
        spend = np.random.normal(1000, 300)  # Average $1000 per campaign
        acquisitions = int(np.random.normal(50, 15))  # Average 50 acquisitions
        
        campaigns.append({
            'Timestamp': timestamp.strftime('%Y-%m-%d'),
            'Campaign_ID': f"CAMP_{i+1:04d}",
            'Channel': channel,
            'Spend': round(spend, 2),
            'Acquisitions': max(1, acquisitions)
        })
    
    # Targets
    targets = [
        {'Metric_Name': 'Monthly_Revenue_Target', 'Value': 500000},
        {'Metric_Name': 'Customer_Acquisition_Target', 'Value': 2000},
        {'Metric_Name': 'Marketing_ROI_Target', 'Value': 300},
        {'Metric_Name': 'Cash_Flow_Target', 'Value': 100000}
    ]
    
    return {
        'Transactions': pd.DataFrame(transactions),
        'Campaign_Data': pd.DataFrame(campaigns),
        'Targets': pd.DataFrame(targets)
    }

def create_saas_dataset():
    """SaaS startup with subscription revenue and customer acquisition"""
    transactions = []
    campaigns = []
    base_date = datetime.now() - timedelta(days=365)
    
    # Transactions - subscription revenue
    for i in range(500):
        date = base_date + timedelta(days=i)
        amount = np.random.normal(200, 50)  # Average $200 MRR
        category = np.random.choice(['Subscription', 'Upgrade', 'Downgrade', 'Churn'], p=[0.8, 0.1, 0.05, 0.05])
        description = f"{category} - Plan {np.random.choice(['Basic', 'Pro', 'Enterprise'])}"
        
        transactions.append({
            'Date': date.strftime('%Y-%m-%d'),
            'Description': description,
            'Category': category,
            'Amount': round(amount, 2)
        })
    
    # Campaigns - B2B focused
    channels = ['LinkedIn', 'Google Ads', 'Content Marketing', 'Webinars', 'Referrals']
    
    for i in range(500):
        timestamp = base_date + timedelta(days=i)
        channel = np.random.choice(channels)
        spend = np.random.normal(2000, 500)  # Higher B2B spend
        acquisitions = int(np.random.normal(20, 8))  # Lower volume, higher value
        
        campaigns.append({
            'Timestamp': timestamp.strftime('%Y-%m-%d'),
            'Campaign_ID': f"SAAS_{i+1:04d}",
            'Channel': channel,
            'Spend': round(spend, 2),
            'Acquisitions': max(1, acquisitions)
        })
    
    targets = [
        {'Metric_Name': 'MRR_Target', 'Value': 100000},
        {'Metric_Name': 'CAC_Target', 'Value': 150},
        {'Metric_Name': 'Churn_Rate_Target', 'Value': 5},
        {'Metric_Name': 'LTV_Target', 'Value': 2000}
    ]
    
    return {
        'Transactions': pd.DataFrame(transactions),
        'Campaign_Data': pd.DataFrame(campaigns),
        'Targets': pd.DataFrame(targets)
    }

def create_consulting_dataset():
    """Consulting firm with project-based revenue"""
    transactions = []
    campaigns = []
    base_date = datetime.now() - timedelta(days=365)
    
    # Transactions - project payments
    for i in range(500):
        date = base_date + timedelta(days=i)
        amount = np.random.normal(5000, 1500)  # Average $5000 per project
        category = np.random.choice(['Project Payment', 'Retainer', 'Expenses', 'Consulting'], p=[0.6, 0.2, 0.1, 0.1])
        description = f"{category} - {np.random.choice(['Strategy', 'Operations', 'Technology', 'Finance'])}"
        
        transactions.append({
            'Date': date.strftime('%Y-%m-%d'),
            'Description': description,
            'Category': category,
            'Amount': round(amount, 2)
        })
    
    # Campaigns - professional services
    channels = ['LinkedIn', 'Referrals', 'Conferences', 'Content', 'Direct Outreach']
    
    for i in range(500):
        timestamp = base_date + timedelta(days=i)
        channel = np.random.choice(channels)
        spend = np.random.normal(500, 200)  # Lower marketing spend
        acquisitions = int(np.random.normal(5, 2))  # Very low volume, high value
        
        campaigns.append({
            'Timestamp': timestamp.strftime('%Y-%m-%d'),
            'Campaign_ID': f"CONS_{i+1:04d}",
            'Channel': channel,
            'Spend': round(spend, 2),
            'Acquisitions': max(1, acquisitions)
        })
    
    targets = [
        {'Metric_Name': 'Project_Revenue_Target', 'Value': 2000000},
        {'Metric_Name': 'Client_Acquisition_Target', 'Value': 50},
        {'Metric_Name': 'Utilization_Rate_Target', 'Value': 85},
        {'Metric_Name': 'Profit_Margin_Target', 'Value': 25}
    ]
    
    return {
        'Transactions': pd.DataFrame(transactions),
        'Campaign_Data': pd.DataFrame(campaigns),
        'Targets': pd.DataFrame(targets)
    }

def create_manufacturing_dataset():
    """Manufacturing company with production costs and B2B sales"""
    transactions = []
    campaigns = []
    base_date = datetime.now() - timedelta(days=365)
    
    # Transactions - production and sales
    for i in range(500):
        date = base_date + timedelta(days=i)
        amount = np.random.normal(10000, 3000)  # Large B2B transactions
        category = np.random.choice(['Sales', 'Raw Materials', 'Labor', 'Overhead'], p=[0.4, 0.3, 0.2, 0.1])
        description = f"{category} - {np.random.choice(['Product A', 'Product B', 'Product C'])}"
        
        transactions.append({
            'Date': date.strftime('%Y-%m-%d'),
            'Description': description,
            'Category': category,
            'Amount': round(amount, 2)
        })
    
    # Campaigns - B2B focused
    channels = ['Trade Shows', 'Industry Publications', 'Direct Sales', 'Online Ads', 'Partnerships']
    
    for i in range(500):
        timestamp = base_date + timedelta(days=i)
        channel = np.random.choice(channels)
        spend = np.random.normal(3000, 1000)  # High B2B marketing spend
        acquisitions = int(np.random.normal(10, 5))  # Low volume, high value
        
        campaigns.append({
            'Timestamp': timestamp.strftime('%Y-%m-%d'),
            'Campaign_ID': f"MFG_{i+1:04d}",
            'Channel': channel,
            'Spend': round(spend, 2),
            'Acquisitions': max(1, acquisitions)
        })
    
    targets = [
        {'Metric_Name': 'Production_Volume_Target', 'Value': 10000},
        {'Metric_Name': 'Cost_Per_Unit_Target', 'Value': 50},
        {'Metric_Name': 'Quality_Rate_Target', 'Value': 99},
        {'Metric_Name': 'Delivery_Time_Target', 'Value': 7}
    ]
    
    return {
        'Transactions': pd.DataFrame(transactions),
        'Campaign_Data': pd.DataFrame(campaigns),
        'Targets': pd.DataFrame(targets)
    }

def create_healthcare_dataset():
    """Healthcare provider with patient revenue and service costs"""
    transactions = []
    campaigns = []
    base_date = datetime.now() - timedelta(days=365)
    
    # Transactions - patient services
    for i in range(500):
        date = base_date + timedelta(days=i)
        amount = np.random.normal(300, 100)  # Average patient visit cost
        category = np.random.choice(['Patient Services', 'Insurance', 'Medications', 'Equipment'], p=[0.6, 0.2, 0.15, 0.05])
        description = f"{category} - {np.random.choice(['Consultation', 'Treatment', 'Diagnosis', 'Follow-up'])}"
        
        transactions.append({
            'Date': date.strftime('%Y-%m-%d'),
            'Description': description,
            'Category': category,
            'Amount': round(amount, 2)
        })
    
    # Campaigns - patient acquisition
    channels = ['Community Outreach', 'Online Ads', 'Referrals', 'Health Fairs', 'Social Media']
    
    for i in range(500):
        timestamp = base_date + timedelta(days=i)
        channel = np.random.choice(channels)
        spend = np.random.normal(800, 300)  # Moderate marketing spend
        acquisitions = int(np.random.normal(30, 10))  # Patient acquisitions
        
        campaigns.append({
            'Timestamp': timestamp.strftime('%Y-%m-%d'),
            'Campaign_ID': f"HC_{i+1:04d}",
            'Channel': channel,
            'Spend': round(spend, 2),
            'Acquisitions': max(1, acquisitions)
        })
    
    targets = [
        {'Metric_Name': 'Patient_Volume_Target', 'Value': 5000},
        {'Metric_Name': 'Revenue_Per_Patient_Target', 'Value': 400},
        {'Metric_Name': 'Patient_Satisfaction_Target', 'Value': 95},
        {'Metric_Name': 'No_Show_Rate_Target', 'Value': 10}
    ]
    
    return {
        'Transactions': pd.DataFrame(transactions),
        'Campaign_Data': pd.DataFrame(campaigns),
        'Targets': pd.DataFrame(targets)
    }

def create_realestate_dataset():
    """Real estate agency with commission-based revenue"""
    transactions = []
    campaigns = []
    base_date = datetime.now() - timedelta(days=365)
    
    # Transactions - commissions and fees
    for i in range(500):
        date = base_date + timedelta(days=i)
        amount = np.random.normal(3000, 1000)  # Average commission
        category = np.random.choice(['Commission', 'Listing Fee', 'Closing Costs', 'Marketing'], p=[0.7, 0.15, 0.1, 0.05])
        description = f"{category} - {np.random.choice(['Residential', 'Commercial', 'Rental'])}"
        
        transactions.append({
            'Date': date.strftime('%Y-%m-%d'),
            'Description': description,
            'Category': category,
            'Amount': round(amount, 2)
        })
    
    # Campaigns - lead generation
    channels = ['Zillow', 'Realtor.com', 'Facebook', 'Google Ads', 'Referrals']
    
    for i in range(500):
        timestamp = base_date + timedelta(days=i)
        channel = np.random.choice(channels)
        spend = np.random.normal(1500, 500)  # High lead gen spend
        acquisitions = int(np.random.normal(15, 8))  # Lead acquisitions
        
        campaigns.append({
            'Timestamp': timestamp.strftime('%Y-%m-%d'),
            'Campaign_ID': f"RE_{i+1:04d}",
            'Channel': channel,
            'Spend': round(spend, 2),
            'Acquisitions': max(1, acquisitions)
        })
    
    targets = [
        {'Metric_Name': 'Sales_Volume_Target', 'Value': 50000000},
        {'Metric_Name': 'Commission_Rate_Target', 'Value': 6},
        {'Metric_Name': 'Lead_Conversion_Target', 'Value': 20},
        {'Metric_Name': 'Days_On_Market_Target', 'Value': 30}
    ]
    
    return {
        'Transactions': pd.DataFrame(transactions),
        'Campaign_Data': pd.DataFrame(campaigns),
        'Targets': pd.DataFrame(targets)
    }

def create_foodbeverage_dataset():
    """Food & beverage company with retail and wholesale sales"""
    transactions = []
    campaigns = []
    base_date = datetime.now() - timedelta(days=365)
    
    # Transactions - sales and costs
    for i in range(500):
        date = base_date + timedelta(days=i)
        amount = np.random.normal(200, 80)  # Average order value
        category = np.random.choice(['Sales', 'Ingredients', 'Labor', 'Packaging'], p=[0.5, 0.25, 0.15, 0.1])
        description = f"{category} - {np.random.choice(['Retail', 'Wholesale', 'Online'])}"
        
        transactions.append({
            'Date': date.strftime('%Y-%m-%d'),
            'Description': description,
            'Category': category,
            'Amount': round(amount, 2)
        })
    
    # Campaigns - brand awareness
    channels = ['Social Media', 'Influencers', 'TV Ads', 'Print', 'Events']
    
    for i in range(500):
        timestamp = base_date + timedelta(days=i)
        channel = np.random.choice(channels)
        spend = np.random.normal(2000, 800)  # Brand marketing spend
        acquisitions = int(np.random.normal(100, 30))  # Customer acquisitions
        
        campaigns.append({
            'Timestamp': timestamp.strftime('%Y-%m-%d'),
            'Campaign_ID': f"FB_{i+1:04d}",
            'Channel': channel,
            'Spend': round(spend, 2),
            'Acquisitions': max(1, acquisitions)
        })
    
    targets = [
        {'Metric_Name': 'Sales_Volume_Target', 'Value': 1000000},
        {'Metric_Name': 'Gross_Margin_Target', 'Value': 40},
        {'Metric_Name': 'Brand_Awareness_Target', 'Value': 80},
        {'Metric_Name': 'Customer_Retention_Target', 'Value': 70}
    ]
    
    return {
        'Transactions': pd.DataFrame(transactions),
        'Campaign_Data': pd.DataFrame(campaigns),
        'Targets': pd.DataFrame(targets)
    }

def create_techservices_dataset():
    """Technology services company with project-based revenue"""
    transactions = []
    campaigns = []
    base_date = datetime.now() - timedelta(days=365)
    
    # Transactions - service revenue
    for i in range(500):
        date = base_date + timedelta(days=i)
        amount = np.random.normal(2500, 800)  # Average project value
        category = np.random.choice(['Development', 'Consulting', 'Support', 'Licensing'], p=[0.5, 0.3, 0.15, 0.05])
        description = f"{category} - {np.random.choice(['Web App', 'Mobile App', 'API', 'Integration'])}"
        
        transactions.append({
            'Date': date.strftime('%Y-%m-%d'),
            'Description': description,
            'Category': category,
            'Amount': round(amount, 2)
        })
    
    # Campaigns - B2B tech services
    channels = ['LinkedIn', 'Tech Conferences', 'Content Marketing', 'Google Ads', 'Partnerships']
    
    for i in range(500):
        timestamp = base_date + timedelta(days=i)
        channel = np.random.choice(channels)
        spend = np.random.normal(1200, 400)  # B2B marketing spend
        acquisitions = int(np.random.normal(25, 10))  # Client acquisitions
        
        campaigns.append({
            'Timestamp': timestamp.strftime('%Y-%m-%d'),
            'Campaign_ID': f"TECH_{i+1:04d}",
            'Channel': channel,
            'Spend': round(spend, 2),
            'Acquisitions': max(1, acquisitions)
        })
    
    targets = [
        {'Metric_Name': 'Project_Revenue_Target', 'Value': 1500000},
        {'Metric_Name': 'Client_Satisfaction_Target', 'Value': 95},
        {'Metric_Name': 'Project_Delivery_Target', 'Value': 90},
        {'Metric_Name': 'Technical_Debt_Target', 'Value': 10}
    ]
    
    return {
        'Transactions': pd.DataFrame(transactions),
        'Campaign_Data': pd.DataFrame(campaigns),
        'Targets': pd.DataFrame(targets)
    }

def create_financial_dataset():
    """Financial services company with investment and advisory revenue"""
    transactions = []
    campaigns = []
    base_date = datetime.now() - timedelta(days=365)
    
    # Transactions - financial services
    for i in range(500):
        date = base_date + timedelta(days=i)
        amount = np.random.normal(5000, 2000)  # High-value financial transactions
        category = np.random.choice(['Advisory Fees', 'Investment Returns', 'Commissions', 'Management Fees'], p=[0.4, 0.3, 0.2, 0.1])
        description = f"{category} - {np.random.choice(['Portfolio Management', 'Financial Planning', 'Investment Advisory'])}"
        
        transactions.append({
            'Date': date.strftime('%Y-%m-%d'),
            'Description': description,
            'Category': category,
            'Amount': round(amount, 2)
        })
    
    # Campaigns - high-net-worth client acquisition
    channels = ['Referrals', 'Wealth Management Events', 'Private Banking', 'Online Ads', 'Partnerships']
    
    for i in range(500):
        timestamp = base_date + timedelta(days=i)
        channel = np.random.choice(channels)
        spend = np.random.normal(5000, 2000)  # High-end marketing spend
        acquisitions = int(np.random.normal(8, 4))  # Very low volume, very high value
        
        campaigns.append({
            'Timestamp': timestamp.strftime('%Y-%m-%d'),
            'Campaign_ID': f"FIN_{i+1:04d}",
            'Channel': channel,
            'Spend': round(spend, 2),
            'Acquisitions': max(1, acquisitions)
        })
    
    targets = [
        {'Metric_Name': 'AUM_Target', 'Value': 100000000},
        {'Metric_Name': 'Client_AUM_Target', 'Value': 1000000},
        {'Metric_Name': 'ROI_Target', 'Value': 12},
        {'Metric_Name': 'Client_Retention_Target', 'Value': 95}
    ]
    
    return {
        'Transactions': pd.DataFrame(transactions),
        'Campaign_Data': pd.DataFrame(campaigns),
        'Targets': pd.DataFrame(targets)
    }

def create_edtech_dataset():
    """Education technology company with subscription and course revenue"""
    transactions = []
    campaigns = []
    base_date = datetime.now() - timedelta(days=365)
    
    # Transactions - education revenue
    for i in range(500):
        date = base_date + timedelta(days=i)
        amount = np.random.normal(150, 50)  # Average course/subscription value
        category = np.random.choice(['Course Sales', 'Subscriptions', 'Certifications', 'Licensing'], p=[0.5, 0.3, 0.15, 0.05])
        description = f"{category} - {np.random.choice(['Online Course', 'Live Training', 'Certification Program'])}"
        
        transactions.append({
            'Date': date.strftime('%Y-%m-%d'),
            'Description': description,
            'Category': category,
            'Amount': round(amount, 2)
        })
    
    # Campaigns - student acquisition
    channels = ['Google Ads', 'Facebook', 'LinkedIn', 'Content Marketing', 'Webinars']
    
    for i in range(500):
        timestamp = base_date + timedelta(days=i)
        channel = np.random.choice(channels)
        spend = np.random.normal(800, 300)  # Education marketing spend
        acquisitions = int(np.random.normal(40, 15))  # Student acquisitions
        
        campaigns.append({
            'Timestamp': timestamp.strftime('%Y-%m-%d'),
            'Campaign_ID': f"EDU_{i+1:04d}",
            'Channel': channel,
            'Spend': round(spend, 2),
            'Acquisitions': max(1, acquisitions)
        })
    
    targets = [
        {'Metric_Name': 'Student_Enrollment_Target', 'Value': 10000},
        {'Metric_Name': 'Course_Completion_Target', 'Value': 80},
        {'Metric_Name': 'Student_Satisfaction_Target', 'Value': 90},
        {'Metric_Name': 'Revenue_Per_Student_Target', 'Value': 200}
    ]
    
    return {
        'Transactions': pd.DataFrame(transactions),
        'Campaign_Data': pd.DataFrame(campaigns),
        'Targets': pd.DataFrame(targets)
    }

if __name__ == "__main__":
    # Create all datasets
    datasets = create_perfect_datasets()
    
    # Save each dataset
    for filename, data in datasets:
        with pd.ExcelWriter(filename, engine='openpyxl') as writer:
            data['Transactions'].to_excel(writer, sheet_name='Transactions', index=False)
            data['Campaign_Data'].to_excel(writer, sheet_name='Campaign_Data', index=False)
            data['Targets'].to_excel(writer, sheet_name='Targets', index=False)
        
        print(f"Created {filename} with {len(data['Transactions'])} transactions, {len(data['Campaign_Data'])} campaigns, and {len(data['Targets'])} targets")
    
    print(f"\n✅ Created {len(datasets)} perfect datasets with 500 entries each!")
    print("Each dataset is optimized for analytics graphs and KPI calculations.")
