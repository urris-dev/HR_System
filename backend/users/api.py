from fastapi import APIRouter, Depends, Response
from typing import List

import oauth2
from dependencies import check_access_token, check_refresh_token
from . import schemas, services


user_router = APIRouter(
    prefix="/api/users",
    tags=["users"]
    )


@user_router.get("/users-list", dependencies=[Depends(check_access_token)], responses={401: {}, 403: {}}, response_model=List[schemas.User])
async def get_users_list(Authorize: oauth2.AuthJWT = Depends()):
    return await services.get_users_list(Authorize)


@user_router.get("/users", dependencies=[Depends(check_access_token)], responses={401: {}}, response_model=List[schemas.Users])
async def get_users():
    return await services.get_users()


@user_router.post("/create-user", dependencies=[Depends(check_access_token)], responses={401: {}, 403: {}, 409: {}})
async def create_user(user: schemas.UserCreate, Authorize: oauth2.AuthJWT = Depends()):
    return await services.create_user(user, Authorize)


@user_router.patch("/edit-user", dependencies=[Depends(check_access_token)], responses={401: {}, 403: {}})
async def edit_user(user: schemas.UserEdit, Authorize: oauth2.AuthJWT = Depends()):
    return await services.edit_user(user, Authorize)


@user_router.post("/login", responses={400: {}})
async def login(user: schemas.UserLogin, Authorize: oauth2.AuthJWT = Depends()):
    return await services.login_user(user, Authorize)


@user_router.delete("/logout")
async def logout(Authorize: oauth2.AuthJWT = Depends()):
    response = Response(status_code=200) 
    Authorize.unset_jwt_cookies(response)
    return response


@user_router.post("/refresh", dependencies=[Depends(check_refresh_token)], responses={401: {}})
async def refresh(Authorize: oauth2.AuthJWT = Depends()):
    return await services.recreate_tokens(Authorize)

