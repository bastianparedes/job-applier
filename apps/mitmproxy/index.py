from mitmproxy import http

def response(flow: http.HTTPFlow) -> None:
    # Ejemplo: agregar o modificar un header
    flow.response.headers["x-custom-header"] = "modificado-por-mitmproxy"

    # Ejemplo: eliminar un header específico
    if "x-frame-options" in flow.response.headers:
        del flow.response.headers["x-frame-options"]
