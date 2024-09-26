import strawberry
from typing import List
from strawberry.types import Info
from decimal import Decimal
from .models import Member
from .types import MemberType


@strawberry.type
class Query:
    @strawberry.field
    def all_members(self, info: Info) -> List[MemberType]:
        return Member.objects.all()

    @strawberry.field
    def get_member(self, info: Info, member_id: int) -> MemberType:
        return Member.objects.get(id=member_id)

    @strawberry.field
    def get_balance(self, member_id: int) -> float:
        member = Member.objects.get(id=member_id)
        return member.balance


@strawberry.type
class Mutation:
    @strawberry.mutation
    def register_member(
        self,
        first_name: str,
        last_name: str,
        email: str,
        phone_number: str,
        balance: float,
    ) -> MemberType:
        new_member = Member.objects.create(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone_number=phone_number,
            balance=balance,
        )
        return new_member

    @strawberry.mutation
    def update_member(
        self,
        member_id: int,
        first_name: str = None,
        last_name: str = None,
        email: str = None,
        phone_number: str = None,
        balance: float = None,
    ) -> MemberType:
        member = Member.objects.get(id=member_id)

        if first_name is not None:
            member.first_name = first_name
        if last_name is not None:
            member.last_name = last_name
        if email is not None:
            member.email = email
        if phone_number is not None:
            member.phone_number = phone_number
        if balance is not None:
            member.balance = Decimal(balance)

        member.save()
        return member

    @strawberry.mutation
    def cancel_membership(self, member_id: int) -> str:
        try:
            member = Member.objects.get(id=member_id)
            member.delete()  # Delete the member
            return f"Membership successfully cancelled."
        except Member.DoesNotExist:
            return f"Member does not exist."


schema = strawberry.Schema(query=Query, mutation=Mutation)
