import os
import requests

def push(text: str, title: str = "Notification from App") -> bool:
    """Send notification via ntfy.sh. Returns True if sent, False otherwise."""
    ntfy_topic = (os.getenv("NTFY_TOPIC") or "").strip()
    if not ntfy_topic:
        return False
    url = f"https://ntfy.sh/{ntfy_topic}"
    try:
        r = requests.post(
            url,
            data=text.encode("utf-8"),
            headers={"Title": title},
            timeout=15,
            verify=True,
        )
        return 200 <= r.status_code < 300
    except Exception as e:
        print(f"Push failed: {e}", flush=True)
        return False
