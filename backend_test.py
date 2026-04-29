#!/usr/bin/env python3

import requests
import sys
import json
import uuid
from datetime import datetime
from pathlib import Path

class TealorModeLeadGenTester:
    def __init__(self, base_url="https://bio-link-fitness.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.test_email = f"test_{uuid.uuid4().hex[:8]}@example.com"

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

    def test_email_capture(self):
        """Test email capture functionality"""
        try:
            payload = {
                "email": self.test_email,
                "source": "main_form"
            }
            response = requests.post(
                f"{self.api_url}/email/capture",
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            success = response.status_code == 200
            if success:
                data = response.json()
                success = data.get("success", False) and data.get("email") == self.test_email
                details = f"Response: {data}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text[:200]}"
            
            self.log_test("Email Capture", success, details if not success else "")
            return success
        except Exception as e:
            self.log_test("Email Capture", False, str(e))
            return False

    def test_duplicate_email_handling(self):
        """Test duplicate email handling (should update timestamp)"""
        try:
            # Submit same email again
            payload = {
                "email": self.test_email,
                "source": "hero_cta"
            }
            response = requests.post(
                f"{self.api_url}/email/capture",
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
            
            self.log_test("Duplicate Email Handling", success, details if not success else "")
            return success
        except Exception as e:
            self.log_test("Duplicate Email Handling", False, str(e))
            return False

    def test_mark_pdf_downloaded(self):
        """Test marking email as PDF downloaded"""
        try:
            response = requests.post(
                f"{self.api_url}/email/mark-downloaded/{self.test_email}",
                timeout=10
            )
            
            success = response.status_code == 200
            if success:
                data = response.json()
                success = data.get("success", False)
                details = f"Response: {data}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text[:200]}"
            
            self.log_test("Mark PDF Downloaded", success, details if not success else "")
            return success
        except Exception as e:
            self.log_test("Mark PDF Downloaded", False, str(e))
            return False

    def test_email_list(self):
        """Test getting email list"""
        try:
            response = requests.get(f"{self.api_url}/email/list?limit=10", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                success = data.get("success", False) and "emails" in data and "total_emails" in data
                details = f"Total emails: {data.get('total_emails', 0)}, Retrieved: {len(data.get('emails', []))}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text[:200]}"
            
            self.log_test("Email List", success, details if not success else "")
            return success
        except Exception as e:
            self.log_test("Email List", False, str(e))
            return False

    def test_email_stats(self):
        """Test getting email statistics"""
        try:
            response = requests.get(f"{self.api_url}/email/stats", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                success = data.get("success", False) and "total_emails" in data
                details = f"Total: {data.get('total_emails', 0)}, Downloaded: {data.get('downloaded_pdf', 0)}, Conversion: {data.get('conversion_rate', 0)}%"
            else:
                details = f"Status: {response.status_code}, Response: {response.text[:200]}"
            
            self.log_test("Email Stats", success, details if not success else "")
            return success
        except Exception as e:
            self.log_test("Email Stats", False, str(e))
            return False

    def test_email_export_csv(self):
        """Test CSV export functionality"""
        try:
            response = requests.get(f"{self.api_url}/email/export/csv", timeout=15)
            success = response.status_code == 200
            
            if success:
                content_type = response.headers.get('content-type', '')
                success = 'text/csv' in content_type
                details = f"Content-Type: {content_type}, Size: {len(response.content)} bytes"
            else:
                details = f"Status: {response.status_code}, Response: {response.text[:200]}"
            
            self.log_test("Email CSV Export", success, details if not success else "")
            return success
        except Exception as e:
            self.log_test("Email CSV Export", False, str(e))
            return False

    def test_email_validation(self):
        """Test email validation with invalid email"""
        try:
            payload = {
                "email": "invalid-email",
                "source": "test"
            }
            response = requests.post(
                f"{self.api_url}/email/capture",
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            # Should return 422 for validation error
            success = response.status_code == 422
            details = f"Status: {response.status_code}, Response: {response.text[:200]}"
            
            self.log_test("Email Validation", success, details if not success else "")
            return success
        except Exception as e:
            self.log_test("Email Validation", False, str(e))
            return False

    def test_track_email_capture_click(self):
        """Test analytics tracking for email capture clicks"""
        try:
            payload = {
                "button_type": "email_capture",
                "button_name": "main_form"
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
            
            self.log_test("Track Email Capture Click", success, details if not success else "")
            return success
        except Exception as e:
            self.log_test("Track Email Capture Click", False, str(e))
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

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Tealor Mode Lead Generation Backend Tests")
        print(f"🌐 Testing against: {self.base_url}")
        print(f"📧 Test email: {self.test_email}")
        print("=" * 60)
        
        # Test API health first
        if not self.test_api_health():
            print("\n❌ API is not responding. Stopping tests.")
            return False
        
        # Test email capture system
        self.test_email_capture()
        self.test_duplicate_email_handling()
        self.test_mark_pdf_downloaded()
        self.test_email_list()
        self.test_email_stats()
        self.test_email_export_csv()
        self.test_email_validation()
        
        # Test analytics and downloads
        self.test_track_email_capture_click()
        self.test_track_social_click()
        self.test_pdf_download()
        self.test_get_analytics_stats()
        
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
    tester = TealorModeLeadGenTester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())