import path from "node:path";
import swaggerJsdoc from "swagger-jsdoc";

const port = process.env.PORT || "3001";

const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.3",

        info: {
            title: "CondoReserva API",
            version: "1.0.0",
            description:
                "Documentação da API do sistema de reservas de áreas de lazer do condomínio.",
        },

        servers: [
            {
                url: `http://localhost:${port}`,
                description: "Servidor local",
            },
        ],

        tags: [
            { name: "Autenticação", description: "Login e autenticação" },
            { name: "Usuários", description: "Dados e operações do usuário autenticado" },
            { name: "Apartamentos", description: "Gerenciamento de apartamentos" },
            { name: "Moradores", description: "Gerenciamento de moradores" },
            { name: "Áreas de lazer", description: "Gerenciamento das áreas de lazer" },
            { name: "Reservas", description: "Gerenciamento de reservas" },
        ],


        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Informe o token JWT obtido no endpoint /auth/login.",
                },
            },

            schemas: {
                ErrorResponse: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "Mensagem de erro.",
                        },
                    },
                },

                LoginRequest: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: {
                            type: "string",
                            format: "email",
                            example: "morador@email.com",
                        },
                        password: {
                            type: "string",
                            minLength: 1,
                            example: "senha123",
                        },
                    },
                },

                AuthenticatedUser: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid",
                        },
                        name: {
                            type: "string",
                            example: "João da Silva",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "joao@email.com",
                        },
                        role: {
                            type: "string",
                            enum: ["ADMIN", "RESIDENT"],
                            example: "RESIDENT",
                        },
                    },
                },

                UserProfile: {
                    allOf: [
                        { $ref: "#/components/schemas/AuthenticatedUser" },
                        {
                            type: "object",
                            properties: {
                                createdAt: {
                                    type: "string",
                                    format: "date-time",
                                },
                                updatedAt: {
                                    type: "string",
                                    format: "date-time",
                                },
                            },
                        },
                    ],
                },

                LoginResponse: {
                    type: "object",
                    properties: {
                        user: {
                            $ref: "#/components/schemas/AuthenticatedUser",
                        },
                        token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIs...",
                        },
                    },
                },

                ChangePasswordRequest: {
                    type: "object",
                    required: ["currentPassword", "newPassword"],
                    properties: {
                        currentPassword: {
                            type: "string",
                            minLength: 1,
                            example: "senhaAtual123",
                        },
                        newPassword: {
                            type: "string",
                            minLength: 8,
                            example: "novaSenha123",
                        },
                    },
                },

                MessageResponse: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "Senha alterada com sucesso.",
                        },
                    },
                },

                ApartmentRequest: {
                    type: "object",
                    required: ["block", "number"],
                    properties: {
                        block: {
                            type: "string",
                            example: "A",
                        },
                        number: {
                            type: "string",
                            example: "101",
                        },
                    },
                },

                ApartmentUpdateRequest: {
                    type: "object",
                    minProperties: 1,
                    properties: {
                        block: {
                            type: "string",
                            example: "A",
                        },
                        number: {
                            type: "string",
                            example: "102",
                        },
                    },
                },

                CreateResidentRequest: {
                    type: "object",
                    required: ["fullName", "cpf", "phone", "apartmentId", "email", "password"],
                    properties: {
                        fullName: {
                            type: "string",
                            example: "João da Silva",
                        },
                        cpf: {
                            type: "string",
                            example: "12345678900",
                        },
                        phone: {
                            type: "string",
                            example: "83999999999",
                        },
                        apartmentId: {
                            type: "string",
                            format: "uuid",
                            example: "550e8400-e29b-41d4-a716-446655440000",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "joao@email.com",
                        },
                        password: {
                            type: "string",
                            minLength: 8,
                            example: "senha123",
                        },
                    },
                },

                ResidentUpdateRequest: {
                    type: "object",
                    minProperties: 1,
                    properties: {
                        fullName: {
                            type: "string",
                            example: "João da Silva",
                        },
                        cpf: {
                            type: "string",
                            example: "12345678900",
                        },
                        phone: {
                            type: "string",
                            example: "83999999999",
                        },
                        apartmentId: {
                            type: "string",
                            format: "uuid",
                            example: "550e8400-e29b-41d4-a716-446655440000",
                        },
                    },
                },

                ApartmentResponse: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid",
                        },
                        block: {
                            type: "string",
                            example: "A",
                        },
                        number: {
                            type: "string",
                            example: "101",
                        },
                    },
                },

                ResidentResponse: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid",
                        },
                        fullName: {
                            type: "string",
                            example: "João da Silva",
                        },
                        cpf: {
                            type: "string",
                            example: "12345678900",
                        },
                        phone: {
                            type: "string",
                            example: "83999999999",
                        },
                        apartmentId: {
                            type: "string",
                            format: "uuid",
                        },
                        apartment: {
                            $ref: "#/components/schemas/ApartmentResponse",
                        },
                    },
                },

                LeisureAreaRequest: {
                    type: "object",
                    required: ["name"],
                    properties: {
                        name: {
                            type: "string",
                            example: "Piscina",
                        },
                        description: {
                            type: "string",
                            nullable: true,
                            example: "Piscina principal do condomínio",
                        },
                        active: {
                            type: "boolean",
                            default: true,
                            example: true,
                        },
                    },
                },

                LeisureAreaUpdateRequest: {
                    type: "object",
                    minProperties: 1,
                    properties: {
                        name: {
                            type: "string",
                            example: "Salão de festas",
                        },
                        description: {
                            type: "string",
                            nullable: true,
                            example: "Espaço para eventos",
                        },
                        active: {
                            type: "boolean",
                            example: false,
                        },
                    },
                },

                LeisureAreaResponse: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string", example: "Piscina" },
                        description: {
                            type: "string",
                            nullable: true,
                            example: "Piscina principal do condomínio",
                        },
                        active: { type: "boolean", example: true },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },

                ReservationStatus: {
                    type: "string",
                    enum: ["CONFIRMED", "CANCELLED"],
                },

                ReservationRequest: {
                    type: "object",
                    required: ["leisureAreaId", "startAt", "endAt"],
                    properties: {
                        residentId: {
                            type: "string",
                            format: "uuid",
                            description:
                                "Obrigatório para ADMIN. Para RESIDENT, o sistema identifica automaticamente o morador vinculado à conta.",
                        },
                        leisureAreaId: {
                            type: "string",
                            format: "uuid",
                        },
                        startAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-12-01T14:00:00-03:00",
                        },
                        endAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-12-01T16:00:00-03:00",
                        },
                    },
                },

                ReservationUpdateRequest: {
                    type: "object",
                    minProperties: 1,
                    properties: {
                        residentId: { type: "string", format: "uuid" },
                        leisureAreaId: { type: "string", format: "uuid" },
                        startAt: { type: "string", format: "date-time" },
                        endAt: { type: "string", format: "date-time" },
                    },
                },

                ReservationResponse: {
                    type: "object",
                    required: [
                        "id",
                        "residentId",
                        "leisureAreaId",
                        "startAt",
                        "endAt",
                        "status",
                        "createdAt",
                        "updatedAt",
                        "resident",
                        "leisureArea",
                    ],
                    properties: {
                        id: { type: "string", format: "uuid" },
                        residentId: { type: "string", format: "uuid" },
                        leisureAreaId: { type: "string", format: "uuid" },
                        startAt: { type: "string", format: "date-time" },
                        endAt: { type: "string", format: "date-time" },
                        status: { $ref: "#/components/schemas/ReservationStatus" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                        resident: {
                            type: "object",
                            required: ["fullName"],
                            properties: {
                                fullName: {
                                    type: "string",
                                    example: "João da Silva",
                                },
                            },
                        },
                        leisureArea: {
                            type: "object",
                            required: ["name"],
                            properties: {
                                name: {
                                    type: "string",
                                    example: "Piscina",
                                },
                            },
                        },
                    },
                },
            },
        },
    },

    // Funciona tanto no desenvolvimento (src) quanto no build (dist) e compatível com Windows.
    apis: [
        path.join(__dirname, "../routes/*.ts").split(path.sep).join("/"),
        path.join(__dirname, "../routes/*.js").split(path.sep).join("/"),
    ],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);