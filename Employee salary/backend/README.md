# Employee Salary Analysis Dashboard - R Plumber Backend

This is a REST API backend built in R using the **Plumber** library to serve aggregated data for the Employee Salary Analysis Dashboard.

## Project Structure
- `data_manager.R`: Handles data loading and caching from `dataset/employee_salary_cleaned.csv`.
- `api.R`: Defines the Plumber endpoints (`/dashboard`, `/departments`, `/experience`, `/gender`, and `/employees`) along with a CORS security filter.
- `run.R`: Entrypoint script to boot up the Plumber server.

## Installation Requirements
To run this server locally, you must have **R** installed. Follow these steps to set up packages:

1. Open your R terminal / RStudio.
2. Install the `plumber` library (which will also install base dependencies like `jsonlite`):
   ```R
   install.packages("plumber")
   ```

## Running the API Server
Run the startup script from your terminal:

```bash
Rscript run.R
```

The server will initialize on port **8000** and expose the following endpoints:
* **Dashboard Summary:** `GET http://localhost:8000/dashboard`
* **Department-wise Average Salary:** `GET http://localhost:8000/departments`
* **Experience-based Salaries:** `GET http://localhost:8000/experience`
* **Gender Salary Breakdown:** `GET http://localhost:8000/gender`
* **Full Employee Details:** `GET http://localhost:8000/employees`
