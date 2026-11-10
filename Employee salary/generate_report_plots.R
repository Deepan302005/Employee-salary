# Script to generate visualizations for the Employee Salary Analysis Report
library(ggplot2)
library(dplyr)

# Create output directories
dir.create("report_images", showWarnings = FALSE, recursive = TRUE)

df <- read.csv("employee_salary_cleaned.csv", stringsAsFactors = FALSE)

# Theme setup for modern aesthetic
theme_custom <- theme_minimal(base_size = 12) +
  theme(
    plot.title = element_text(face = "bold", size = 14, color = "#1e293b", hjust = 0.5),
    plot.subtitle = element_text(size = 10, color = "#64748b", hjust = 0.5),
    axis.title = element_text(face = "bold", size = 11, color = "#334155"),
    axis.text = element_text(size = 10, color = "#475569"),
    panel.grid.minor = element_blank(),
    panel.grid.major = element_line(color = "#e2e8f0"),
    plot.background = element_rect(fill = "#ffffff", color = NA),
    panel.background = element_rect(fill = "#f8fafc", color = NA),
    legend.position = "bottom",
    legend.title = element_text(face = "bold", size = 10)
  )

# Figure 1: Monthly Income Distribution
p1 <- ggplot(df, aes(x = MonthlyIncome)) +
  geom_histogram(aes(y = ..density..), binwidth = 1000, fill = "#3b82f6", color = "#1d4ed8", alpha = 0.7) +
  geom_density(color = "#ef4444", linewidth = 1.2) +
  geom_vline(aes(xintercept = mean(MonthlyIncome)), color = "#15803d", linetype = "dashed", linewidth = 1.1) +
  geom_vline(aes(xintercept = median(MonthlyIncome)), color = "#b91c1c", linetype = "dotted", linewidth = 1.1) +
  annotate("text", x = mean(df$MonthlyIncome) + 2500, y = 0.00012, label = paste("Mean: $", round(mean(df$MonthlyIncome), 2)), color = "#15803d", fontface = "bold") +
  annotate("text", x = median(df$MonthlyIncome) - 2200, y = 0.00010, label = paste("Median: $", median(df$MonthlyIncome)), color = "#b91c1c", fontface = "bold") +
  labs(title = "Figure 1: Distribution of Monthly Income",
       subtitle = "Right-skewed income distribution (Mean = $6,503, Median = $4,919)",
       x = "Monthly Income ($)", y = "Density") +
  theme_custom

ggsave("report_images/fig1_monthly_income_distribution.png", p1, width = 8, height = 5, dpi = 300)

# Figure 2: Department-wise Salary Boxplot & Mean
p2 <- ggplot(df, aes(x = Department, y = MonthlyIncome, fill = Department)) +
  geom_boxplot(alpha = 0.7, outlier.color = "#ef4444", outlier.shape = 16) +
  stat_summary(fun = mean, geom = "point", shape = 18, size = 4, color = "#1e1b4b") +
  scale_fill_manual(values = c("Human Resources" = "#a855f7", "Research & Development" = "#06b6d4", "Sales" = "#f59e0b")) +
  labs(title = "Figure 2: Monthly Income Distribution by Department",
       subtitle = "Black diamond indicates department mean salary",
       x = "Department", y = "Monthly Income ($)") +
  theme_custom +
  theme(legend.position = "none")

ggsave("report_images/fig2_department_salary.png", p2, width = 8, height = 5, dpi = 300)

# Figure 3: Total Working Years vs Monthly Income
p3 <- ggplot(df, aes(x = TotalWorkingYears, y = MonthlyIncome, color = Department)) +
  geom_point(alpha = 0.5, size = 2) +
  geom_smooth(method = "lm", color = "#0f172a", linewidth = 1.2, se = TRUE) +
  scale_color_manual(values = c("Human Resources" = "#8b5cf6", "Research & Development" = "#0284c7", "Sales" = "#d97706")) +
  labs(title = "Figure 3: Total Working Years vs. Monthly Income",
       subtitle = "Strong positive linear relationship between tenure and compensation (r ≈ 0.77)",
       x = "Total Working Years", y = "Monthly Income ($)") +
  theme_custom

ggsave("report_images/fig3_experience_vs_salary.png", p3, width = 8, height = 5, dpi = 300)

# Figure 4: Average Salary by Job Role
role_avg <- df %>%
  group_by(JobRole) %>%
  summarise(AvgSalary = mean(MonthlyIncome), Count = n()) %>%
  arrange(AvgSalary)

p4 <- ggplot(role_avg, aes(x = reorder(JobRole, AvgSalary), y = AvgSalary, fill = AvgSalary)) +
  geom_bar(stat = "identity", width = 0.7) +
  geom_text(aes(label = paste0("$", round(AvgSalary))), hjust = -0.1, size = 3.5, fontface = "bold", color = "#1e293b") +
  scale_fill_gradient(low = "#93c5fd", high = "#1e3a8a") +
  coord_flip() +
  scale_y_continuous(limits = c(0, 22000)) +
  labs(title = "Figure 4: Average Monthly Income by Job Role",
       subtitle = "Managerial positions command significantly higher compensation",
       x = "Job Role", y = "Average Monthly Income ($)") +
  theme_custom +
  theme(legend.position = "none")

ggsave("report_images/fig4_job_role_salary.png", p4, width = 9, height = 5.5, dpi = 300)

# Figure 5: Gender-wise Salary Comparison across Departments
gender_dept <- df %>%
  group_by(Department, Gender) %>%
  summarise(AvgSalary = round(mean(MonthlyIncome), 2), .groups = "drop")

p5 <- ggplot(gender_dept, aes(x = Department, y = AvgSalary, fill = Gender)) +
  geom_bar(stat = "identity", position = position_dodge(width = 0.7), width = 0.6) +
  geom_text(aes(label = paste0("$", round(AvgSalary))), position = position_dodge(width = 0.7), vjust = -0.4, size = 3.5, fontface = "bold") +
  scale_fill_manual(values = c("Female" = "#ec4899", "Male" = "#3b82f6")) +
  scale_y_continuous(limits = c(0, 8500)) +
  labs(title = "Figure 5: Gender Salary Comparison Across Departments",
       subtitle = "Average monthly income by gender and operational division",
       x = "Department", y = "Average Monthly Income ($)") +
  theme_custom

ggsave("report_images/fig5_gender_salary_gap.png", p5, width = 8, height = 5, dpi = 300)

# Figure 6: Monthly Income vs Attrition
p6 <- ggplot(df, aes(x = Attrition, y = MonthlyIncome, fill = Attrition)) +
  geom_boxplot(alpha = 0.7, width = 0.5) +
  scale_fill_manual(values = c("No" = "#10b981", "Yes" = "#f43f5e")) +
  labs(title = "Figure 6: Monthly Income Distribution by Employee Attrition",
       subtitle = "Employees who left the company (Yes) had noticeably lower median income",
       x = "Attrition Status", y = "Monthly Income ($)") +
  theme_custom +
  theme(legend.position = "none")

ggsave("report_images/fig6_attrition_salary.png", p6, width = 7, height = 5, dpi = 300)

# Figure 7: Correlation Heatmap of Numeric Features
num_vars <- df[, c("Age", "MonthlyIncome", "TotalWorkingYears", "YearsAtCompany", "JobSatisfaction", "PerformanceRating")]
cor_matrix <- cor(num_vars, use = "complete.obs")
cor_df <- expand.grid(Var1 = colnames(cor_matrix), Var2 = colnames(cor_matrix))
cor_df$value <- as.vector(cor_matrix)

p7 <- ggplot(cor_df, aes(x = Var1, y = Var2, fill = value)) +
  geom_tile(color = "white") +
  geom_text(aes(label = round(value, 2)), color = ifelse(abs(cor_df$value) > 0.5, "white", "black"), size = 3.5, fontface = "bold") +
  scale_fill_gradient2(low = "#ef4444", mid = "#ffffff", high = "#2563eb", midpoint = 0, limit = c(-1, 1)) +
  labs(title = "Figure 7: Correlation Matrix Heatmap of Key Numerical Variables",
       subtitle = "Pairwise Pearson correlation values",
       x = "", y = "") +
  theme_custom +
  theme(axis.text.x = element_text(angle = 45, hjust = 1))

ggsave("report_images/fig7_correlation_heatmap.png", p7, width = 8, height = 6, dpi = 300)

cat("All 7 plots generated successfully in report_images/\n")
