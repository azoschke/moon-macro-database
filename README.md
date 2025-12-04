# FFXIV Cosmic Exploration Database

A comprehensive macro management system for Final Fantasy XIV's Dawntrail Cosmic Exploration crafting and gathering missions. This React-based web application helps players organize, search, and manage their crafting macros.

**[Live Demo](https://azoschke.github.io/moon-macro-database/)**

## Features

### Core Functionality
- **Complete CRUD Operations**: Create, read, update, and delete macro entries
- **Persistent Storage**: All data saved locally using localStorage
- **Multi-Item Support**: Manage multiple craft items per quest with individual macros
- **CSV Import/Export**: Full data import and export functionality

### Advanced Search & Filter
- **Dual Search Modes**: 
  - Text search across quest names, items, and notes
  - Numeric search for exact difficulty, quality, and durability values
- **Multiple Filters**:
  - Category/Class filtering (A-D, Expert, Sequential, Time-Restricted, Critical)
  - Location filtering with multi-select support
  - Job filtering for all DoH classes
- **Auto-Sorting**: Entries automatically sorted by class tier then alphabetically

### UI/UX Features
- **Compact Design**: Streamlined interface with collapsible entries
- **Category Indicators**: Color-coded icons for different mission types
- **Copy-to-Clipboard**: Quick copy buttons for each macro part
- **Inline Editing**: Edit all fields without leaving the main view

### Data Management
- **CSV Import/Export**: Import and export all data in spreadsheet format
- **Data Rewards Tracking**: Track Cosmic data rewards (I-V tiers) per job
- **Food Requirements**: Track which missions require food buffs

## Installation

### Option 1: Use Hosted Version
Simply visit [https://azoschke.github.io/moon-macro-database/](https://azoschke.github.io/moon-macro-database/)

### Option 2: Local Development

1. Clone the repository:
```bash
git clone https://github.com/azoschke/moon-macro-database.git
```

## Usage Guide

### Adding a New Macro
1. Click the **"Add New"** button below the filters
2. Fill in the required fields:
   - Quest Name
   - Location(s)
   - Job(s)
   - Category (Class A-D, Expert, etc.)
   - Food requirements (optional)
   - Data Rewards for the selected job
   - Item details (name, difficulty, quality, durability)
3. Click **"Add Macro"** to save

### Managing Entries
- **View Details**: Click on any entry to expand and see full details
- **Edit**: Click the edit icon in the top-right of an entry
- **Copy Macros**: Click copy buttons on individual macro parts
- **Delete**: Expand entry and click "Delete Entry" at the bottom

### Search & Filter
- **Text Search**: Search across quest names, items, and notes
- **Numeric Search**: Find exact matches for difficulty, quality, or durability
- **Filters**: Use dropdowns to filter by category, location, or job
- **Clear Filters**: Reset all search criteria with one click

### Importing/Exporting Data
- **Export**: Click "Export Data" to download your database as a CSV file
- **Import**: Click "Import Data" and select a CSV file to import entries

## Technical Details

### Technologies Used
- **React** 18.x with Hooks
- **localStorage** for data persistence

## Disclaimer

This project is not affiliated with Square Enix or Final Fantasy XIV. All game content and materials are trademarks and copyrights of Square Enix and its licensors.
