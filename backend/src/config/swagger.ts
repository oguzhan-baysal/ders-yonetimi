import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Öğrenci ve Ders Yönetimi API',
            version: '1.0.0',
            description: 'Öğrenci ve ders yönetimi için REST API dokümantasyonu',
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{
            bearerAuth: [],
        }],
    },
    apis: ['./src/routes/*.ts'], // Route dosyalarının yolu
};

export const specs = swaggerJsdoc(options); 