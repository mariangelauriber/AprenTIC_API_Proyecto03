const requireRole = require ('../../middleware/requireRole');

const fakeRes = () => {
    const res = {};
    res.status = jest.fn(() => res);
    res.json = jest.fn(() => res);
    return res;
};


describe('requireRole', () => {
     it('llama a next() si el rol está permitido', () => {
        const req = { user: { role: 'admin' } };    
        const res = fakeRes();
        const next = jest.fn();    
        requireRole('admin')(req, res, next);    
        expect(next).toHaveBeenCalled();    
        expect(res.status).not.toHaveBeenCalled();  
    });

 it('devuelve 403 si el rol NO está permitido', () => {    
        const req = { user: { role: 'profesor' } };    
        const res = fakeRes();    
        const next = jest.fn();    
        requireRole('admin')(req, res, next);    
        expect(res.status).toHaveBeenCalledWith(403);    
        expect(next).not.toHaveBeenCalled();  
    }); 
});

