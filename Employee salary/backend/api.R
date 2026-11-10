# api.R
# R Plumber API definition for the Employee Salary Analysis Dashboard

source("data_manager.R")

# Helper function to filter dataset by department if requested
filter_by_dept <- function(data, department = NULL) {
  if (!is.null(department) && department != "" && department != "All") {
    data <- data[data$Department == department, ]
  }
  return(data)
}

#* @title Employee Salary Analysis API
#* @description REST API backend for summary statistics and insights on employee compensation details.

#* Enable Cross-Origin Resource Sharing (CORS) for local dashboard integrations
#* @filter cors
function(req, res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  res$setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res$setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$status <- 200
    return(list())
  }
  
  plumber::forward()
}

#* Get high-level summary metrics for the dashboard
#* @param department Optional department filter
#* @get /dashboard
#* @serializer json
function(department = NULL) {
  tryCatch({
    data <- filter_by_dept(get_data(), department)
    if (nrow(data) == 0) {
      return(list(
        total_employees = 0,
        average_salary = 0,
        highest_salary = 0,
        lowest_salary = 0
      ))
    }
    list(
      total_employees = nrow(data),
      average_salary = round(mean(data$MonthlyIncome), 2),
      highest_salary = max(data$MonthlyIncome),
      lowest_salary = min(data$MonthlyIncome)
    )
  }, error = function(e) {
    list(error = "Failed to load dashboard metrics", details = e$message)
  })
}

#* Get department-wise average salary and employee count
#* @param department Optional department filter
#* @get /departments
#* @serializer json
function(department = NULL) {
  tryCatch({
    data <- filter_by_dept(get_data(), department)
    if (nrow(data) == 0) {
      return(data.frame(Department = character(), AverageSalary = numeric(), Count = numeric()))
    }
    agg <- aggregate(MonthlyIncome ~ Department, data = data, FUN = function(x) {
      c(AverageSalary = round(mean(x), 2), Count = length(x))
    })
    
    # Flatten the matrix result from aggregate into a structured data frame
    result <- data.frame(
      Department = agg$Department,
      AverageSalary = agg$MonthlyIncome[, "AverageSalary"],
      Count = agg$MonthlyIncome[, "Count"]
    )
    # Sort by Department alphabetically
    result <- result[order(result$Department), ]
    return(result)
  }, error = function(e) {
    list(error = "Failed to aggregate department salaries", details = e$message)
  })
}

#* Get salary distribution and employee counts grouped by TotalWorkingYears
#* @param department Optional department filter
#* @get /experience
#* @serializer json
function(department = NULL) {
  tryCatch({
    data <- filter_by_dept(get_data(), department)
    if (nrow(data) == 0) {
      return(data.frame(TotalWorkingYears = numeric(), AverageSalary = numeric(), Count = numeric()))
    }
    agg <- aggregate(MonthlyIncome ~ TotalWorkingYears, data = data, FUN = function(x) {
      c(AverageSalary = round(mean(x), 2), Count = length(x))
    })
    
    result <- data.frame(
      TotalWorkingYears = agg$TotalWorkingYears,
      AverageSalary = agg$MonthlyIncome[, "AverageSalary"],
      Count = agg$MonthlyIncome[, "Count"]
    )
    # Sort chronologically by experience years
    result <- result[order(result$TotalWorkingYears), ]
    return(result)
  }, error = function(e) {
    list(error = "Failed to aggregate experience salaries", details = e$message)
  })
}

#* Get average salary and counts grouped by Gender
#* @param department Optional department filter
#* @get /gender
#* @serializer json
function(department = NULL) {
  tryCatch({
    data <- filter_by_dept(get_data(), department)
    if (nrow(data) == 0) {
      return(data.frame(Gender = character(), AverageSalary = numeric(), Count = numeric()))
    }
    agg <- aggregate(MonthlyIncome ~ Gender, data = data, FUN = function(x) {
      c(AverageSalary = round(mean(x), 2), Count = length(x))
    })
    
    result <- data.frame(
      Gender = agg$Gender,
      AverageSalary = agg$MonthlyIncome[, "AverageSalary"],
      Count = agg$MonthlyIncome[, "Count"]
    )
    return(result)
  }, error = function(e) {
    list(error = "Failed to aggregate gender salaries", details = e$message)
  })
}

#* Get list of employee records, optionally filtered by department
#* @param department Optional department filter
#* @get /employees
#* @serializer json
function(department = NULL) {
  tryCatch({
    filter_by_dept(get_data(), department)
  }, error = function(e) {
    list(error = "Failed to load employee records", details = e$message)
  })
}
