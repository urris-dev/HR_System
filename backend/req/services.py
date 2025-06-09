from typing import List

import oauth2
from . import models, schemas
from users.models import User


async def get_requests_list(Authorize: oauth2.AuthJWT) -> List[schemas.Request]:
    email = Authorize.get_jwt_subject()
    user = await User.objects.get(email=email)

    if user.access_level != "Пользователь":
        return await models.Request.objects.select_related("factory_id").select_related('responsible_id').all()
    else:
        return await models.Request.objects.select_related(["factory_id", 'responsible_id']).filter(factory_id=user.factory_id).all()
