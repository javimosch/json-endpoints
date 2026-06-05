// Interactive CLI class for JSON Endpoints
import readline from 'readline';
import { loadConfig, saveConfig, getDefaultApiUrl } from './config.js';
import * as commands from './commands.js';

export class InteractiveCLI {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.args = [];
    this.humanMode = true;
  }
  
  async question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }
  
  displayHeader() {
    console.clear();
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║                 🚀 JSON Endpoints CLI 🚀                    ║');
    console.log('║                                                              ║');
    console.log('║         Manage JSON endpoints via command line! 📄          ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log();
  }
  
  displayMenu() {
    console.log('📋 Available Options:');
    console.log();
    console.log('  1️⃣  List Endpoints      - Show all JSON endpoints');
    console.log('  2️⃣  Get Endpoint        - View a specific endpoint');
    console.log('  3️⃣  Create Endpoint     - Create a new JSON endpoint');
    console.log('  4️⃣  Update Endpoint     - Update an existing endpoint');
    console.log('  5️⃣  Delete Endpoint     - Delete an endpoint');
    console.log('  6️⃣  Configure API       - Set API URL and key');
    console.log('  7️⃣  Exit               - Quit the application');
    console.log();
  }
  
  async listEndpoints() {
    console.log('📋 All JSON Endpoints');
    console.log('═'.repeat(30));
    console.log();
    
    await commands.listEndpoints(this.args, this.humanMode);
    await this.question('Press Enter to continue...');
  }
  
  async getEndpoint() {
    console.log('🔍 Get JSON Endpoint');
    console.log('═'.repeat(30));
    console.log();
    
    const title = await this.question('Enter endpoint title: ');
    
    if (!title.trim()) {
      console.log('❌ Title cannot be empty!');
      await this.question('Press Enter to continue...');
      return;
    }
    
    await commands.getEndpoint(title, this.args, this.humanMode);
    await this.question('Press Enter to continue...');
  }
  
  async createEndpoint() {
    console.log('➕ Create JSON Endpoint');
    console.log('═'.repeat(30));
    console.log();
    
    const title = await this.question('Enter endpoint title: ');
    
    if (!title.trim()) {
      console.log('❌ Title cannot be empty!');
      await this.question('Press Enter to continue...');
      return;
    }
    
    console.log('Enter JSON content (press Enter twice to finish):');
    const jsonLines = [];
    let line;
    while ((line = await this.question('')) !== '') {
      jsonLines.push(line);
    }
    const jsonString = jsonLines.join('\n');
    
    // Validate JSON
    try {
      JSON.parse(jsonString);
    } catch (error) {
      console.log('❌ Invalid JSON format!');
      await this.question('Press Enter to continue...');
      return;
    }
    
    await commands.createEndpoint(title, jsonString, this.args, this.humanMode);
    await this.question('Press Enter to continue...');
  }
  
  async updateEndpoint() {
    console.log('✏️  Update JSON Endpoint');
    console.log('═'.repeat(30));
    console.log();
    
    const title = await this.question('Enter endpoint title to update: ');
    
    if (!title.trim()) {
      console.log('❌ Title cannot be empty!');
      await this.question('Press Enter to continue...');
      return;
    }
    
    console.log('Enter new JSON content (press Enter twice to finish):');
    const jsonLines = [];
    let line;
    while ((line = await this.question('')) !== '') {
      jsonLines.push(line);
    }
    const jsonString = jsonLines.join('\n');
    
    // Validate JSON
    try {
      JSON.parse(jsonString);
    } catch (error) {
      console.log('❌ Invalid JSON format!');
      await this.question('Press Enter to continue...');
      return;
    }
    
    await commands.updateEndpoint(title, jsonString, this.args, this.humanMode);
    await this.question('Press Enter to continue...');
  }
  
  async deleteEndpoint() {
    console.log('🗑️  Delete JSON Endpoint');
    console.log('═'.repeat(30));
    console.log();
    
    const title = await this.question('Enter endpoint title to delete: ');
    
    if (!title.trim()) {
      console.log('❌ Title cannot be empty!');
      await this.question('Press Enter to continue...');
      return;
    }
    
    const confirm = await this.question(`Are you sure you want to delete '${title}'? (y/n): `);
    
    if (confirm.toLowerCase().startsWith('y')) {
      await commands.deleteEndpoint(title, this.args, this.humanMode);
    } else {
      console.log('❌ Deletion cancelled.');
    }
    
    await this.question('Press Enter to continue...');
  }
  
  async configureApi() {
    console.log('⚙️  Configure API Settings');
    console.log('═'.repeat(30));
    console.log();
    
    const config = await loadConfig();
    console.log(`Current API URL: ${config.apiUrl || getDefaultApiUrl()}`);
    console.log(`Current API Key: ${config.apiKey ? '***' + config.apiKey.slice(-4) : 'Not set'}`);
    console.log();
    
    const newUrl = await this.question('Enter new API URL (press Enter to keep current): ');
    
    if (newUrl.trim()) {
      config.apiUrl = newUrl.trim();
      console.log('✅ API URL updated!');
    }
    
    const newKey = await this.question('Enter new API key (press Enter to keep current): ');
    
    if (newKey.trim()) {
      config.apiKey = newKey.trim();
      console.log('✅ API key updated!');
    }
    
    if (newUrl.trim() || newKey.trim()) {
      await saveConfig(config);
      console.log('✅ Configuration saved successfully!');
    } else {
      console.log('ℹ️  Configuration unchanged.');
    }
    
    await this.question('Press Enter to continue...');
  }
  
  async run() {
    while (true) {
      this.displayHeader();
      this.displayMenu();
      
      const choice = await this.question('Select an option (1-7): ');
      
      switch (choice.trim()) {
        case '1':
          await this.listEndpoints();
          break;
        case '2':
          await this.getEndpoint();
          break;
        case '3':
          await this.createEndpoint();
          break;
        case '4':
          await this.updateEndpoint();
          break;
        case '5':
          await this.deleteEndpoint();
          break;
        case '6':
          await this.configureApi();
          break;
        case '7':
          console.log('👋 Goodbye! Thanks for using JSON Endpoints CLI!');
          this.rl.close();
          return;
        default:
          console.log('❌ Invalid option. Please select 1-7.');
          await this.question('Press Enter to continue...');
      }
    }
  }
}
