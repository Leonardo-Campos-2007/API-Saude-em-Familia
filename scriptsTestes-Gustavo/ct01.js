pm.test("Status code deve ser 400", function () {
    pm.response.to.have.status(400);
});

pm.test("Mensagem de erro de parâmetro", function () {
    var json = pm.response.json();
    pm.expect(json.error).to.eql("Parâmetro ?mes=YYYY-MM obrigatório.");
});