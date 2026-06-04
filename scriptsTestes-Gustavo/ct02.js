pm.test("Status code deve ser 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Lista de registros vazia", function () {
    var json = pm.response.json();
    pm.expect(json.registros).to.be.an("array").that.is.empty;
});