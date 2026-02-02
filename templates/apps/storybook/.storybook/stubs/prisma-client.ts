export class PrismaClient {
    constructor() {
        return new Proxy({}, {
            get: () => {
                return () => Promise.resolve([]);
            }
        });
    }
}

export const Prisma = {
    Decimal: class Decimal {
        constructor(value: any) {
            return value;
        }
    },
    JsonObject: {},
    JsonArray: [],
    JsonValue: {}
};

export default {
    PrismaClient,
    Prisma
};

