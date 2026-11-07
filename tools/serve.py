#!/usr/bin/env python3
"""Serve the repo root as static files. `python3 tools/serve.py [port]`."""
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
root = Path(__file__).resolve().parents[1]
handler = lambda *a, **k: SimpleHTTPRequestHandler(*a, directory=root, **k)
print(f"Lantern Barge: http://127.0.0.1:{port}/")
ThreadingHTTPServer(("127.0.0.1", port), handler).serve_forever()
