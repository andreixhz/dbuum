import { SQL } from "bun";

const sourceConfig = {
    adapter: "mariadb",
    host: "localhost",
    port: 3306,
    user: "nl_user",
    password: "123",
    database: "nl"
};

async function simpleCheck() {
    try {
        const source = new SQL(sourceConfig);
        
        console.log('Checking table existence...');
        const tables = await source.unsafe('SHOW TABLES');
        console.log('Tables:', tables);
        
        console.log('\nChecking tb_person_frames structure...');
        const structure = await source.unsafe('DESCRIBE tb_person_frames');
        console.log('Structure:', structure);
        
        console.log('\nChecking row count...');
        const count = await source.unsafe('SELECT COUNT(*) as total FROM tb_person_frames');
        console.log('Row count:', count);
        
        if (count[0].total > 0) {
            console.log('\nGetting first row...');
            const firstRow = await source.unsafe('SELECT * FROM tb_person_frames LIMIT 1');
            console.log('First row:', firstRow);
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

simpleCheck();
