## Environment variables:
-----------------------------------------------
You need to define the following environment variables to start the project:

`TR_BACK_SRCS`: path of `srcs_backend`
`POSTGRES_USER`: your db user
`POSTGRES_PASSORD`: your db password
`PGDATA`: recommended: /var/lib/postgresql/data/pgdata


curl -X GET http://localhost:3000/2fa/enable -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibG9naW4iOiJqY2Fsb24iLCJlbWFpbCI6ImpjYWxvbkBzdHVkZW50LjQyLmZyIiwidHdvRmEiOnRydWUsImlhdCI6MTY3Mjg1MDU2MywiZXhwIjoxNjcyODU0MTYzfQ.w6pxszx7PlYjxkDs382OtKyrUmrM_bwebIkEVgC6Tik"