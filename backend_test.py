#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
from pathlib import Path

class TealorModeAPITester:
    def __init__(self, base_url="https://bio-link-fitness.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
            self.failed_tests.append({"test": name, "error": details})

    def test_api_health(self):
        """Test API health endpoint"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            if success:
                data = response.json()
                success = data.get("status") == "online"
                details = f"Status: {response.status_code}, Data: {data}"
            else:
                details = f"Status: {response.status_code}"
            
            self.log_test("API Health Check", success, details if not success else "")
            return success
        except Exception as e:
            self.log_test("API Health Check", False, str(e))
            return False

    def test_pdf_download(self):
        """Test PDF download endpoint"""
        try:
            response = requests.get(f"{self.api_url}/download/protocolo-abs", timeout=15)
            success = response.status_code == 200
            
            if success:
                # Check if response is actually a PDF
                content_type = response.headers.get('content-type', '')
                success = 'application/pdf' in content_type
                details = f"Content-Type: {content_type}, Size: {len(response.content)} bytes"
            else:
                details = f"Status: {response.status_code}, Response: {response.text[:200]}"
            
            self.log_test("PDF Download", success, details if not success else "")
            return success
        except Exception as e:
            self.log_test("PDF Download", False, str(e))
            return False

    def test_check_pdf_exists(self):
        """Test PDF existence check endpoint"""
        try:
            response = requests.get(f"{self.api_url}/download/check-pdf", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                success = data.get("exists", False)
                details = f"PDF exists: {data.get('exists')}, Path: {data.get('path')}"
            else:
                details = f"Status: {response.status_code}"
            
            self.log_test("PDF Existence Check", success, details if not success else "")
            return success
        except Exception as e:
            self.log_test("PDF Existence Check", False, str(e))
            return False

    def test_track_download_click(self):
        """Test analytics tracking for download clicks"""
        try:
            payload = {
                "button_type": "download",
                "button_name": "protocolo-abs"
            }
            response = requests.post(
                f"{self.api_url}/analytics/click",
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            success = response.status_code == 200
            if success:
                data = response.json()
                success = data.get("success", False)
                details = f"Response: {data}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text[:200]}"
            
            self.log_test("Track Download Click", success, details if not success else "")
            return success
        except Exception as e:
            self.log_test("Track Download Click", False, str(e))
            return False

    def test_track_social_click(self):
        """Test analytics tracking for social media clicks"""
        try:
            payload = {
                "button_type": "social",
                "button_name": "youtube"
            }
            response = requests.post(
                f"{self.api_url}/analytics/click",
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            success = response.status_code == 200
            if success:
                data = response.json()
                success = data.get("success", False)
                details = f"Response: {data}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text[:200]}"
            
            self.log_test("Track Social Click", success, details if not success else "")
            return success
        except Exception as e:
            self.log_test("Track Social Click", False, str(e))
            return False

    def test_get_analytics_stats(self):
        """Test getting analytics statistics"""
        try:
            response = requests.get(f"{self.api_url}/analytics/stats", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                success = data.get("success", False) and "stats" in data
                details = f"Stats count: {len(data.get('stats', []))}, Total clicks: {data.get('total_clicks', 0)}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text[:200]}"
            
            self.log_test("Get Analytics Stats", success, details if not success else "")
            return success
        except Exception as e:
            self.log_test("Get Analytics Stats", False, str(e))
            return False

    def test_get_download_stats(self):
        """Test getting download statistics"""
        try:
            response = requests.get(f"{self.api_url}/download/stats", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                success = data.get("success", False) and "download_count" in data
                details = f"Download count: {data.get('download_count', 0)}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text[:200]}"
            
            self.log_test("Get Download Stats", success, details if not success else "")
            return success
        except Exception as e:
            self.log_test("Get Download Stats", False, str(e))
            return False

    def test_multiple_download_tracking(self):
        """Test that multiple downloads are tracked correctly"""
        try:
            # Get initial download count
            initial_response = requests.get(f"{self.api_url}/download/stats", timeout=10)
            if initial_response.status_code != 200:
                self.log_test("Multiple Download Tracking", False, "Could not get initial stats")
                return False
            
            initial_count = initial_response.json().get("download_count", 0)
            
            # Perform 2 downloads
            for i in range(2):
                download_response = requests.get(f"{self.api_url}/download/protocolo-abs", timeout=15)
                if download_response.status_code != 200:
                    self.log_test("Multiple Download Tracking", False, f"Download {i+1} failed")
                    return False
            
            # Check final count
            final_response = requests.get(f"{self.api_url}/download/stats", timeout=10)
            if final_response.status_code != 200:
                self.log_test("Multiple Download Tracking", False, "Could not get final stats")
                return False
            
            final_count = final_response.json().get("download_count", 0)
            expected_count = initial_count + 2
            success = final_count == expected_count
            
            details = f"Initial: {initial_count}, Final: {final_count}, Expected: {expected_count}"
            self.log_test("Multiple Download Tracking", success, details if not success else "")
            return success
            
        except Exception as e:
            self.log_test("Multiple Download Tracking", False, str(e))
            return False

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Tealor Mode Backend API Tests")
        print(f"🌐 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test API health first
        if not self.test_api_health():
            print("\n❌ API is not responding. Stopping tests.")
            return False
        
        # Run all tests
        self.test_check_pdf_exists()
        self.test_pdf_download()
        self.test_track_download_click()
        self.test_track_social_click()
        self.test_get_analytics_stats()
        self.test_get_download_stats()
        self.test_multiple_download_tracking()
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.failed_tests:
            print("\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"  - {test['test']}: {test['error']}")
        
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    tester = TealorModeAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())