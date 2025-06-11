from typing import List

from . import models, schemas


async def get_factories_list() -> List[schemas.Factory]:
    return await models.Factory.objects.all()
