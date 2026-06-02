from fastapi import FastAPI


app = FastAPI(title="Petsit API")


@app.get("/health")
def health():
    return {"ok": True}

