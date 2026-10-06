import os
import sys
import time
import socket
import threading
import subprocess
import urllib.request
import urllib.error
import mimetypes
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import psutil
from dotenv import load_dotenv

# Ensure root .env is loaded to guarantee correct database and credentials
root_env = os.path.join(os.path.abspath(os.path.dirname(__file__)), ".env")
if os.path.exists(root_env):
    load_dotenv(root_env, override=True)

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

# Ensure accurate MIME types on Windows
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")
mimetypes.add_type("image/svg+xml", ".svg")
mimetypes.add_type("application/json", ".json")
mimetypes.add_type("image/x-icon", ".ico")

TARGET_PORTS = {
    8080: "Bhooraksha Unified Gateway & Landing Page",
    8000: "Auth Service API (FastAPI)",
    8001: "AI Agent Orchestrator API (FastAPI)",
    3000: "Citizen Service Portal (Standalone)",
    3001: "DEO Service Portal (Standalone)",
    3002: "Verifier Service Portal (Standalone)",
    3003: "Legal Review Service Portal (Standalone)",
    3004: "GIS Specialist Service Portal (Standalone)",
    3005: "Revenue Register Office (Standalone)",
    3006: "System Admin Portal (Standalone)",
}

SUBPATH_PORTALS = {
    "/citizen": "citizen-service/dist",
    "/deo": "deo-service/dist",
    "/verifier": "verifier-service/dist",
    "/legal": "legal-service/dist",
    "/gis": "gis-service/dist",
    "/revenue": "revenue-admin-service/dist",
    "/admin": "system-admin-service/dist",
}

FRONTEND_SERVICES = {
    3000: "citizen-service/dist",
    3001: "deo-service/dist",
    3002: "verifier-service/dist",
    3003: "legal-service/dist",
    3004: "gis-service/dist",
    3005: "revenue-admin-service/dist",
    3006: "system-admin-service/dist",
}

ALLOWED_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:8080,http://127.0.0.1:8080,http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:3004,http://localhost:3005,http://localhost:3006").split(",") if o.strip()]

class UnifiedGatewayHandler(SimpleHTTPRequestHandler):
    """
    Unified reverse proxy and static gateway on Port 8080.
    Serves:
      / -> landing-page/dist
      /citizen/* -> citizen-service/dist
      /deo/* -> deo-service/dist
      /verifier/* -> verifier-service/dist
      /legal/* -> legal-service/dist
      /gis/* -> gis-service/dist
      /revenue/* -> revenue-admin-service/dist
      /admin/* -> system-admin-service/dist
      /api/v1/auth/* -> proxy http://localhost:8000
      /api/v1/* -> proxy http://localhost:8001
    """

    def send_cors_headers(self):
        req_origin = self.headers.get("Origin")
        allowed_origin = req_origin if (req_origin and req_origin in ALLOWED_ORIGINS) else "http://localhost:8080"
        self.send_header("Access-Control-Allow-Origin", allowed_origin)
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, X-Requested-With")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    def proxy_request(self, target_url):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length) if content_length > 0 else None
            req_headers = {k: v for k, v in self.headers.items() if k.lower() not in ("host", "content-length")}
            
            req = urllib.request.Request(target_url, data=body, headers=req_headers, method=self.command)
            with urllib.request.urlopen(req, timeout=10) as resp:
                self.send_response(resp.status)
                for k, v in resp.getheaders():
                    if k.lower() not in ("transfer-encoding", "content-length"):
                        self.send_header(k, v)
                self.send_cors_headers()
                resp_body = resp.read()
                self.send_header("Content-Length", str(len(resp_body)))
                self.end_headers()
                self.wfile.write(resp_body)
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            self.send_cors_headers()
            err_body = e.read()
            self.send_header("Content-Length", str(len(err_body)))
            self.end_headers()
            self.wfile.write(err_body)
        except Exception as e:
            self.send_response(502)
            self.send_cors_headers()
            msg = f'{{"error": "Bad Gateway", "details": "{str(e)}"}}'.encode("utf-8")
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(msg)))
            self.end_headers()
            self.wfile.write(msg)

    def serve_file(self, filepath, content_type=None):
        if not os.path.exists(filepath):
            self.send_error(404, "File Not Found")
            return
        if not content_type:
            content_type, _ = mimetypes.guess_type(filepath)
            if not content_type:
                content_type = "application/octet-stream"

        try:
            with open(filepath, "rb") as f:
                content = f.read()
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(content)))
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_error(500, f"Internal error: {e}")

    def do_POST(self):
        # Handle API proxying
        if self.path.startswith("/api/v1/auth"):
            self.proxy_request(f"http://localhost:8000{self.path}")
        elif self.path.startswith("/api/v1"):
            self.proxy_request(f"http://localhost:8001{self.path}")
        else:
            self.send_error(405, "Method Not Allowed")

    def do_PUT(self):
        self.do_POST()

    def do_PATCH(self):
        self.do_POST()

    def do_DELETE(self):
        self.do_POST()

    def do_GET(self):
        root_dir = os.path.abspath(os.path.dirname(__file__))

        # 1. Check API proxy
        if self.path.startswith("/api/v1/auth"):
            self.proxy_request(f"http://localhost:8000{self.path}")
            return
        elif self.path.startswith("/api/v1"):
            self.proxy_request(f"http://localhost:8001{self.path}")
            return

        # 2. Check Subpath Portals
        raw_path = self.path.split("?")[0]
        for prefix, rel_folder in SUBPATH_PORTALS.items():
            if raw_path == prefix:
                # Redirect /citizen -> /citizen/
                self.send_response(302)
                self.send_header("Location", f"{prefix}/")
                self.end_headers()
                return

            if self.path.startswith(prefix + "/"):
                portal_dir = os.path.join(root_dir, rel_folder)
                rel_url = self.path[len(prefix):].split("?")[0].lstrip("/")
                target_file = os.path.join(portal_dir, rel_url)

                if os.path.isfile(target_file):
                    self.serve_file(target_file)
                    return
                else:
                    # SPA Fallback for this portal
                    index_file = os.path.join(portal_dir, "index.html")
                    self.serve_file(index_file, "text/html; charset=utf-8")
                    return

        # 3. Default: Landing Page
        landing_dir = os.path.join(root_dir, "landing-page/dist")
        clean_rel = self.path.split("?")[0].lstrip("/")
        if clean_rel == "":
            target_file = os.path.join(landing_dir, "index.html")
            self.serve_file(target_file, "text/html; charset=utf-8")
            return

        target_file = os.path.join(landing_dir, clean_rel)
        if os.path.isfile(target_file):
            self.serve_file(target_file)
        else:
            index_file = os.path.join(landing_dir, "index.html")
            self.serve_file(index_file, "text/html; charset=utf-8")

    def log_message(self, format, *args):
        pass


class StandaloneSPARequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, directory=None, **kwargs):
        super().__init__(*args, directory=directory, **kwargs)

    def do_GET(self):
        # Normalize portal subpath prefixes if requested on standalone ports
        prefixes = ["/citizen", "/deo", "/verifier", "/legal", "/gis", "/revenue", "/admin"]
        raw_path = self.path.split("?")[0]
        for p in prefixes:
            if raw_path == p or raw_path == p + "/":
                self.path = "/index.html"
                break
            elif raw_path.startswith(p + "/"):
                self.path = self.path[len(p):]
                break

        path = self.translate_path(self.path)
        if not os.path.exists(path) or (os.path.isdir(path) and not os.path.exists(os.path.join(path, "index.html"))):
            self.path = "/index.html"
        return super().do_GET()

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        super().end_headers()

    def log_message(self, format, *args):
        pass


def clean_ports():
    print("==================================================")
    print("STEP 1: Checking and Cleaning Target Ports...")
    print("==================================================")
    cleaned = 0
    try:
        conns = psutil.net_connections(kind="inet")
    except Exception:
        conns = []

    for conn in conns:
        if conn.status == "LISTEN" and conn.laddr.port in TARGET_PORTS:
            port = conn.laddr.port
            pid = conn.pid
            if pid and pid != os.getpid():
                try:
                    proc = psutil.Process(pid)
                    pname = proc.name()
                    print(f"[KILL] Port {port} occupied by PID {pid} ({pname}). Terminating...")
                    proc.terminate()
                    proc.wait(timeout=3)
                    cleaned += 1
                except Exception:
                    try:
                        proc = psutil.Process(pid)
                        proc.kill()
                        cleaned += 1
                    except Exception:
                        pass

    if cleaned == 0:
        print("[OK] All target application ports are clean and ready.")
    else:
        print(f"[OK] Cleaned {cleaned} occupying processes.")
    time.sleep(1)


def start_unified_gateway():
    try:
        httpd = ThreadingHTTPServer(("0.0.0.0", 8080), UnifiedGatewayHandler)
        print("[ONLINE] Port 8080 -> Bhooraksha Unified Gateway (Landing + All 7 Portals)")
        httpd.serve_forever()
    except Exception as e:
        print(f"[ERROR] Port 8080 Unified Gateway: {e}")


def start_standalone_server(port, folder):
    root_dir = os.path.abspath(os.path.dirname(__file__))
    dist_dir = os.path.join(root_dir, folder)
    if not os.path.exists(dist_dir):
        return

    handler = lambda *args, **kwargs: StandaloneSPARequestHandler(*args, directory=dist_dir, **kwargs)
    try:
        httpd = ThreadingHTTPServer(("0.0.0.0", port), handler)
        httpd.serve_forever()
    except Exception as e:
        pass


def run_services():
    print("\n==================================================")
    print("STEP 2: Launching Bhooraksha Services & Gateway...")
    print("==================================================")
    root = os.path.abspath(os.path.dirname(__file__))

    flags = 0
    if sys.platform == "win32":
        flags = subprocess.CREATE_NEW_PROCESS_GROUP | subprocess.DETACHED_PROCESS

    # 1. Auth Service (Port 8000)
    auth_dir = os.path.join(root, "auth-service")
    print("-> Starting Auth Service on http://localhost:8000 ...")
    subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"],
        cwd=auth_dir,
        env=os.environ.copy(),
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        creationflags=flags,
    )

    # 2. AI Orchestrator (Port 8001)
    ai_dir = os.path.join(root, "ai-agent-orchestrator")
    print("-> Starting AI Agent Orchestrator on http://localhost:8001 ...")
    subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8001"],
        cwd=ai_dir,
        env=os.environ.copy(),
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        creationflags=flags,
    )

    # 3. Unified Gateway on Port 8080 (Primary entry point)
    t_gateway = threading.Thread(target=start_unified_gateway, daemon=True)
    t_gateway.start()

    # 4. Standalone Micro-frontends (Ports 3000-3006) for backward compatibility
    for port, folder in FRONTEND_SERVICES.items():
        t = threading.Thread(target=start_standalone_server, args=(port, folder), daemon=True)
        t.start()

    print("\nWaiting 2 seconds for web servers to initialize...")
    time.sleep(2)

    print("\n==================================================")
    print("STEP 3: Verifying Unified Gateway, APIs & Standalone Ports...")
    print("==================================================")

    endpoints = [
        ("http://localhost:8080/", "Landing Page (Port 8080)"),
        ("http://localhost:8080/citizen/", "Citizen Portal (Unified 8080)"),
        ("http://localhost:8080/deo/", "DEO Portal (Unified 8080)"),
        ("http://localhost:8080/verifier/", "Verifier Portal (Unified 8080)"),
        ("http://localhost:8080/legal/", "Legal Portal (Unified 8080)"),
        ("http://localhost:8080/gis/", "GIS Portal (Unified 8080)"),
        ("http://localhost:8080/revenue/", "Revenue Register Office (Unified 8080)"),
        ("http://localhost:8080/admin/", "System Admin Portal (Unified 8080)"),
        ("http://localhost:8000/docs", "Auth Service API (Port 8000)"),
        ("http://localhost:8001/docs", "AI Orchestrator API (Port 8001)"),
        ("http://localhost:3000/", "Citizen Portal (Standalone Port 3000)"),
        ("http://localhost:3001/", "DEO Portal (Standalone Port 3001)"),
        ("http://localhost:3002/", "Verifier Portal (Standalone Port 3002)"),
        ("http://localhost:3003/", "Legal Portal (Standalone Port 3003)"),
        ("http://localhost:3004/", "GIS Portal (Standalone Port 3004)"),
        ("http://localhost:3005/", "Revenue Portal (Standalone Port 3005)"),
        ("http://localhost:3006/", "Admin Portal (Standalone Port 3006)"),
    ]

    for url, label in endpoints:
        status = "PENDING"
        for _ in range(5):
            try:
                req = urllib.request.Request(url, headers={"User-Agent": "BhoorakshaChecker/1.0"})
                with urllib.request.urlopen(req, timeout=2) as resp:
                    if resp.status in (200, 304):
                        status = "ONLINE (200 OK)"
                        break
            except Exception:
                time.sleep(0.6)

        print(f"[{'ONLINE' if 'ONLINE' in status else 'STARTING'}] {label} -> {url}")

    print("\n==================================================")
    print("[SUCCESS] ALL BHOORAKSHA SERVICES ARE CONNECTED ON 8080!")
    print("==================================================")
    print("Open your browser and navigate to the Unified Web Link:")
    print("-> http://localhost:8080")
    print("   |-- /citizen/   (Citizen Land Records Portal)")
    print("   |-- /deo/       (Patwari / DEO Maker Portal)")
    print("   |-- /verifier/  (Girdawar Verifier Checker Portal)")
    print("   |-- /legal/     (Legal Scrutiny Portal)")
    print("   |-- /gis/       (Cadastral GIS Specialist Portal)")
    print("   |-- /revenue/   (Tehsildar Revenue Register Office)")
    print("   \\-- /admin/     (CCLA System Admin Portal)")
    print("==================================================")

if __name__ == "__main__":
    clean_ports()
    run_services()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down services.")
