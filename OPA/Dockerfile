FROM ubuntu:20.04

WORKDIR /opa
COPY example.rego .
COPY opa .

EXPOSE 8181
CMD chmod 755 ./opa
CMD ./opa run --server ./example.rego