# Logging System

The backend now uses an environment-based logging system that allows you to control the verbosity of terminal output.

## Configuration

Add this to your `.env` file:

```env
LOG_LEVEL=info
```

## Log Levels

- **`none`**: No logs at all (cleanest output, production)
- **`error`**: Only errors are shown
- **`info`**: Important operations + errors (default, recommended for development)
- **`debug`**: All logs including detailed request/response info (most verbose)

## Usage Examples

### Clean Output (Production)
```env
LOG_LEVEL=none
```
Output:
```
Server running on port 5000
```

### Default Development
```env
LOG_LEVEL=info
```
Output:
```
Server running on port 5000
MongoDB connected
Connected DB name: habit-tracker
✅ Habit created: eating
✅ Habit deleted: going
```

### Full Debug Mode
```env
LOG_LEVEL=debug
```
Output:
```
Server running on port 5000
MongoDB connected
Connected DB name: habit-tracker
✅ habits.routes.js LOADED
📋 Returning habits: [...]
📝 Create habit request received
Request body: { title: 'eating' }
User from middleware: { id: '695fb7323454294b38a34d35' }
✅ Habit created: eating
🔄 Toggle request - Habit ID: 695ff4dfc43eccc83b63f890 Date: 2026-01-06
...
```

## Quick Start

1. Copy `.env.example` to `.env` if you haven't already
2. Set `LOG_LEVEL=info` for normal development
3. Set `LOG_LEVEL=none` when you want clean terminal output
4. Restart your server for changes to take effect
