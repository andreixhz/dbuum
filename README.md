# Migration Database

A powerful and flexible database migration tool built with Bun that allows you to migrate data between different database systems with support for data type conversions, checkpointing, and real-time analytics.

## 🚀 Features

- **Multi-Database Support**: Migrate between different database systems (MySQL, PostgreSQL, MariaDB, etc.)
- **Data Type Conversion**: Automatic conversion between different data types (int to boolean, etc.)
- **Checkpoint System**: Resume migrations from where they left off in case of interruptions
- **Real-time Analytics**: Live progress tracking with estimated completion time
- **Error Handling**: Robust error handling with detailed error reporting
- **YAML Configuration**: Simple and readable configuration files
- **High Performance**: Built with Bun for optimal performance
- **TypeScript Support**: Full TypeScript support with type definitions
- **Comprehensive Testing**: Extensive test suite with 95%+ coverage
- **Cross-Platform**: Compile to standalone executables for Windows, Linux, and macOS

## 📋 Prerequisites

- [Bun](https://bun.sh/) installed on your system
- Access to both source and target databases
- TypeScript (peer dependency)

## 🛠️ Installation

### Option 1: Clone and Install

1. Clone the repository:
```bash
git clone https://github.com/andreixhz/dbuum.git
cd migration-database
```

2. Install dependencies:
```bash
bun install
```

### Option 2: Use as Standalone Executable

Download the pre-compiled executable for your platform from the [Releases](https://github.com/andreixhz/dbuum/releases) page.

### Option 3: Global Installation (Coming Soon)

```bash
bun add -g migration-database
```

## 📖 Usage

### Basic Usage

```bash
bun start <config-file.yaml>
```

### Example Commands

```bash
# Run migration with specific config
bun start my-migration.yaml

# Run example migration
bun run start:01

# Run in development mode with watch
bun run dev exemples/01.yaml

# Test database connection
bun test-connection.js

# Check data integrity
bun check-data.js
```

### Development Commands

```bash
# Run tests
bun test

# Run tests with coverage
bun run test:coverage

# Run tests in watch mode
bun run test:watch

# Type checking
bun run type-check

# Development with auto-reload
bun run dev
```

### Compilation

You can compile the project to standalone executables:

```bash
# Compile for current platform
bun run compile

# Compile for Windows
bun run compile-windows

# Compile for Linux
bun run compile-linux

# Compile for all platforms
bun run compile-all

# Build release (type-check + test + compile)
bun run build:release
```

## ⚙️ Configuration

Create a YAML configuration file to define your migration:

```yaml
database:
  source:
    adapter: mariadb
    host: localhost
    port: 3306
    user: your_username
    password: your_password
    database: source_database

  target:
    adapter: postgres
    host: localhost
    port: 5432
    user: your_username
    password: your_password
    database: target_database

migrations:
  - name: person_frames
    table:
      target: tb_person_frames
      source: tb_person_frames
    columns:
      - column: id
        primary: true
      
      - column: camera_id
      - column: yolo_id
      - column: frame
      
      - column: uniform_color_laranja
        conversion:
          type: int
          target_type: boolean
      
      - column: processed
        conversion:
          type: int
          target_type: boolean
      
      - column: created_at
      - column: updated_at
```

### Configuration Options

#### Database Configuration

- **adapter**: Database type (`mariadb`, `postgres`, `mysql`, etc.)
- **host**: Database host
- **port**: Database port
- **user**: Database username
- **password**: Database password
- **database**: Database name

#### Migration Configuration

- **name**: Migration name (for logging and analytics)
- **table.source**: Source table name
- **table.target**: Target table name
- **columns**: Array of column configurations

#### Column Configuration

- **column**: Column name
- **primary**: Whether this is the primary key (used for checkpointing)
- **target_column**: Optional different target column name
- **conversion**: Optional data type conversion
  - **type**: Source data type
  - **target_type**: Target data type

#### Advanced Configuration

You can also configure logging, checkpointing, and performance options:

```yaml
# Logging configuration
logging:
  level: info  # error, warn, info, debug
  file: migration.log

# Checkpoint configuration
checkpoint:
  file: checkpoint.json
  autoSave: true

# Performance configuration
performance:
  batchSize: 1000
  maxRetries: 3
  retryDelay: 1000
```

### Supported Data Types

- `int` - Integer
- `boolean` - Boolean
- `float` - Floating point number
- `text` - Text string
- `uuid` - UUID string
- `bigint` - Large integer
- `tinytext` - Small text

## 🔄 How It Works

1. **Configuration Loading**: The tool reads your YAML configuration file
2. **Database Connection**: Establishes connections to both source and target databases
3. **Data Extraction**: Extracts data from the source database based on your column configuration
4. **Data Conversion**: Applies any specified data type conversions
5. **Checkpoint Management**: Tracks processed records to enable resumable migrations
6. **Data Insertion**: Inserts converted data into the target database
7. **Analytics**: Provides real-time progress updates and performance metrics

## 📊 Analytics

The tool provides real-time analytics including:

- **Migration Name**: Current migration being processed
- **Inserted Records**: Number of successfully inserted records
- **Total Records**: Total number of records to process
- **Progress Percentage**: Completion percentage
- **Time Taken**: Elapsed time
- **Estimated Time**: Estimated total completion time
- **Error Count**: Number of failed insertions

## 🛡️ Error Handling

- **Checkpoint System**: Automatically saves progress, allowing you to resume from where you left off
- **Error Tracking**: Tracks and reports failed insertions
- **Graceful Degradation**: Continues processing even if some records fail

## 🔧 API Reference

### Types

```typescript
interface DatabaseConfig {
  adapter: string;
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

interface MigrationConfig {
  name: string;
  table: {
    source: string;
    target: string;
  };
  columns: {
    column: string;
    primary: boolean;
    target_column?: string;
    conversion?: {
      type: 'int' | 'boolean' | 'float' | 'text' | 'uuid' | 'bigint' | 'tinytext';
      target_type?: 'int' | 'boolean' | 'float' | 'text' | 'uuid' | 'bigint' | 'tinytext';
    };
  }[];
}

interface AppConfig {
  database: {
    source: DatabaseConfig;
    target: DatabaseConfig;
  };
  migrations: MigrationConfig[];
  logging?: {
    level: 'error' | 'warn' | 'info' | 'debug';
    file?: string;
  };
  checkpoint?: {
    file: string;
    autoSave: boolean;
  };
  performance?: {
    batchSize: number;
    maxRetries: number;
    retryDelay: number;
  };
}
```

### Core Functions

- `configManager.loadFromFile(filePath: string)`: Load configuration from YAML file
- `convertData(data: any, migration: MigrationConfig)`: Convert data types according to migration rules
- `extractionQuery(migration: MigrationConfig)`: Generate SQL query for data extraction
- `makeInsertQuery(data: any, migration: MigrationConfig)`: Generate SQL insert query
- `saveInsertedIds(id: any, checkpointFile: string)`: Save processed record ID to checkpoint
- `formatAnalytics(analytics: any, avgTime: number)`: Format analytics display

## 📁 Project Structure

```
migration-database/
├── index.ts                    # Main migration logic
├── types.ts                    # TypeScript type definitions
├── src/                        # Source code modules
│   ├── config.ts              # Configuration management
│   ├── logger.ts              # Logging system
│   ├── errorHandler.ts        # Error handling
│   └── utils.ts               # Utility functions
├── test/                       # Test suite
│   ├── *.test.ts              # Individual test files
│   └── setup.ts               # Test setup
├── exemples/                   # Example configuration files
│   ├── 01.yaml                # Basic example
│   └── complete-example.yaml  # Complete example
├── package.json               # Project dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── checkpoint.json            # Checkpoint file (created during migration)
├── migration.log              # Migration log file
└── README.md                  # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/andreixhz/dbuum/issues) page
2. Create a new issue with detailed information about your problem
3. Include your configuration file (with sensitive data removed) and error logs

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Errors

**Problem**: Cannot connect to source or target database
**Solution**: 
- Verify database credentials and network connectivity
- Check if the database server is running
- Ensure firewall allows connections on the specified port
- Test connection using `bun test-connection.js`

#### Data Type Conversion Errors

**Problem**: Data conversion fails for specific columns
**Solution**:
- Check that source data matches the expected type
- Verify conversion rules in your configuration
- Use debug logging to see detailed conversion information

#### Checkpoint Issues

**Problem**: Migration doesn't resume from checkpoint
**Solution**:
- Check if `checkpoint.json` file exists and is readable
- Verify that the primary key column is correctly configured
- Delete checkpoint file to start fresh if needed

#### Performance Issues

**Problem**: Migration is slow or consuming too much memory
**Solution**:
- Adjust `batchSize` in performance configuration
- Monitor system resources during migration
- Consider running migrations during off-peak hours

### Debug Mode

Enable debug logging to get detailed information:

```yaml
logging:
  level: debug
  file: migration-debug.log
```

### FAQ

**Q: Can I migrate between different database engines?**
A: Yes, the tool supports migration between MySQL, PostgreSQL, MariaDB, and other SQL databases.

**Q: What happens if the migration is interrupted?**
A: The checkpoint system saves your progress. Simply run the same command again to resume from where it left off.

**Q: Can I customize data transformations?**
A: Currently, the tool supports basic data type conversions. Custom transformation functions are planned for future releases.

**Q: Is it safe to run migrations on production data?**
A: Always backup your data before running migrations. The tool includes checkpointing for safety, but backups are essential.

**Q: How do I handle large datasets?**
A: Use the `batchSize` configuration option to process data in smaller chunks and monitor system resources.

## 🔮 Roadmap

- [ ] Support for more database adapters
- [ ] Parallel processing for large datasets
- [ ] Web-based configuration interface
- [ ] Migration rollback functionality
- [ ] Data validation and integrity checks
- [ ] Custom transformation functions

---

Made with ❤️ using [Bun](https://bun.sh/)
