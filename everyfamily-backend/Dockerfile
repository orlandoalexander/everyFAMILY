# Use lightweight Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code and database
COPY . .

# Expose port
ENV PORT 8080

# Ensure /tmp exists for demo DB copies
RUN mkdir -p /tmp

# Use gunicorn to run Flask app
CMD ["gunicorn", "-b", "0.0.0.0:8080", "main:app"]