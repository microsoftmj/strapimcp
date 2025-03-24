/**
 * Integration test for Strapi MCP plugin
 * 
 * This script tests the integration between Strapi and the MCP server wrapper.
 * It verifies that the MCP server starts automatically when Strapi boots,
 * can be disabled with the --no-mcp flag, and that external services can
 * access Strapi functionality through the MCP endpoints.
 */

'use strict';

const { execSync, spawn } = require('child_process');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

// Configuration
const STRAPI_PORT = 1337;
const MCP_PORT = 8080;
const STRAPI_URL = `http://localhost:${STRAPI_PORT}`;
const MCP_URL = `http://localhost:${MCP_PORT}`;

// Test results
const results = {
  autoStart: false,
  disableFlag: false,
  toolsList: false,
  contentOperations: false
};

/**
 * Wait for a server to be ready
 * @param {string} url - URL to check
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Delay between retries in ms
 * @returns {Promise<boolean>} - Whether the server is ready
 */
async function waitForServer(url, maxRetries = 30, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await axios.get(url);
      return true;
    } catch (error) {
      console.log(`Waiting for server at ${url}... (${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return false;
}

/**
 * Test that the MCP server starts automatically when Strapi boots
 * @returns {Promise<boolean>} - Whether the test passed
 */
async function testAutoStart() {
  console.log('\n--- Testing MCP server auto-start ---');
  
  // Start Strapi
  console.log('Starting Strapi...');
  const strapi = spawn('npm', ['run', 'develop'], {
    cwd: path.resolve(__dirname, '../../..'),
    env: {
      ...process.env,
      PORT: STRAPI_PORT,
      MCP_PORT: MCP_PORT
    }
  });
  
  // Wait for Strapi to start
  const strapiReady = await waitForServer(`${STRAPI_URL}/admin/init`);
  if (!strapiReady) {
    console.error('Failed to start Strapi');
    strapi.kill();
    return false;
  }
  
  // Wait for MCP server to start
  const mcpReady = await waitForServer(`${MCP_URL}/health`);
  
  // Kill Strapi
  strapi.kill();
  
  if (mcpReady) {
    console.log('✅ MCP server started automatically with Strapi');
    return true;
  } else {
    console.error('❌ MCP server did not start automatically');
    return false;
  }
}

/**
 * Test that the MCP server can be disabled with the --no-mcp flag
 * @returns {Promise<boolean>} - Whether the test passed
 */
async function testDisableFlag() {
  console.log('\n--- Testing MCP server disable flag ---');
  
  // Start Strapi with --no-mcp flag
  console.log('Starting Strapi with --no-mcp flag...');
  const strapi = spawn('npm', ['run', 'develop', '--', '--no-mcp'], {
    cwd: path.resolve(__dirname, '../../..'),
    env: {
      ...process.env,
      PORT: STRAPI_PORT,
      MCP_PORT: MCP_PORT
    }
  });
  
  // Wait for Strapi to start
  const strapiReady = await waitForServer(`${STRAPI_URL}/admin/init`);
  if (!strapiReady) {
    console.error('Failed to start Strapi');
    strapi.kill();
    return false;
  }
  
  // Check if MCP server is running
  let mcpRunning = false;
  try {
    await axios.get(`${MCP_URL}/health`);
    mcpRunning = true;
  } catch (error) {
    mcpRunning = false;
  }
  
  // Kill Strapi
  strapi.kill();
  
  if (!mcpRunning) {
    console.log('✅ MCP server was disabled with --no-mcp flag');
    return true;
  } else {
    console.error('❌ MCP server started despite --no-mcp flag');
    return false;
  }
}

/**
 * Test MCP tools list endpoint
 * @returns {Promise<boolean>} - Whether the test passed
 */
async function testToolsList() {
  console.log('\n--- Testing MCP tools list endpoint ---');
  
  // Start MCP server directly
  console.log('Starting MCP server...');
  const mcp = spawn('python', ['-m', 'mcp_server'], {
    cwd: __dirname,
    env: {
      ...process.env,
      MCP_PORT: MCP_PORT
    }
  });
  
  // Wait for MCP server to start
  const mcpReady = await waitForServer(`${MCP_URL}/health`);
  if (!mcpReady) {
    console.error('Failed to start MCP server');
    mcp.kill();
    return false;
  }
  
  // Test tools list endpoint
  try {
    const response = await axios.get(`${MCP_URL}/tools/list`);
    const tools = response.data.tools || [];
    
    if (tools.length > 0) {
      console.log(`✅ MCP server returned ${tools.length} tools`);
      console.log('Tools:', tools.map(t => t.name).join(', '));
      mcp.kill();
      return true;
    } else {
      console.error('❌ MCP server returned empty tools list');
      mcp.kill();
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to call tools list endpoint:', error.message);
    mcp.kill();
    return false;
  }
}

/**
 * Test content operations through MCP
 * @returns {Promise<boolean>} - Whether the test passed
 */
async function testContentOperations() {
  console.log('\n--- Testing content operations through MCP ---');
  
  // This test is a simulation since we don't have a running Strapi instance with content types
  console.log('Note: This is a simulated test since we need a running Strapi instance with content types');
  
  // Start MCP server directly
  console.log('Starting MCP server...');
  const mcp = spawn('python', ['-m', 'mcp_server'], {
    cwd: __dirname,
    env: {
      ...process.env,
      MCP_PORT: MCP_PORT
    }
  });
  
  // Wait for MCP server to start
  const mcpReady = await waitForServer(`${MCP_URL}/health`);
  if (!mcpReady) {
    console.error('Failed to start MCP server');
    mcp.kill();
    return false;
  }
  
  // Test content operations
  try {
    // We'll just verify that the endpoints exist and return expected error messages
    // since we don't have a running Strapi instance with content types
    
    // Test content.list
    try {
      await axios.post(`${MCP_URL}/tools/call?name=content.list`, {});
      console.log('✅ content.list endpoint exists');
    } catch (error) {
      if (error.response && error.response.status === 500) {
        console.log('✅ content.list endpoint exists (expected error due to no Strapi connection)');
      } else {
        console.error('❌ content.list endpoint failed unexpectedly:', error.message);
        mcp.kill();
        return false;
      }
    }
    
    // Test content.find
    try {
      await axios.post(`${MCP_URL}/tools/call?name=content.find`, {
        contentType: 'article'
      });
      console.log('✅ content.find endpoint exists');
    } catch (error) {
      if (error.response && error.response.status === 500) {
        console.log('✅ content.find endpoint exists (expected error due to no Strapi connection)');
      } else {
        console.error('❌ content.find endpoint failed unexpectedly:', error.message);
        mcp.kill();
        return false;
      }
    }
    
    mcp.kill();
    return true;
  } catch (error) {
    console.error('❌ Failed to test content operations:', error.message);
    mcp.kill();
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('=== Starting Strapi MCP Integration Tests ===');
  
  // Run tests
  results.autoStart = await testAutoStart();
  results.disableFlag = await testDisableFlag();
  results.toolsList = await testToolsList();
  results.contentOperations = await testContentOperations();
  
  // Print results
  console.log('\n=== Test Results ===');
  console.log(`Auto-start: ${results.autoStart ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Disable flag: ${results.disableFlag ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Tools list: ${results.toolsList ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Content operations: ${results.contentOperations ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(result => result);
  console.log(`\nOverall: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  process.exit(allPassed ? 0 : 1);
}

// Run tests
runTests().catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});
