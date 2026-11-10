# EMPLOYEE SALARY ANALYSIS AND VISUALIZATION REPORT

**Project Title:** Comprehensive Employee Salary Analysis and Compensation Analytics System  
**Implementation Language:** R (Version 4.6.1) with Plumber API & ggplot2  
**Dataset:** IBM HR Employee Attrition & Salary Dataset (1,470 Records)  
**Date:** September 29, 2026  

---

## TABLE OF CONTENTS

| Chapter No. | Title | Page No. |
| :--- | :--- | :--- |
| **1** | Introduction | 3 |
| **2** | Problem Statement | 4 |
| **3** | Objectives | 5 |
| **4** | Scope of the Project | 6 |
| **5** | Literature Review | 7 |
| **6** | System Requirements | 8 |
| **7** | Dataset Description | 9 |
| **8** | Methodology | 11 |
| **9** | Data Preprocessing | 12 |
| **10** | Exploratory Data Analysis | 14 |
| **11** | Data Visualization | 17 |
| **12** | Implementation Using R | 22 |
| **13** | Results and Discussion | 26 |
| **14** | Conclusion | 29 |
| **15** | Future Enhancement | 30 |
| **16** | References | 31 |
| **17** | Appendix | 32 |

---

## CHAPTER 1: INTRODUCTION

### 1.1 Overview
In modern enterprise management, compensation structure and employee salary distribution serve as foundational drivers for talent acquisition, retention, and operational productivity. Human Resource Analytics (HR Analytics) leverages empirical data, statistical modeling, and visualization techniques to evaluate payroll equity, identify systemic compensation gaps, and align remuneration strategies with organizational objectives.

This report presents a thorough data-driven investigation into employee compensation dynamics using a structured dataset containing 1,470 employee records across diverse functional departments (Sales, Research & Development, and Human Resources). By utilizing the R programming environment alongside interactive dashboard services, this project transforms raw enterprise HR data into actionable strategic insights.

### 1.2 Background & Significance
Compensation is often the single largest operational expenditure for knowledge-driven enterprises. Inequitable or market-misaligned compensation frameworks trigger increased employee turnover, reduced job satisfaction, and lost productivity. Data-driven salary analysis provides HR decision-makers with objective metrics to evaluate:
1. **Tenure and Compensation Elasticity**: How incremental experience impacts monthly income across different job functions.
2. **Departmental Parity**: Whether compensation distributions align with industry benchmarks and internal responsibilities across R&D, Sales, and HR.
3. **Gender Pay Parity**: Diagnostic evaluation of equity in pay structures between male and female workforce members.
4. **Attrition Risk Mitigation**: Understanding the correlation between compensation compression and employee resignation rates.

---

## CHAPTER 2: PROBLEM STATEMENT

### 2.1 Context and Problem Definition
Organizations frequently encounter challenges in maintaining transparent, equitable, and competitive compensation structures. Traditional HR payroll evaluation relies heavily on static spreadsheets and periodic qualitative reviews, which are susceptible to subjective bias, slow response times, and an inability to detect complex multi-variable patterns (e.g., tenure vs. satisfaction vs. performance interaction).

Key challenges addressed by this project include:
1. **Unidentified Wage Skewness**: Compensation datasets often exhibit extreme right-skewness due to executive salaries, causing aggregate metrics like mean salary to misrepresent typical employee earnings.
2. **Compensation-Driven Turnover**: High attrition rates frequently correlate with compensation compression, where junior or mid-level employees feel undercompensated relative to tenure and performance.
3. **Lack of RESTful API Integration**: Enterprise HR dashboards lack lightweight, reproducible analytical microservices capable of serving real-time salary metrics to client-facing web applications.
4. **Opacity in Gender & Role Parity**: Without rigorous statistical breakdown, organizations cannot objectively verify gender pay equity across job roles.

---

## CHAPTER 3: OBJECTIVES

### 3.1 Primary Objective
To design, implement, and deploy a comprehensive R-based Employee Salary Analysis pipeline and RESTful API backend that processes, cleans, analyzes, and visualizes organizational compensation metrics for strategic HR decision-making.

### 3.2 Specific Objectives
1. **Data Cleaning & Harmonization**: Standardize, clean, and validate raw employee compensation datasets, ensuring data integrity across numerical and categorical features.
2. **Exploratory Data Analysis (EDA)**: Perform descriptive statistical calculations (mean, median, standard deviation, interquartile range, skewness) to understand income distributions and variable correlations.
3. **Visual Analytics Engine**: Construct publication-grade visual charts using R’s `ggplot2` package to evaluate income distribution, department pay gaps, tenure progression, job role hierarchies, and attrition impacts.
4. **REST API Microservice**: Develop an automated backend service using R's `plumber` package to expose modular API endpoints (`/dashboard`, `/departments`, `/experience`, `/gender`, `/employees`) for seamless frontend integration.
5. **Insights & Policy Recommendations**: Synthesize empirical findings into actionable compensation policy adjustments aimed at reducing attrition and promoting pay equity.

---

## CHAPTER 4: SCOPE OF THE PROJECT

### 4.1 In Scope
- **Dataset Focus**: Analysis of 1,470 employee records encompassing 12 core attributes: Age, Gender, Department, JobRole, MonthlyIncome, TotalWorkingYears, YearsAtCompany, JobSatisfaction, PerformanceRating, MaritalStatus, and Attrition.
- **Statistical Computation**: Univariate, bivariate, and correlation analysis using base R and `dplyr`.
- **Visualization Suite**: 7 custom visual charts saved in high resolution (300 DPI) for executive reporting.
- **Software Backend**: Production-ready R Plumber API implementation supporting CORS for web dashboard integration.

### 4.2 Out of Scope
- Integration with live legacy payroll databases (e.g., SAP SuccessFactors, Workday API live connectors).
- Real-time tax computation or benefit/bonus structure modeling beyond standard `MonthlyIncome`.
- Predictive machine learning forecasting models (deferred to future enhancements).

---

## CHAPTER 5: LITERATURE REVIEW

### 5.1 Theoretical Framework
Human Capital Theory (Schultz, 1961; Becker, 1964) posits that investments in individual skill, education, and tenure yield higher economic productivity, justifying higher compensation. In workforce modeling, the Mincerian Wage Equation establishes an exponential relationship between cumulative working experience and earnings:

$$\ln(Wage) = \beta_0 + \beta_1 \cdot Experience + \beta_2 \cdot Experience^2 + \epsilon$$

In modern HR analytics, empirical validation of Mincerian relationships allows organizations to benchmark whether salary growth aligns with tenure expectations.

### 5.2 Modern HR Analytics and R Ecosystem
Recent literature highlights the effectiveness of R as an analytical environment for organizational research. Packages such as `ggplot2` (Wickham, 2016) provide grammar-of-graphics capabilities, enabling precise visual communication of multi-dimensional data. Furthermore, microservice architectures built on R's `plumber` framework bridge the gap between statistical computing and modern web frontends (React/Next.js).

---

## CHAPTER 6: SYSTEM REQUIREMENTS

### 6.1 Hardware Requirements
- **Processor**: Intel Core i5 / AMD Ryzen 5 (2.5 GHz or higher)
- **RAM**: 8 GB minimum (16 GB recommended)
- **Storage**: 500 MB free solid-state storage (SSD) for R binaries, packages, images, and datasets.

### 6.2 Software & Environment Requirements
- **Operating System**: Microsoft Windows 10/11 (x64)
- **Programming Language**: R Environment (Version 4.6.1 or later)
- **Core R Packages**:
  - `ggplot2` (v3.4.0+): Advanced visualization engine
  - `dplyr` (v1.1.0+): Data manipulation and aggregation
  - `plumber` (v1.2.0+): REST API implementation
  - `jsonlite` (v1.8.0+): JSON serialization
- **Runtime Tools**: Rscript executable, Node.js (for React dashboard testing)

---

## CHAPTER 7: DATASET DESCRIPTION

The analysis utilizes the cleaned IBM HR Employee Salary dataset stored in `employee_salary_cleaned.csv`. The dataset contains **1,470 observations** and **12 variables** without missing values.

### 7.1 Data Dictionary

| Variable Name | Data Type | Description | Range / Values |
| :--- | :--- | :--- | :--- |
| **EmployeeNumber** | Integer | Unique identifier for each employee | 1 - 2068 |
| **Age** | Integer | Employee age in years | 18 - 60 |
| **Gender** | Character | Binary gender classification | Female, Male |
| **Department** | Character | Functional division within company | Sales, Research & Development, Human Resources |
| **JobRole** | Character | Specific job designation | 9 Unique Roles (e.g., Manager, Research Scientist) |
| **MonthlyIncome** | Integer | Gross monthly compensation in USD | \$1,009 - \$19,999 |
| **TotalWorkingYears** | Integer | Cumulative professional experience | 0 - 40 years |
| **YearsAtCompany** | Integer | Tenure at current organization | 0 - 40 years |
| **JobSatisfaction** | Integer | Self-reported satisfaction rating | 1 (Low) to 4 (Very High) |
| **PerformanceRating** | Integer | Annual performance appraisal score | 3 (Excellent) to 4 (Outstanding) |
| **MaritalStatus** | Character | Civil status | Single, Married, Divorced |
| **Attrition** | Character | Employee attrition status | Yes (Left), No (Retained) |

---

## CHAPTER 8: METHODOLOGY

The project adopts the standard **CRISP-DM** (Cross-Industry Standard Process for Data Mining) methodology, adapted for HR analytics:

```mermaid
flowchart LR
    A[Business Understanding] --> B[Data Understanding]
    B --> C[Data Preprocessing]
    C --> D[Exploratory Analysis]
    D --> E[Visual Analytics R]
    E --> F[API Microservice & Report]
```

1. **Business Understanding**: Define compensation evaluation metrics and key business questions (pay equity, tenure impact, attrition drivers).
2. **Data Understanding & Acquisition**: Load CSV data into R environment, verifying structure and checking for record completeness.
3. **Data Preprocessing**: Type coercion, missing value auditing, summary verification.
4. **Exploratory Data Analysis**: Calculation of central tendency, spread, correlation, and departmental groupings.
5. **Data Visualization**: Rendering high-resolution figures using `ggplot2` script.
6. **Deployment & Integration**: Exposing backend logic via Plumber API.

---

## CHAPTER 9: DATA PREPROCESSING

### 9.1 Data Cleaning Steps
1. **Completeness Check**: Audited raw records for missing or `NA` entries (`sum(is.na(df))` evaluated to 0).
2. **Data Coercion**: Converted string fields (`Gender`, `Department`, `JobRole`, `MaritalStatus`, `Attrition`) into factors and characters as appropriate.
3. **Outlier Identification**: Calculated Interquartile Range (IQR) for `MonthlyIncome`:
   - $Q_1 = \$2,911$
   - $Q_3 = \$8,379$
   - $IQR = Q_3 - Q_1 = \$5,468$
   - Upper Whisker Limit = $Q_3 + 1.5 \times IQR = \$16,581$
   - Outliers above \$16,581 correspond to senior managerial and executive roles (retained as valid compensation data).

---

## CHAPTER 10: EXPLORATORY DATA ANALYSIS (EDA)

### 10.1 Statistical Summary of Key Numerical Features

| Metric | Age | Monthly Income ($) | Total Working Years | Years at Company | Job Satisfaction | Performance Rating |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Min** | 18.00 | 1,009.00 | 0.00 | 0.00 | 1.00 | 3.00 |
| **1st Qu.** | 30.00 | 2,911.00 | 6.00 | 3.00 | 2.00 | 3.00 |
| **Median** | 36.00 | 4,919.00 | 10.00 | 5.00 | 3.00 | 3.00 |
| **Mean** | 36.92 | 6,502.93 | 11.28 | 7.01 | 2.73 | 3.15 |
| **3rd Qu.** | 43.00 | 8,379.00 | 15.00 | 9.00 | 4.00 | 3.00 |
| **Max** | 60.00 | 19,999.00 | 40.00 | 40.00 | 4.00 | 4.00 |
| **Std Dev**| 9.14 | 4,707.96 | 7.78 | 6.13 | 1.10 | 0.36 |

### 10.2 Departmental Breakdown

| Department | Employee Count | Mean Monthly Income ($) | Median Monthly Income ($) | Std Dev ($) |
| :--- | :--- | :--- | :--- | :--- |
| **Human Resources** | 63 | 6,654.51 | 3,886.00 | 5,708.53 |
| **Research & Development** | 961 | 6,281.25 | 4,374.00 | 4,502.48 |
| **Sales** | 446 | 6,959.17 | 5,754.50 | 5,056.88 |

---

## CHAPTER 11: DATA VISUALIZATION

### Figure 1: Monthly Income Distribution
The histogram and kernel density estimation (KDE) plot illustrate a distinct right-skewed distribution. The mean monthly income (\$6,503) exceeds the median (\$4,919) by **\$1,584**, reflecting the concentration of high-earning management personnel.

![Figure 1: Distribution of Monthly Income](report_images/fig1_monthly_income_distribution.png)

---

### Figure 2: Department-wise Monthly Income Comparison
Boxplot analysis demonstrates compensation variance across divisions. While Sales features the highest mean salary (\$6,959), R&D exhibits a large cluster of executive outliers reaching the dataset maximum (\$19,999).

![Figure 2: Monthly Income Distribution by Department](report_images/fig2_department_salary.png)

---

### Figure 3: Total Working Years vs. Monthly Income
A scatter plot with fitted linear regression reveals a strong positive correlation ($r = 0.77$) between total experience and salary. Income growth accelerates significantly after 10–12 years of professional experience.

![Figure 3: Total Working Years vs. Monthly Income](report_images/fig3_experience_vs_salary.png)

---

### Figure 4: Average Monthly Income by Job Role
Horizontal bar chart ranking compensation by job title. Managers (\$17,181) and Research Directors (\$16,034) earn more than three times the average salary of Sales Representatives (\$2,626) and Laboratory Technicians (\$3,237).

![Figure 4: Average Monthly Income by Job Role](report_images/fig4_job_role_salary.png)

---

### Figure 5: Gender Salary Comparison Across Departments
Bar chart comparing average monthly income by gender across the three departments. The analysis reveals relative gender parity, with females averaging higher income in HR (\$7,241 vs \$6,195) and R&D (\$6,334 vs \$6,248), while males lead slightly in Sales (\$6,994 vs \$6,913).

![Figure 5: Gender Salary Comparison Across Departments](report_images/fig5_gender_salary_gap.png)

---

### Figure 6: Monthly Income Distribution by Employee Attrition
Boxplot comparing salary distributions between employees retained vs. those who departed. The median salary for employees who left the organization (\$3,202) is markedly lower than retained staff (\$5,204), confirming compensation compression as a major turnover driver.

![Figure 6: Monthly Income Distribution by Employee Attrition](report_images/fig6_attrition_salary.png)

---

### Figure 7: Correlation Matrix Heatmap
Pairwise correlation heatmap highlighting strong relationships between `MonthlyIncome` and `TotalWorkingYears` ($r = 0.77$), `YearsAtCompany` ($r = 0.51$), and `Age` ($r = 0.50$).

![Figure 7: Correlation Matrix Heatmap](report_images/fig7_correlation_heatmap.png)

---

## CHAPTER 12: IMPLEMENTATION USING R

The analytical backend is built in R using modular files: `data_manager.R` for data caching, `api.R` for Plumber routes, and `run.R` for server startup.

### 12.1 Data Management Module (`data_manager.R`)

```r
# data_manager.R - Manages loading and caching of employee dataset
.cached_data <- NULL

get_data <- function() {
  if (is.null(.cached_data)) {
    possible_paths <- c(
      "../dataset/employee_salary_cleaned.csv",
      "dataset/employee_salary_cleaned.csv",
      "./dataset/employee_salary_cleaned.csv",
      "employee_salary_cleaned.csv"
    )
    
    selected_path <- NULL
    for (path in possible_paths) {
      if (file.exists(path)) {
        selected_path <- path
        break
      }
    }
    
    if (is.null(selected_path)) {
      stop("Error: Cleaned dataset 'employee_salary_cleaned.csv' not found.")
    }
    
    .cached_data <<- read.csv(selected_path, stringsAsFactors = FALSE)
  }
  return(.cached_data)
}
```

### 12.2 Plumber REST API Module (`api.R`)

```r
# api.R - REST API endpoints for Employee Salary Analytics
source("data_manager.R")

#* @title Employee Salary Analysis API
#* @filter cors
function(req, res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  res$setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res$setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$status <- 200
    return(list())
  }
  plumber::forward()
}

#* @get /dashboard
#* @serializer json
function() {
  data <- get_data()
  list(
    total_employees = nrow(data),
    average_salary = round(mean(data$MonthlyIncome), 2),
    highest_salary = max(data$MonthlyIncome),
    lowest_salary = min(data$MonthlyIncome)
  )
}

#* @get /departments
#* @serializer json
function() {
  data <- get_data()
  agg <- aggregate(MonthlyIncome ~ Department, data = data, FUN = function(x) {
    c(AverageSalary = round(mean(x), 2), Count = length(x))
  })
  data.frame(
    Department = agg$Department,
    AverageSalary = agg$MonthlyIncome[, "AverageSalary"],
    Count = agg$MonthlyIncome[, "Count"]
  )
}
```

### 12.3 API Server Launcher (`run.R`)

```r
# run.R - Plumber Server Initialization
library(plumber)

pr_path <- "api.R"
if (!file.exists(pr_path)) pr_path <- "backend/api.R"

pr <- plumber::pr(pr_path)
message("Starting Employee Salary Analysis API on port 8000...")
pr$run(host = "0.0.0.0", port = 8000)
```

---

## CHAPTER 13: RESULTS AND DISCUSSION

### 13.1 Key Empirical Findings
1. **Experience Elasticity**: Compensation is strongly tenure-driven ($r = 0.77$). Salary remains relatively flat during the first 5 years (\$2,500 - \$4,500/month), after which executive tier advancement creates rapid salary acceleration.
2. **Role Hierarchy Disparities**: Executive roles (Manager, Research Director) command an average salary of **\$16,500+**, whereas entry-level technical roles (Lab Technician, Research Scientist) average **\$3,200 - \$4,500**.
3. **Turnover & Compensation Compression**: Employees who left the company earned a median salary **38.4% lower** than retained staff. Attrition is heavily concentrated among junior roles earning under \$4,000/month.
4. **Gender Parity Status**: Overall female average monthly salary (\$6,686) is comparable to male average salary (\$6,380), indicating balanced compensation policies across organizational levels.

### 13.2 Strategic Recommendations for HR Management
- **Mid-Tier Compensation Benchmarking**: Adjust compensation curves for 3–7 year tenure employees to prevent premature attrition of skilled talent.
- **Entry-Level Incentive Programs**: Introduce performance-linked bonuses for Laboratory Technicians and Sales Representatives to offset low base pay.
- **Automated Salary Auditing**: Continuously deploy the R Plumber API microservice to monitor real-time compensation metrics across newly hired cohorts.

---

## CHAPTER 14: CONCLUSION

This project successfully implemented an end-to-end analytical solution for employee salary analysis using R. Through rigorous data preprocessing, statistical evaluation, high-impact ggplot2 visualizations, and RESTful API deployment, the system delivers valuable insights into salary distribution, departmental equity, tenure dynamics, and attrition risks.

The empirical findings confirm that compensation compression is a major catalyst for workforce attrition, while gender equity is well-maintained within the studied organization. Deploying R Plumber as a backend microservice provides enterprise HR applications with real-time access to clean, aggregated compensation metrics.

---

## CHAPTER 15: FUTURE ENHANCEMENT

1. **Predictive Machine Learning**: Integrate predictive models (Random Forest, XGBoost) in R (`caret` / `tidymodels`) to predict market-aligned salary ranges based on candidate experience and performance.
2. **Automated Anomaly Detection**: Implement statistical algorithms to detect wage inequities or abnormal salary deviations in real time.
3. **HRIS Integration**: Connect the R Plumber API directly with enterprise platforms such as SAP SuccessFactors, Workday, or Salesforce HR Cloud.
4. **Interactive Web Dashboard**: Expand the frontend React application with interactive filtering (by department, role, tenure slider) and dynamic chart rendering.

---

## CHAPTER 16: REFERENCES

1. Becker, G. S. (1964). *Human Capital: A Theoretical and Empirical Analysis, with Special Reference to Education*. National Bureau of Economic Research.
2. Mincer, J. (1974). *Schooling, Experience, and Earnings*. Human Behavior & Social Institutions No. 2.
3. Wickham, H. (2016). *ggplot2: Elegant Graphics for Data Analysis*. Springer-Verlag New York.
4. Plumber Package Documentation (2024). *An API Generator for R*. RStudio / Posit Technologies. https://www.rplumber.io/
5. R Core Team (2026). *R: A Language and Environment for Statistical Computing*. R Foundation for Statistical Computing, Vienna, Austria.

---

## CHAPTER 17: APPENDIX

### 17.1 REST API Endpoint Summary Table

| Endpoint | HTTP Method | Response Format | Description |
| :--- | :--- | :--- | :--- |
| `/dashboard` | GET | JSON Object | High-level summary metrics (Total, Average, Max, Min Salary) |
| `/departments` | GET | JSON Array | Aggregated average salary and headcount by Department |
| `/experience` | GET | JSON Array | Salary distribution grouped by TotalWorkingYears |
| `/gender` | GET | JSON Array | Average salary and employee count breakdown by Gender |
| `/employees` | GET | JSON Array | Full list of cleaned employee records |

---

*Report compiled and generated automatically by R Analytics Pipeline.*
