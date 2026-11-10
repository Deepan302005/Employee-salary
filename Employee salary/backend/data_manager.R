# data_manager.R
# Manages loading and caching of the employee salary dataset

# Global variable to cache the loaded data
.cached_data <- NULL

#' Load and return the cleaned employee salary dataset
#'
#' @return A data frame containing employee salary details
get_data <- function() {
  if (is.null(.cached_data)) {
    # Search for the cleaned dataset in multiple possible relative paths
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
      stop("Error: Cleaned dataset 'employee_salary_cleaned.csv' not found in any of the expected paths.")
    }
    
    # Load dataset using base R to minimize dependency overhead
    .cached_data <<- read.csv(selected_path, stringsAsFactors = FALSE)
    message(paste("Successfully loaded dataset from:", selected_path, "with", nrow(.cached_data), "rows."))
  }
  
  return(.cached_data)
}
