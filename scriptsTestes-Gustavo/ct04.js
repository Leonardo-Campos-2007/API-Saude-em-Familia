pm.test("Status code deve ser 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Lista de registros não vazia", function () {
    var json = pm.response.json();
    pm.expect(json.registros).to.be.an("array").that.is.not.empty;
});

pm.test("Registro contém campos esperados", function () {
    var json = pm.response.json();
    var registro = json.registros[0];
    pm.expect(registro).to.have.property("id_medicamento");
    pm.expect(registro).to.have.property("nome");
    pm.expect(registro).to.have.property("dosagem");
    pm.expect(registro).to.have.property("horario_principal");
});