export type Config = {
    database: {
        source: {
            adapter: string;
            host: string;
            port: number;
            user: string;
            password: string;
            database: string;
        };
    };
    target: {
        adapter: string;
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
    };
};

export type Migration = {
    name: string;
    table: {
        target: string;
        source: string;
    };
    columns: {
        column: string;
        primary?: boolean;
        target_column?: string;
        conversion?: {
            type: 'int' | 'boolean' | 'float' | 'text' | 'uuid' | 'bigint' | 'tinytext';
            target_type?: 'int' | 'boolean' | 'float' | 'text' | 'uuid' | 'bigint' | 'tinytext';
        };
    }[];
};