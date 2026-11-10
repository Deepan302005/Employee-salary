# run.R
# Main server runner for the R Plumber Backend

library(plumber)

# Set working directory to the directory of this script if possible
# (This ensures relative paths to data_manager.R work correctly)
tryCatch({
  initial_wd <- getwd()
  script_dir <- dirname(sys.frame(1)$ofile)
  setwd(script_dir)
  message(paste("Working directory set to backend folder:", script_dir))
}, error = function(e) {
  # Fallback to current working directory
  message("Using current working directory: ", getwd())
})

# Get host and port from environment or set defaults
host <- Sys.getenv("API_HOST", "0.0.0.0")
port <- as.numeric(Sys.getenv("API_PORT", 8000))

message(sprintf("Starting Plumber API Server on host %s:%d...", host, port))
message("API endpoints available:")
message(" - GET http://localhost:8000/dashboard")
message(" - GET http://localhost:8000/departments")
message(" - GET http://localhost:8000/experience")
message(" - GET http://localhost:8000/gender")
message(" - GET http://localhost:8000/employees")

# Initialize and run server with dual-compatibility mode
if (exists("pr")) {
  # Plumber version >= 1.0.0 (uses modern pr() & piping)
  message("Using modern Plumber interface...")
  pr_router <- pr("api.R")
  pr_router %>% pr_run(host = host, port = port)
} else {
  # Plumber version < 1.0.0 (uses legacy plumb())
  message("Using legacy Plumber interface...")
  pr_router <- plumb("api.R")
  pr_router$run(host = host, port = port)
}
