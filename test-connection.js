import { SQL } from "bun";

const sourceConfig = {
    adapter: "mariadb",
    host: "localhost",
    port: 3306,
    user: "nl_user",
    password: "123",
    database: "nl"
};

async function testConnection() {
    console.log('Testing MariaDB connection...');
    console.log('Config:', sourceConfig);
    
    try {
        const source = new SQL(sourceConfig);
        console.log('SQL instance created');
        
        console.log('Executing test query...');
        const result = await source.unsafe('SELECT 1 as test');
        console.log('Query result:', result);
        
        console.log('Testing table query...');
        const tables = await source.unsafe('SHOW TABLES');
        console.log('Tables:', tables);
        
        console.log('Testing data query...');
        const data = await source.unsafe('SELECT COUNT(*) as count FROM tb_person_frames');
        console.log('Data count:', data);
        
    } catch (error) {
        console.error('Connection failed:', error.message);
        console.error('Stack:', error.stack);
    }
}

testConnection();
