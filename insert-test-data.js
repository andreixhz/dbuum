import { SQL } from "bun";

const sourceConfig = {
    adapter: "mariadb",
    host: "localhost",
    port: 3306,
    user: "nl_user",
    password: "123",
    database: "nl"
};

const targetConfig = {
    adapter: "postgres",
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "nl"
};

async function insertTestData() {
    try {
        console.log('🔧 Setting up test data...');
        
        const source = new SQL(sourceConfig);
        const target = new SQL(targetConfig);
        
        // Create table in source if it doesn't exist
        console.log('📋 Creating source table...');
        await source.unsafe(`
            CREATE TABLE IF NOT EXISTS tb_person_frames (
                id INT PRIMARY KEY AUTO_INCREMENT,
                camera_id VARCHAR(255),
                yolo_id INT,
                frame VARCHAR(255),
                proba_helmet FLOAT,
                proba_glove FLOAT,
                proba_boot FLOAT,
                proba_jumpsuit FLOAT,
                proba_jacket FLOAT,
                frame_position TEXT,
                annotated_frame TEXT,
                boxes TEXT,
                uniform_color_laranja INT,
                uniform_color_azul INT,
                is_lying_down INT,
                processed INT,
                switch_turn INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        
        // Insert test data
        console.log('📝 Inserting test data...');
        for (let i = 1; i <= 5; i++) {
            await source.unsafe(`
                INSERT INTO tb_person_frames (
                    camera_id, yolo_id, frame, proba_helmet, proba_glove, proba_boot, 
                    proba_jumpsuit, proba_jacket, frame_position, annotated_frame, boxes,
                    uniform_color_laranja, uniform_color_azul, is_lying_down, processed, switch_turn
                ) VALUES (
                    'camera_${i}', ${1000 + i}, 'frame_${i}.jpg', 
                    ${Math.random()}, ${Math.random()}, ${Math.random()}, 
                    ${Math.random()}, ${Math.random()}, '{"x": 100, "y": 200}', 
                    '{"annotations": []}', '{"boxes": []}',
                    ${Math.random() > 0.5 ? 1 : 0}, ${Math.random() > 0.5 ? 1 : 0}, 
                    ${Math.random() > 0.5 ? 1 : 0}, ${Math.random() > 0.5 ? 1 : 0}, 
                    ${Math.random() > 0.5 ? 1 : 0}
                )
            `);
        }
        
        // Create target table
        console.log('📋 Creating target table...');
        await target.unsafe(`
            CREATE TABLE IF NOT EXISTS tb_person_frames (
                id INT PRIMARY KEY,
                camera_id VARCHAR(255),
                yolo_id INT,
                frame VARCHAR(255),
                proba_helmet FLOAT,
                proba_glove FLOAT,
                proba_boot FLOAT,
                proba_jumpsuit FLOAT,
                proba_jacket FLOAT,
                frame_position TEXT,
                annotated_frame TEXT,
                boxes TEXT,
                uniform_color_laranja BOOLEAN,
                uniform_color_azul BOOLEAN,
                is_lying_down BOOLEAN,
                processed BOOLEAN,
                switch_turn BOOLEAN,
                created_at TIMESTAMP,
                updated_at TIMESTAMP
            )
        `);
        
        // Verify data
        console.log('✅ Verifying test data...');
        const count = await source.unsafe('SELECT COUNT(*) as total FROM tb_person_frames');
        console.log(`📊 Source table has ${count[0].total} rows`);
        
        const sample = await source.unsafe('SELECT * FROM tb_person_frames LIMIT 1');
        console.log('📝 Sample row:', sample[0]);
        
        console.log('🎉 Test data setup complete!');
        
    } catch (error) {
        console.error('❌ Error setting up test data:', error.message);
    }
}

insertTestData();
