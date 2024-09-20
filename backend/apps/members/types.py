import strawberry_django
from strawberry import auto
from .models import Member
from typing import Optional


@strawberry_django.type(Member)
class MemberType:
    id: auto
    first_name: str
    last_name: str
    email: str
    phone_number: Optional[str]
    balance: float
