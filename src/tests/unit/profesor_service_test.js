jest.mock('../../models/Profesor');
const Profesor = require('../../models/Profesor'); 
const service = require('../../services/profesorService'); 
describe('profesor.service', () => {  
    it('obtenerProfesores llama a Profesor.find y devuelve su resultado', async () => {
        Profesor.find.mockResolvedValue([{ nombre: 'Ana' }]);   // qué "devuelve" la BBDD    
const resultado = await service.getAll();    
expect(Profesor.find).toHaveBeenCalled();    
expect(resultado).toEqual([{ nombre: 'Ana' }]);  
});
});