## Environment variables:
-----------------------------------------------
You need to define the following environment variables to start the project:

`TR_BACK_SRCS`: path of `srcs_backend`
`POSTGRES_USER`: your db user
`POSTGRES_PASSORD`: your db password
`PGDATA`: recommended: /var/lib/postgresql/data/pgdata


curl -X GET http://localhost:3000/auth -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibG9naW4iOiJqY2Fsb24iLCJlbWFpbCI6ImpjYWxvbkBzdHVkZW50LjQyLmZyIiwiaWF0IjoxNjcyODM2MDcxLCJleHAiOjE2NzI4Mzk2NzF9.b0AP5FpiI82r2XlpavvuYCCBehWj4HchnPy-1RWy4uQ"