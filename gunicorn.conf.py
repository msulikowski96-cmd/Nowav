
import os

# Bind to all interfaces and use PORT from environment
bind = f"0.0.0.0:{os.environ.get('PORT', 5000)}"

# Worker configuration for Render
workers = 2
worker_class = "sync"
worker_connections = 1000
timeout = 120
keepalive = 2

# Security and performance
max_requests = 1000
max_requests_jitter = 50
preload_app = True

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

# Process naming
proc_name = "cv-optimizer-pro"

# Memory management
worker_tmp_dir = "/dev/shm"
