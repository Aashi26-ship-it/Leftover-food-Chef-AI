# main.py
from fastapi import FastAPI
from crew import run_pipeline
app = FastAPI()
@app.post("/api/agents/run")
def trigger_agents():
 result = run_pipeline()
 return {"status": "success", "result": result}
