from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:password@localhost:5432/portfolio_cms"
    redis_url: str = "redis://localhost:6379"
    secret_key: str = "change_this_secret_key_in_production"
    admin_password: str = "admin123"
    environment: str = "development"
    media_root: str = "../media"
    cors_origins: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache
def get_settings() -> Settings:
    return Settings()
