const modulusRoute = (router, modulus, controlller) => {
        router.get(`/listar${modulus}s`, controlller.list);
        router.get(`/obter${modulus}/:codigo${modulus}`, controlller.getByCodigo);
        router.delete(`/excluir${modulus}/:codigo${modulus}`, controlller.delete);
}

module.exports = modulusRoute;