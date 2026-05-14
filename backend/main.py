import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request # 'Request' hinzugefügt
from fastapi.responses import Response, FileResponse # 'FileResponse' hinzugefügt
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles # 'StaticFiles' hinzugefügt
from cv2 import dnn_superres
import io
import os # 'os' hinzugefügt
from PIL import Image
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- KI Modell laden ---
sr = dnn_superres.DnnSuperResImpl_create()
try:
    sr.readModel("EDSR_x4.pb")
    sr.setModel("edsr", 4)
    print("Modell geladen!")
except:
    print("Fehler beim Laden des Modells!")


# --- Hilfsfunktionen ---
async def load_image_from_file(file: UploadFile) -> np.ndarray:
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise HTTPException(status_code=400, detail="Ungültiges Bildformat")
    return img

def _encode_pdf_sync(image: np.ndarray) -> bytes:
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(image_rgb)
    buffer = io.BytesIO()
    pil_img.save(buffer, format="PDF")
    buffer.seek(0)
    return buffer.getvalue()

async def return_image(image: np.ndarray, fmt: str) -> Response:
    fmt_clean = fmt.lower().strip().replace(".", "")
    if not fmt_clean:
        fmt_clean = "jpg"

    # PDF via Pillow (Thread)
    if fmt_clean == "pdf":
        pdf_bytes = await asyncio.to_thread(_encode_pdf_sync, image)
        return Response(content=pdf_bytes, media_type="application/pdf")

    # Standard-Bilder via OpenCV (Thread)
    ext = f".{fmt_clean}"
    try:
        success, encoded_img = await asyncio.to_thread(cv2.imencode, ext, image)
    except cv2.error:
        raise HTTPException(status_code=400, detail=f"Format '{fmt}' wird nicht unterstützt.")

    if not success:
        raise HTTPException(status_code=500, detail="Encoding fehlgeschlagen")

    mime_map = {
        "png": "image/png",
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "webp": "image/webp",
        "tiff": "image/tiff"
    }
    media_type = mime_map.get(fmt_clean, f"image/{fmt_clean}")

    return Response(content=encoded_img.tobytes(), media_type=media_type)


# --- API Endpunkte ---
@app.post("/upscale/")
async def upscale_image(
        file: UploadFile = File(...),
        target_format: str = Form("jpg")
):
    image = await load_image_from_file(file)

    try:
        # Asynchrones Upscaling
        result = await asyncio.to_thread(sr.upsample, image)
    except Exception:
        raise HTTPException(status_code=500, detail="Upscaling fehlgeschlagen")

    return await return_image(result, target_format)


@app.post("/downscale/")
async def downscale_image(
        file: UploadFile = File(...),
        factor: int = Form(...),
        target_format: str = Form("jpg")
):
    image = await load_image_from_file(file)

    if factor <= 1:
        raise HTTPException(status_code=400, detail="Faktor muss > 1 sein")

    inv_scale = 1 / factor
    width = int(image.shape[1] * inv_scale)
    height = int(image.shape[0] * inv_scale)

    try:
        # Asynchrones Downscaling
        result = await asyncio.to_thread(cv2.resize, image, (width, height), interpolation=cv2.INTER_AREA)
    except Exception:
        raise HTTPException(status_code=500, detail="Downscaling fehlgeschlagen")

    return await return_image(result, target_format)


@app.post("/convert/")
async def convert_image(
        file: UploadFile = File(...),
        target_format: str = Form(...) # Hier geändert: target_format statt targetFormat
):
    image = await load_image_from_file(file)
    return await return_image(image, target_format) # Hier auch geändert


# --- NEU: Frontend Auslieferung ---

# 1. Statischen Ordner mounten. 
# WICHTIG: Das muss GANZ UNTEN stehen (nach deinen API-Routen!), sonst überschreibt es die API.
# os.path.exists stellt sicher, dass dein Code lokal nicht abstürzt, wenn der Ordner "static" noch nicht existiert.
if os.path.exists("static"):
    app.mount("/", StaticFiles(directory="static", html=True), name="static")

# 2. Catch-All für Angular-Routing (verhindert 404 Fehler, wenn man die Seite neu lädt)
@app.exception_handler(404)
async def custom_404_handler(request: Request, exc: Exception):
    if os.path.exists("static/index.html"):
        return FileResponse("static/index.html")
    return Response(content="Frontend not found", status_code=404)


if __name__ == "__main__":
    import uvicorn
    # WICHTIGER HINWEIS ZUM PORT: 
    # Dein alter Code nutzte Port 8000. Im Dockerfile-Beispiel aus dem PDF war es 8080.
    # Ich habe es hier auf 8080 geändert, damit es perfekt mit dem Dockerfile übereinstimmt.
    uvicorn.run(app, host="0.0.0.0", port=8080)