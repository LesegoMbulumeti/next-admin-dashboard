import requests
import unittest

class TestCORSHeaders(unittest.TestCase):
    """Test case to verify CORS headers are properly set in the server responses."""
    
    def setUp(self):
        """Set up the test case with the base URL."""
        self.base_url = "http://localhost:8000"
        
    def test_cors_headers_present(self):
        """Test that CORS headers are present in the response."""
        # Send an OPTIONS request to simulate a CORS preflight request
        headers = {
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "Content-Type"
        }
        
        response = requests.options(f"{self.base_url}/products", headers=headers)
        
        # Check that the response has the necessary CORS headers
        self.assertEqual(response.status_code, 200)
        self.assertIn("Access-Control-Allow-Origin", response.headers)
        self.assertEqual(response.headers["Access-Control-Allow-Origin"], "http://localhost:3000")
        self.assertIn("Access-Control-Allow-Methods", response.headers)
        self.assertIn("GET", response.headers["Access-Control-Allow-Methods"])
        
    def test_get_products_cors(self):
        """Test that a GET request to /products has CORS headers."""
        headers = {
            "Origin": "http://localhost:3000"
        }
        
        response = requests.get(f"{self.base_url}/products", headers=headers)
        
        # Check that the response has the necessary CORS headers
        self.assertEqual(response.status_code, 200)
        self.assertIn("Access-Control-Allow-Origin", response.headers)
        self.assertEqual(response.headers["Access-Control-Allow-Origin"], "http://localhost:3000")

if __name__ == "__main__":
    print("Running CORS header tests...")
    print("Note: Make sure the server is running on http://localhost:8000 before running these tests.")
    unittest.main()