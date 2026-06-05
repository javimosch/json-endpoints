#!/usr/bin/env node

import { fileURLToPath } from 'url';
import * as commands from './lib/commands.js';
import { InteractiveCLI } from './lib/interactive.js';

const __filename = fileURLToPath(import.meta.url);

// Command line argument parsing
const args = process.argv.slice(2);
const hasHelpFlag = args.includes('--help') || args.includes('-h');
const hasHumanFlag = args.includes('--human') || args.includes('-H');
const hasJsonFlag = args.includes('--json') || args.includes('-j');

// Parse subcommands (handle quoted JSON properly)
let subcommand = args[0];
let subcommandArgs = [];

// Find the separator between command and JSON content
const jsonSeparatorIndex = args.indexOf('--');
if (jsonSeparatorIndex !== -1) {
  subcommand = args[0];
  subcommandArgs = args.slice(1, jsonSeparatorIndex);
  const jsonContent = args.slice(jsonSeparatorIndex + 1).join(' ');
  if (jsonContent) {
    subcommandArgs.push(jsonContent);
  }
} else {
  subcommand = args[0];
  // Filter out flags to get actual arguments
  subcommandArgs = [];
  let i = 1;
  while (i < args.length) {
    if (args[i].startsWith('--')) {
      // Skip flag and its value if it has one
      if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
        i += 2;
      } else {
        i += 1;
      }
    } else {
      subcommandArgs.push(args[i]);
      i++;
    }
  }
}

// Show help if requested
if (hasHelpFlag || !subcommand) {
  console.log(`
🚀 JSON Endpoints CLI

Usage:
  json-endpoints <command> [options]

Commands:
  list                    List all JSON endpoints
  get <title>            Get a specific JSON endpoint by title
  create <title> <json>  Create a new JSON endpoint
  update <title> <json>  Update an existing JSON endpoint
  delete <title>         Delete a JSON endpoint
  interactive            Run in interactive mode

Global Options:
  --human, -H            Human-readable output
  --json, -j             JSON output (default)
  --help, -h             Show this help message
  --api-url <url>        API base URL (default: http://localhost:3000)
  --api-key <key>        API key for authentication

Examples:
  json-endpoints list
  json-endpoints get my-config
  json-endpoints create my-config '{"key":"value"}'
  json-endpoints update my-config '{"key":"newvalue"}'
  json-endpoints delete my-config
  json-endpoints list --human
  json-endpoints list --api-url https://json-endpoints.dk2.intrane.fr

For more information, visit: https://github.com/javimosch/json-endpoints
`);
  process.exit(0);
}

// Main execution
if (subcommand === 'interactive') {
  const cli = new InteractiveCLI();
  cli.args = args;
  cli.humanMode = hasHumanFlag;
  cli.run().catch(error => {
    if (error.message && error.message.includes('readline was closed')) {
      console.log('\n👋 CLI session terminated.');
    } else {
      console.error('❌ Fatal error in CLI:', error.message);
    }
    process.exit(1);
  });
} else {
  // Execute subcommand
  switch (subcommand) {
    case 'list':
      commands.listEndpoints(args, hasHumanFlag);
      break;
    case 'get':
      commands.getEndpoint(subcommandArgs[0], args, hasHumanFlag);
      break;
    case 'create':
      commands.createEndpoint(subcommandArgs[0], subcommandArgs.slice(1).join(' '), args, hasHumanFlag);
      break;
    case 'update':
      commands.updateEndpoint(subcommandArgs[0], subcommandArgs.slice(1).join(' '), args, hasHumanFlag);
      break;
    case 'delete':
      commands.deleteEndpoint(subcommandArgs[0], args, hasHumanFlag);
      break;
    default:
      console.error(`❌ Unknown command: ${subcommand}`);
      console.error('Run --help for usage information');
      process.exit(1);
  }
}
