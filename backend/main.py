from contextlib import asynccontextmanager
from database import base_ormar_config
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import AsyncIterator

from config import settings

from factories.api import factory_router
from factories.models import Factory

from users.api import user_router
from users.models import User
from users.utils import hash_data

from req.models import Request
from req.api import request_router

async def prerun():
    try:
        await User.objects.get(email=settings.ADMIN_EMAIL)
    except:
        await User.objects.create(fio=settings.ADMIN_FIO,
                                  email=settings.ADMIN_EMAIL,
                                  password=await hash_data(settings.ADMIN_PASSWORD),
                                  access_level=settings.ADMIN_ACCESS_LEVEL, 
                                  status=settings.ADMIN_STATUS)
        
        for name, production_rate in zip(settings.FACTORIES_NAMES, settings.FACTORIES_PRODUCTION_RATE):
            await Factory.objects.create(name=name, production_rate=production_rate)

def get_lifespan(config):
    @asynccontextmanager
    async def lifespan(_: FastAPI) -> AsyncIterator[None]:
        if not config.database.is_connected:
            await config.database.connect()
            await prerun()

        yield

        if config.database.is_connected:
            await config.database.disconnect()
    return lifespan

app = FastAPI(lifespan=get_lifespan(base_ormar_config))

origins = [settings.CLIENT_ORIGIN]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(factory_router)
app.include_router(user_router)
app.include_router(request_router)
