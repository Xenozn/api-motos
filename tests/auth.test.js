const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');
const bcrypt = require('bcryptjs');

// Mock de la base de données
jest.mock('../src/config/db');

describe('Auth API - Login', () => {

    it('devrait retourner un token 200 si les identifiants sont corrects', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const mockUser = {
            id: 1,
            email: 'test@example.com',
            password: hashedPassword,
            nom: 'Test',
            prenom: 'User',
            role: 'user'
        };

        db.query.mockResolvedValue([[mockUser]]);

        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        // 3. Vérifications (Assertions)
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.email).toBe('test@example.com');
        expect(res.body.message).toBe('Connecté !');
    });

    it('devrait retourner 401 si le mot de passe est faux', async () => {
        const hashedPassword = await bcrypt.hash('correct_password', 10);
        db.query.mockResolvedValue([[{ email: 'test@example.com', password: hashedPassword }]]);

        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'test@example.com',
                password: 'wrong_password'
            });

        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toBe('Identifiants invalides');
    });
});