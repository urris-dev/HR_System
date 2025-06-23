from fastapi.responses import Response, JSONResponse
from fastapi.exceptions import HTTPException
from typing import Union, List

import oauth2
from config import settings
from . import models, schemas, utils


JWT_ACCESS_TOKEN_EXPIRES_IN = settings.JWT_ACCESS_TOKEN_EXPIRES_IN * 60
JWT_REFRESH_TOKEN_EXPIRES_IN = settings.JWT_REFRESH_TOKEN_EXPIRES_IN * 60

    
async def check_admin_permissions(Authorize: oauth2.AuthJWT) -> Union[HTTPException, None]:
    admin_email = Authorize.get_jwt_subject()
    admin = await models.User.objects.get(email=admin_email)
    if (admin.access_level != settings.ADMIN_ACCESS_LEVEL):
        raise HTTPException(status_code=403, detail="Недостаточно прав для выполнения операции.")


async def get_users_list(Authorize: oauth2.AuthJWT) -> List[schemas.User]:
    await check_admin_permissions(Authorize)
    users = await models.User.objects.select_related("factory_id").all()
    return users


async def get_users() -> List[schemas.Users]:
    return await models.User.objects.exclude(email=settings.ADMIN_EMAIL).all()


async def create_user(user: schemas.UserCreate, Authorize: oauth2.AuthJWT) -> Union[HTTPException, Response]:
    await check_admin_permissions(Authorize)

    try:
        await models.User.objects.get(email=user.email)
        raise HTTPException(status_code=409, detail="Данный сотрудник уже зарегистрирован.")
    except HTTPException as r:
        raise r
    except: pass

    hashed_password = await utils.hash_data(user.password)
    if user.access_level != "Пользователь":
        await models.User.objects.create(**user.model_dump(exclude={"password", "factory_id"}), password=hashed_password)    
    else:
        await models.User.objects.create(**user.model_dump(exclude={"password"}), password=hashed_password)    

    return Response(status_code=200)


async def edit_user(user: schemas.UserEdit, Authorize: oauth2.AuthJWT) -> Union[HTTPException, Response]:
    await check_admin_permissions(Authorize)

    _user = await models.User.objects.get(id=user.id)
    for field in user.changed_fields:
        if field == "password":
            _user.password = await utils.hash_data(user.password)
        else:
            _user.__setattr__(field, user.__getattribute__(field))
    await _user.update(user.changed_fields)

    return Response(status_code=200)


async def login_user(user: schemas.UserLogin, Authorize: oauth2.AuthJWT) -> Union[HTTPException, JSONResponse]:
    try:
        _user = await models.User.objects.get(email=user.email)
    except:
        raise HTTPException(status_code=400, detail="Неправильная почта или пароль.")

    if not(await utils.verify_data(user.password, _user.password)):
        raise HTTPException(status_code=400, detail="Неправильная почта или пароль.")
    
    access_token = Authorize.create_access_token(subject=user.email)
    refresh_token = Authorize.create_refresh_token(subject=user.email)
    response = JSONResponse(content={"access_level": _user.access_level}, status_code=200)
    Authorize.set_access_cookies(access_token, response, max_age=JWT_ACCESS_TOKEN_EXPIRES_IN)
    Authorize.set_refresh_cookies(refresh_token, response, max_age=JWT_REFRESH_TOKEN_EXPIRES_IN)

    return response


async def recreate_tokens(Authorize: oauth2.AuthJWT) -> Response:
    email = Authorize.get_jwt_subject()
    access_token = Authorize.create_access_token(subject=email)
    refresh_token = Authorize.create_refresh_token(subject=email)
    response = Response(status_code=200)
    Authorize.set_access_cookies(access_token, response, max_age=JWT_ACCESS_TOKEN_EXPIRES_IN)
    Authorize.set_refresh_cookies(refresh_token, response, max_age=JWT_REFRESH_TOKEN_EXPIRES_IN)

    return response
