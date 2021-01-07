const modulusRoute = (router, modulus, controlller) => {
        router.get(`/listar${modulus}s`, controlller.list);
        router.get(`/obter${modulus}/:codigo${modulus}`, controlller.getByCodigo);
        router.post(`/inserir${modulus}`, controlller.insert);
        router.put(`/atualizar${modulus}/:codigo${modulus}`, controlller.update);
        router.delete(`/excluir${modulus}/:codigo${modulus}`, controlller.delete);
}

module.exports = modulusRoute;