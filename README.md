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

## 📋 Prerequisites

- [Bun](https://bun.sh/) installed on your system
- Access to both source and target databases
- TypeScript (peer dependency)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd migration-database
```

2. Install dependencies:
```bash
bun install
```

## 📖 Usage

### Basic Usage

```bash
bun start <config-file.yaml>
```

### Example Commands

```bash
bun start my-migration.yaml
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

- **adapter**: Database type (mariadb, postgres, mysql, etc.)
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
- **conversion**: Optional data type conversion
  - **type**: Source data type
  - **target_type**: Target data type

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

## 📁 Project Structure

```
migration-database/
├── index.ts              # Main migration logic
├── insert.ts             # Example insert script
├── types.ts              # TypeScript type definitions
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── checkpoint.json       # Checkpoint file (created during migration)
├── exemples/             # Example configuration files
│   ├── 01.yaml
│   └── 02.yaml
└── README.md             # This file
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

1. Check the [Issues](https://github.com/your-username/migration-database/issues) page
2. Create a new issue with detailed information about your problem
3. Include your configuration file (with sensitive data removed) and error logs

## 🔮 Roadmap

- [ ] Support for more database adapters
- [ ] Parallel processing for large datasets
- [ ] Web-based configuration interface
- [ ] Migration rollback functionality
- [ ] Data validation and integrity checks
- [ ] Custom transformation functions

---

Made with ❤️ using [Bun](https://bun.sh/)
