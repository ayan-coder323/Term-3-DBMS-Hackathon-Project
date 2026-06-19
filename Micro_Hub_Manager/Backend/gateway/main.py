from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Controllers.init import *
from Controllers.authenticateController import router as authRouter
from Controllers.taskController import router as taskRouter

app = FastAPI()
origins = ["http://localhost:5173"]  # Add your frontend URL here

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)


app.include_router(authRouter)
app.include_router(taskRouter)

@app.get("/")
def home():
    return "Started FastAPI on 15.04.26"

@app.get("/klu")
def klu():
    return "Welcome to Y25 S4 Class on 16.04.26"