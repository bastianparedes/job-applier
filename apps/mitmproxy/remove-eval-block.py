from mitmproxy import http

def response(flow: http.HTTPFlow):
    # Borra CSP en header
    if "Content-Security-Policy" in flow.response.headers:
        del flow.response.headers["Content-Security-Policy"]
        print(f"🚫 CSP eliminado en: {flow.request.url}")

    # Borra CSP en modo "Report-Only"
    if "Content-Security-Policy-Report-Only" in flow.response.headers:
        del flow.response.headers["Content-Security-Policy-Report-Only"]
        print(f"🚫 CSP Report-Only eliminado en: {flow.request.url}")

    # Si el HTML contiene un <meta http-equiv="Content-Security-Policy">, borrarlo
    if "text/html" in flow.response.headers.get("content-type", ""):
        text = flow.response.get_text()
        import re
        text = re.sub(
            r'<meta[^>]+http-equiv=["\']Content-Security-Policy["\'][^>]*>',
            '',
            text,
            flags=re.IGNORECASE
        )
        flow.response.set_text(text)
