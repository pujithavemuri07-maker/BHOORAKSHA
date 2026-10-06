import os
import sys
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

FRONTEND_SERVICES = {
    8080: "landing-page/dist",
    3000: "citizen-service/dist",
    3001: "deo-service/dist",
    3002: "verifier-service/dist",
    3003: "legal-service/dist",
    3004: "gis-service/dist",
    3005: "revenue-admin-service/dist",
    3006: "system-admin-service/dist",
}

class SPARequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, directory=None, **kwargs):
        super().__init__(*args, directory=directory, **kwargs)

    def do_GET(self):
        # Resolve file path
        path = self.translate_path(self.path)
        if not os.path.exists(path) or os.path.isdir(path) and not os.path.exists(os.path.join(path, "index.html")):
            # Fallback to index.html for SPA routing
            self.path = "/index.html"
        return super().do_GET()

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        super().end_headers()

    def log_message(self, format, *args):
        # Suppress verbose access logs
        pass

def start_server(port, folder):
    root_dir = os.path.abspath(os.path.dirname(__file__))
    dist_dir = os.path.join(root_dir, folder)
    
    handler = lambda *args, **kwargs: SPARequestHandler(*args, directory=dist_dir, **kwargs)
    try:
        httpd = ThreadingHTTPServer(("0.0.0.0", port), handler)
        print(f"[ONLINE] Port {port} -> serving {folder}")
        httpd.serve_forever()
    except Exception as e:
        print(f"[ERROR] Port {port}: {e}")

if __name__ == "__main__":
    print("==================================================")
    print("Starting All Bhooraksha Web Frontends...")
    print("==================================================")
    threads = []
    for port, folder in FRONTEND_SERVICES.items():
        t = threading.Thread(target=start_server, args=(port, folder), daemon=True)
        t.start()
        threads.append(t)

    print("All frontend servers started in background threads.")
    # Keep main thread alive
    try:
        while True:
            import time
            time.sleep(1)
    except KeyboardInterrupt:
        print("Shutting down.")
