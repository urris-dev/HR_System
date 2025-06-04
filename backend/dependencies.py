from fastapi import Depends, HTTPException

import oauth2

async def check_access_token(Authorize: oauth2.AuthJWT = Depends()):
    try:
        Authorize.jwt_required()
    except:
        raise HTTPException(status_code=401, detail="Срок действия токена доступа истёк.")


async def check_refresh_token(Authorize: oauth2.AuthJWT = Depends()):
    try:
        Authorize.jwt_refresh_token_required()
    except:
        raise HTTPException(status_code=401, detail="Срок действия токена обновления истёк.")
