import strawberry
from datetime import datetime
from django.utils import timezone
from .models import Transaction
from .types import TransactionType
from apps.members.models import Member
from apps.books.models import Book
from django.shortcuts import get_object_or_404


@strawberry.type
class Query:
    @strawberry.field
    def all_transactions(self) -> list[TransactionType]:
        return Transaction.objects.all()

    @strawberry.field
    def member_transactions(self, member_id: int) -> list[TransactionType]:
        member = Member.objects.get(id=member_id)
        return Transaction.objects.filter(member=member)


@strawberry.type
class Mutation:
    @strawberry.mutation
    def issue_book(self, member_id: int, book_id: int) -> TransactionType:
        member = Member.objects.get(id=member_id)
        book = Book.objects.get(id=book_id)

        if book.stock <= 0:
            raise Exception("Book is out of stock.")

        transaction = Transaction.objects.create(
            member=member,
            book=book,
            fee=book.rent_fee,
        )

        book.stock -= 1
        book.save()

        return transaction

    @strawberry.mutation
    def return_book(self, transaction_id: int) -> TransactionType:
        transaction = get_object_or_404(Transaction, id=transaction_id)

        if transaction.return_date is not None:
            raise Exception("This book has already been returned.")

        transaction.return_date = timezone.now()

        member = transaction.member
        if member.balance < -500:
            raise Exception("Member has exceeded the allowed debt limit.")

        transaction.book.stock += 1
        member.balance -= transaction.fee
        member.save()

        transaction.book.save()
        transaction.save()

        return transaction


transaction_schema = strawberry.Schema(query=Query, mutation=Mutation)
