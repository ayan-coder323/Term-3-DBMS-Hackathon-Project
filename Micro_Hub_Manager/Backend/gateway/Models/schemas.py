from pydantic import BaseModel

class SignupSchema(BaseModel): # Predefined class for the sign up request body
    fullname: str
    email: str
    phone: str
    password: str

class SigninSchema(BaseModel): # Predefined class for the sign in request body
    username: str
    password: str

class UserSchema(BaseModel): # Predefined class for the user information response body
    fullname: str
    email: str
    phone: str
    password: str
    role: int
    status: int

class TaskSchema(BaseModel):
    title:str
    description:str
    createdby:int
    assignedto:int
    priority:int
    deadline:str
    status:int