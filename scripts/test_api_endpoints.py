#!/usr/bin/env python3
"""
Script to test API endpoints for the Mental Health App
"""
import requests
import time

# Define the base URLs for all services
BASE_URLS = {
    'auth': 'http://localhost:8001',
    'text': 'http://localhost:8002',
    'voice': 'http://localhost:8003',
    'face': 'http://localhost:8004',
    'fusion': 'http://localhost:8005',
    'doctor': 'http://localhost:8006',
    'notification': 'http://localhost:8007',
    'report': 'http://localhost:8008',
}

def test_endpoint(url, endpoint, method='GET', data=None):
    """Test a single endpoint"""
    try:
        full_url = f"{url}{endpoint}"
        if method == 'GET':
            response = requests.get(full_url, timeout=5)
        elif method == 'POST':
            response = requests.post(full_url, json=data, timeout=5)
        
        status = "✓ PASS" if response.status_code < 400 else "✗ FAIL"
        return {
            'url': full_url,
            'status': status,
            'status_code': response.status_code,
            'response_time': response.elapsed.total_seconds()
        }
    except requests.exceptions.RequestException as e:
        return {
            'url': f"{url}{endpoint}",
            'status': '✗ ERROR',
            'error': str(e),
            'status_code': 'N/A'
        }

def test_all_services():
    """Test all services"""
    print("Testing Mental Health App API Endpoints")
    print("=" * 50)
    
    # Test each service
    results = []
    
    # Auth Service
    print("\n1. Auth Service (Port 8001)")
    results.append(test_endpoint(BASE_URLS['auth'], '/', 'GET'))
    
    # Text Service
    print("\n2. Text Analysis Service (Port 8002)")
    results.append(test_endpoint(BASE_URLS['text'], '/', 'GET'))
    
    # Voice Service
    print("\n3. Voice Analysis Service (Port 8003)")
    results.append(test_endpoint(BASE_URLS['voice'], '/', 'GET'))
    
    # Face Service
    print("\n4. Face Analysis Service (Port 8004)")
    results.append(test_endpoint(BASE_URLS['face'], '/', 'GET'))
    
    # Fusion Service
    print("\n5. Fusion Service (Port 8005)")
    results.append(test_endpoint(BASE_URLS['fusion'], '/', 'GET'))
    
    # Doctor Service
    print("\n6. Doctor Service (Port 8006)")
    results.append(test_endpoint(BASE_URLS['doctor'], '/', 'GET'))
    
    # Notification Service
    print("\n7. Notification Service (Port 8007)")
    results.append(test_endpoint(BASE_URLS['notification'], '/', 'GET'))
    
    # Report Service
    print("\n8. Report Service (Port 8008)")
    results.append(test_endpoint(BASE_URLS['report'], '/', 'GET'))
    
    # Print results
    print("\n" + "=" * 80)
    print("API ENDPOINT TEST RESULTS")
    print("=" * 80)
    print(f"{'STATUS':<10} {'ENDPOINT':<40} {'CODE':<8} {'TIME (s)':<10}")
    print("-" * 80)
    
    for result in results:
        status = result['status']
        url = result['url']
        code = result['status_code']
        response_time = result.get('response_time', 'N/A')
        
        print(f"{status:<10} {url:<40} {code:<8} {response_time:<10}")
        
        # Print error details if any
        if 'error' in result:
            print(f"         Error: {result['error']}")
    
    print("=" * 80)

if __name__ == "__main__":
    test_all_services()