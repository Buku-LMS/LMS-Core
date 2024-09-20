import strawberry_django
from strawberry import auto
from .models import Transaction
from apps.books.types import BookType
from apps.members.types import MemberType
from typing import Optional
from datetime import date


@strawberry_django.type(Transaction)
class TransactionType:
    id: auto
    book: BookType
    member: MemberType
    issue_date: date
    return_date: Optional[date]
    fee: float
