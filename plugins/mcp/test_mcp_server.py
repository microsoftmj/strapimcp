#!/usr/bin/env python3
"""
Test script for the Strapi MCP server
"""
import json
import requests
import sys

def test_health():
    """Test the health endpoint"""
    try:
        response = requests.get("http://localhost:8000/health")
        print(f"Health check: {response.status_code}")
        print(json.dumps(response.json(), indent=2))
        return response.status_code == 200
    except Exception as e:
        print(f"Error testing health endpoint: {e}")
        return False

def test_tools_list():
    """Test the tools/list endpoint"""
    try:
        response = requests.get("http://localhost:8000/tools/list")
        print(f"Tools list: {response.status_code}")
        print(json.dumps(response.json(), indent=2))
        return response.status_code == 200
    except Exception as e:
        print(f"Error testing tools/list endpoint: {e}")
        return False

def test_resources_list():
    """Test the resources/list endpoint"""
    try:
        response = requests.get("http://localhost:8000/resources/list")
        print(f"Resources list: {response.status_code}")
        print(json.dumps(response.json(), indent=2))
        return response.status_code == 200
    except Exception as e:
        print(f"Error testing resources/list endpoint: {e}")
        return False

def main():
    """Run all tests"""
    print("Testing Strapi MCP server...")
    
    health_ok = test_health()
    tools_ok = test_tools_list()
    resources_ok = test_resources_list()
    
    print("\nTest results:")
    print(f"Health check: {'PASS' if health_ok else 'FAIL'}")
    print(f"Tools list: {'PASS' if tools_ok else 'FAIL'}")
    print(f"Resources list: {'PASS' if resources_ok else 'FAIL'}")
    
    if health_ok and tools_ok and resources_ok:
        print("\nAll tests passed!")
        return 0
    else:
        print("\nSome tests failed.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
