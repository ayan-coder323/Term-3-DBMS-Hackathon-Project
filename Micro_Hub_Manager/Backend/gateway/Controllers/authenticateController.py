from fastapi import APIRouter, Header
from Models.schemas import SigninSchema, SignupSchema, UserSchema
import httpx

router = APIRouter(prefix="/authservice")

SPRING_URL = "http://localhost:8081/"


# ================= SIGNUP =================
@router.post("/signup")
async def signup(U: SignupSchema):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            SPRING_URL + "user/signup",
            json=U.model_dump()
        )
    return response.json()


# ================= SIGNIN =================
@router.post("/signin")
async def signin(U: SigninSchema):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            SPRING_URL + "user/signin",
            json=U.model_dump()
        )
    return response.json()


# ================= USER INFO =================
@router.get("/uinfo")
async def uinfo(Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            SPRING_URL + "user/uinfo",
            headers={"Token": Token}
        )
    return response.json()


# ================= PROFILE =================
@router.get("/profile")
async def profile(Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            SPRING_URL + "user/profile",
            headers={"Token": Token}
        )
    return response.json()


# ================= GET ALL USERS =================
@router.get("/getallusers/{PAGE}/{SIZE}")
async def get_all_users(PAGE: int, SIZE: int, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            SPRING_URL + f"user/getallusers/{PAGE}/{SIZE}",
            headers={"Token": Token}
        )
    return response.json()


# ================= SAVE USER =================
@router.post("/saveuser")
async def saveuser(U: UserSchema, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            SPRING_URL + "user/saveuser",
            json=U.model_dump(),
            headers={"Token": Token}
        )
    return response.json()


# ================= UPDATE USER =================
@router.put("/updateuser/{id}")
async def update_user(id: int, U: UserSchema, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.put(
            SPRING_URL + f"user/updateuser/{id}",
            json=U.model_dump(),
            headers={"Token": Token}
        )
    return response.json()


# ================= DELETE USER =================
@router.delete("/deleteuser/{id}")
async def delete_user(id: int, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.delete(
            SPRING_URL + f"user/deleteUser/{id}",
            headers={"Token": Token}
        )
    return response.json()


# ================= GET USER BY ID =================
@router.get("/getuser/{ID}")
async def getuser(ID: int, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            SPRING_URL + f"user/getuser/{ID}",
            headers={"Token": Token}
        )
    return response.json()

@router.get("/searchuser/{KEY}")
async def searchUser(KEY: str, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            SPRING_URL + f"user/searchuser/{KEY}",
            headers = {"Token": Token}
        )
    return response.json()