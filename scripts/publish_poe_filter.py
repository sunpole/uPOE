#!/usr/bin/env python3
"""Publish uPOE.filter to the official Path of Exile Item Filter API.

Secrets are read only from environment variables. Nothing is written back to the
repository. The first run can create a private online filter; later runs update
that filter by id.
"""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

API_BASE = "https://api.pathofexile.com"
FILTER_PATH = Path(os.environ.get("POE_FILTER_PATH", "uPOE.filter"))


def env(name: str, required: bool = False, default: str = "") -> str:
    value = os.environ.get(name, default).strip()
    if required and not value:
        raise SystemExit(f"Missing required environment variable: {name}")
    return value


def request_json(method: str, url: str, token: str, user_agent: str, body: dict | None = None) -> tuple[int, dict]:
    data = None
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
        "User-Agent": user_agent,
    }
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            raw = response.read().decode("utf-8")
            return response.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        try:
            payload = json.loads(raw) if raw else {}
        except json.JSONDecodeError:
            payload = {"raw": raw}
        print(f"PoE API HTTP {exc.code}: {json.dumps(payload, ensure_ascii=False)}", file=sys.stderr)
        raise SystemExit(1) from exc
    except urllib.error.URLError as exc:
        raise SystemExit(f"PoE API network error: {exc}") from exc


def main() -> None:
    token = env("POE_ACCESS_TOKEN", required=True)
    client_id = env("POE_CLIENT_ID", required=True)
    contact = env("POE_CONTACT", required=True)
    filter_id = env("POE_FILTER_ID")
    filter_name = env("POE_FILTER_NAME", default="uPOE")
    version = env("POE_FILTER_VERSION", default=os.environ.get("GITHUB_SHA", "manual")[:12])
    make_public = env("POE_FILTER_PUBLIC", default="false").lower() == "true"

    if not FILTER_PATH.is_file():
        raise SystemExit(f"Filter file not found: {FILTER_PATH}")

    filter_text = FILTER_PATH.read_text(encoding="utf-8")
    if not filter_text.strip():
        raise SystemExit("Refusing to publish an empty filter")

    user_agent = f"OAuth {client_id}/0.1.0 (contact: {contact}) uPOE"

    body = {
        "filter_name": filter_name,
        "realm": "pc",
        "description": "uPOE — personal Path of Exile 1 loot filter, published from GitHub.",
        "version": version,
        "type": "Normal",
        "filter": filter_text,
    }

    # Keep first creation private by default. The API docs warn that once a filter
    # is public it cannot be made private again.
    if not filter_id:
        body["public"] = make_public
        endpoint = f"{API_BASE}/item-filter?validate=true"
        action = "create"
    else:
        endpoint = f"{API_BASE}/item-filter/{urllib.parse.quote(filter_id)}?validate=true"
        action = "update"

    status, payload = request_json("POST", endpoint, token, user_agent, body)
    result = payload.get("filter", payload)
    returned_id = result.get("id") if isinstance(result, dict) else None
    validation = result.get("validation") if isinstance(result, dict) else None

    print(f"PoE API action: {action}")
    print(f"HTTP status: {status}")
    if returned_id:
        print(f"FILTER_ID={returned_id}")
    if validation:
        print("Validation:", json.dumps(validation, ensure_ascii=False))
        if validation.get("valid") is False:
            raise SystemExit("PoE rejected the filter during validation")

    # 202 means GGG accepted the request but reports additional processing/info.
    if status == 202:
        error = payload.get("error")
        if error:
            print("Accepted with additional information:", json.dumps(error, ensure_ascii=False))


if __name__ == "__main__":
    main()
