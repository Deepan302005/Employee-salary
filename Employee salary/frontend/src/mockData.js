// mockData.js
// Mock data mimicking the preprocessed dataset and R Plumber responses

export const mockDashboardData = {
  totalEmployees: 1470,
  avgSalary: 6502.93,
  highestSalary: 19999,
  lowestSalary: 1009
};

export const mockDepartmentData = [
  { Department: 'Human Resources', AverageSalary: 6654.51, Count: 63 },
  { Department: 'Research & Development', AverageSalary: 6281.25, Count: 961 },
  { Department: 'Sales', AverageSalary: 6959.17, Count: 446 }
];

export const mockGenderData = [
  { Gender: 'Female', AverageSalary: 6686.57, Count: 588 },
  { Gender: 'Male', AverageSalary: 6380.51, Count: 882 }
];

export const mockExperienceData = [
  { TotalWorkingYears: 0, AverageSalary: 3829.00, Count: 11 },
  { TotalWorkingYears: 1, AverageSalary: 2984.81, Count: 81 },
  { TotalWorkingYears: 3, AverageSalary: 3505.20, Count: 42 },
  { TotalWorkingYears: 5, AverageSalary: 4246.30, Count: 110 },
  { TotalWorkingYears: 8, AverageSalary: 5894.20, Count: 103 },
  { TotalWorkingYears: 10, AverageSalary: 6951.10, Count: 202 },
  { TotalWorkingYears: 15, AverageSalary: 9815.30, Count: 48 },
  { TotalWorkingYears: 20, AverageSalary: 13540.90, Count: 30 },
  { TotalWorkingYears: 25, AverageSalary: 15890.00, Count: 15 },
  { TotalWorkingYears: 30, AverageSalary: 18020.10, Count: 10 },
  { TotalWorkingYears: 35, AverageSalary: 19120.40, Count: 6 },
  { TotalWorkingYears: 40, AverageSalary: 19990.00, Count: 2 }
];

export const mockEmployees = [
  {
    EmployeeNumber: 1,
    Age: 41,
    Gender: 'Female',
    Department: 'Sales',
    JobRole: 'Sales Executive',
    MonthlyIncome: 5993,
    TotalWorkingYears: 8,
    YearsAtCompany: 6,
    JobSatisfaction: 4,
    PerformanceRating: 3,
    MaritalStatus: 'Single',
    Attrition: 'Yes'
  },
  {
    EmployeeNumber: 2,
    Age: 49,
    Gender: 'Male',
    Department: 'Research & Development',
    JobRole: 'Research Scientist',
    MonthlyIncome: 5130,
    TotalWorkingYears: 10,
    YearsAtCompany: 10,
    JobSatisfaction: 2,
    PerformanceRating: 4,
    MaritalStatus: 'Married',
    Attrition: 'No'
  },
  {
    EmployeeNumber: 4,
    Age: 37,
    Gender: 'Male',
    Department: 'Research & Development',
    JobRole: 'Laboratory Technician',
    MonthlyIncome: 2090,
    TotalWorkingYears: 7,
    YearsAtCompany: 0,
    JobSatisfaction: 3,
    PerformanceRating: 3,
    MaritalStatus: 'Single',
    Attrition: 'Yes'
  },
  {
    EmployeeNumber: 5,
    Age: 33,
    Gender: 'Female',
    Department: 'Research & Development',
    JobRole: 'Research Scientist',
    MonthlyIncome: 2909,
    TotalWorkingYears: 8,
    YearsAtCompany: 8,
    JobSatisfaction: 3,
    PerformanceRating: 3,
    MaritalStatus: 'Married',
    Attrition: 'No'
  },
  {
    EmployeeNumber: 7,
    Age: 27,
    Gender: 'Male',
    Department: 'Research & Development',
    JobRole: 'Laboratory Technician',
    MonthlyIncome: 3468,
    TotalWorkingYears: 6,
    YearsAtCompany: 2,
    JobSatisfaction: 2,
    PerformanceRating: 3,
    MaritalStatus: 'Married',
    Attrition: 'No'
  },
  {
    EmployeeNumber: 8,
    Age: 32,
    Gender: 'Male',
    Department: 'Research & Development',
    JobRole: 'Laboratory Technician',
    MonthlyIncome: 3068,
    TotalWorkingYears: 8,
    YearsAtCompany: 7,
    JobSatisfaction: 4,
    PerformanceRating: 3,
    MaritalStatus: 'Single',
    Attrition: 'No'
  },
  {
    EmployeeNumber: 10,
    Age: 59,
    Gender: 'Female',
    Department: 'Research & Development',
    JobRole: 'Laboratory Technician',
    MonthlyIncome: 2670,
    TotalWorkingYears: 12,
    YearsAtCompany: 1,
    JobSatisfaction: 1,
    PerformanceRating: 4,
    MaritalStatus: 'Married',
    Attrition: 'No'
  },
  {
    EmployeeNumber: 11,
    Age: 30,
    Gender: 'Male',
    Department: 'Research & Development',
    JobRole: 'Laboratory Technician',
    MonthlyIncome: 2693,
    TotalWorkingYears: 1,
    YearsAtCompany: 1,
    JobSatisfaction: 3,
    PerformanceRating: 4,
    MaritalStatus: 'Divorced',
    Attrition: 'No'
  },
  {
    EmployeeNumber: 12,
    Age: 38,
    Gender: 'Male',
    Department: 'Research & Development',
    JobRole: 'Manufacturing Director',
    MonthlyIncome: 9526,
    TotalWorkingYears: 10,
    YearsAtCompany: 9,
    JobSatisfaction: 3,
    PerformanceRating: 4,
    MaritalStatus: 'Single',
    Attrition: 'No'
  },
  {
    EmployeeNumber: 13,
    Age: 36,
    Gender: 'Male',
    Department: 'Research & Development',
    JobRole: 'Healthcare Representative',
    MonthlyIncome: 5237,
    TotalWorkingYears: 17,
    YearsAtCompany: 7,
    JobSatisfaction: 3,
    PerformanceRating: 3,
    MaritalStatus: 'Married',
    Attrition: 'No'
  },
  {
    EmployeeNumber: 14,
    Age: 35,
    Gender: 'Male',
    Department: 'Research & Development',
    JobRole: 'Laboratory Technician',
    MonthlyIncome: 2426,
    TotalWorkingYears: 6,
    YearsAtCompany: 5,
    JobSatisfaction: 2,
    PerformanceRating: 3,
    MaritalStatus: 'Married',
    Attrition: 'No'
  },
  {
    EmployeeNumber: 15,
    Age: 29,
    Gender: 'Female',
    Department: 'Research & Development',
    JobRole: 'Laboratory Technician',
    MonthlyIncome: 4193,
    TotalWorkingYears: 10,
    YearsAtCompany: 9,
    JobSatisfaction: 3,
    PerformanceRating: 3,
    MaritalStatus: 'Single',
    Attrition: 'No'
  },
  {
    EmployeeNumber: 18,
    Age: 34,
    Gender: 'Male',
    Department: 'Research & Development',
    JobRole: 'Laboratory Technician',
    MonthlyIncome: 2661,
    TotalWorkingYears: 3,
    YearsAtCompany: 2,
    JobSatisfaction: 4,
    PerformanceRating: 3,
    MaritalStatus: 'Divorced',
    Attrition: 'No'
  },
  {
    EmployeeNumber: 23,
    Age: 53,
    Gender: 'Female',
    Department: 'Sales',
    JobRole: 'Manager',
    MonthlyIncome: 15427,
    TotalWorkingYears: 31,
    YearsAtCompany: 25,
    JobSatisfaction: 4,
    PerformanceRating: 3,
    MaritalStatus: 'Married',
    Attrition: 'No'
  },
  {
    EmployeeNumber: 32,
    Age: 53,
    Gender: 'Female',
    Department: 'Research & Development',
    JobRole: 'Manager',
    MonthlyIncome: 19094,
    TotalWorkingYears: 26,
    YearsAtCompany: 14,
    JobSatisfaction: 3,
    PerformanceRating: 3,
    MaritalStatus: 'Divorced',
    Attrition: 'No'
  }
];

export const mockSalaryDistribution = [
  { range: '< $5k', count: 840 },
  { range: '$5k - $10k', count: 380 },
  { range: '$10k - $15k', count: 155 },
  { range: '> $15k', count: 95 }
];

