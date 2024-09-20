import strawberry
from apps.members.schema import Query as MembersQuery, Mutation as MembersMutation
from apps.books.schema import Query as BooksQuery, Mutation as BooksMutation
from apps.transactions.schema import (
    Query as TransactionsQuery,
    Mutation as TransactionsMutation,
)


@strawberry.type
class Query(MembersQuery, BooksQuery, TransactionsQuery):
    pass


@strawberry.type
class Mutation(MembersMutation, BooksMutation, TransactionsMutation):
    pass


schema = strawberry.Schema(query=Query, mutation=Mutation)
