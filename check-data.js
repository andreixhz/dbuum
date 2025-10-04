#!/usr/bin/env node

import { SQL } from "bun";

const sourceConfig = {
    adapter: "mariadb",
    host: "localhost",
    port: 3306,
    user: "nl_user",
    password: "123",
    database: "nl"
};

async function checkData() {
    console.log('🔍 Checking data in tb_person_frames...');
    
    try {
        const source = new SQL(sourceConfig);
        
        // Check table structure
        console.log('\n📋 Table structure:');
        const structure = await source.unsafe('DESCRIBE tb_person_frames');
        console.table(structure);
        
        // Check row count
        console.log('\n📊 Row count:');
        const count = await source.unsafe('SELECT COUNT(*) as total FROM tb_person_frames');
        console.log(`Total rows: ${count[0].total}`);
        
        // Check sample data
        console.log('\n📝 Sample data (first 3 rows):');
        const sample = await source.unsafe('SELECT * FROM tb_person_frames LIMIT 3');
        console.table(sample);
        
        // Check specific columns mentioned in migration
        console.log('\n🔍 Checking migration columns:');
        const columns = ['id', 'camera_id', 'yolo_id', 'frame', 'proba_helmet', 'proba_glove', 'proba_boot', 'proba_jumpsuit', 'proba_jacket', 'frame_position', 'annotated_frame', 'boxes', 'uniform_color_laranja', 'uniform_color_azul', 'is_lying_down', 'processed', 'switch_turn', 'created_at', 'updated_at'];
        
        for (const col of columns) {
            try {
                const result = await source.unsafe(`SELECT COUNT(*) as count FROM tb_person_frames WHERE ${col} IS NOT NULL`);
                console.log(`  ${col}: ${result[0].count} non-null values`);
            } catch (err) {
                console.log(`  ${col}: ❌ Column not found or error - ${err.message}`);
            }
        }
        
    } catch (error) {
        console.error('❌ Error checking data:', error.message);
    }
}

checkData().catch(console.error);
